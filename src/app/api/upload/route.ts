import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import { getSupabaseClient, isSupabaseStorageConfigured, SUPABASE_STORAGE_BUCKET } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

const ALLOWED_EXTENSIONS = new Set([
  '.jpg', '.jpeg', '.png', '.webp', '.gif',
  '.avif', '.heic', '.heif', '.jfif', '.bmp',
  '.tiff', '.tif', '.svg', '.ico'
]);

function getMimeType(ext: string, isSvg: boolean): string {
  if (isSvg || ext === '.svg') return 'image/svg+xml';
  switch (ext) {
    case '.webp': return 'image/webp';
    case '.png': return 'image/png';
    case '.gif': return 'image/gif';
    case '.avif': return 'image/avif';
    case '.jpg':
    case '.jpeg':
    case '.jfif': return 'image/jpeg';
    default: return 'application/octet-stream';
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file = data.get('file') as unknown as File | null;

    if (!file || typeof file !== 'object' || typeof (file as any).arrayBuffer !== 'function') {
      return NextResponse.json({ error: 'No file provided or invalid upload payload.' }, { status: 400 });
    }

    const fileName = file.name || 'uploaded_image.jpg';
    const fileExt = path.extname(fileName).toLowerCase();
    const rawMimeType = (file.type || '').toLowerCase();

    // 25MB max size limit (permits high-res phone camera uploads)
    const MAX_FILE_SIZE = 25 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum allowed size is 25MB.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (buffer.length === 0) {
      return NextResponse.json({ error: 'Uploaded file is empty.' }, { status: 400 });
    }

    // Inspect image metadata with Sharp (format-agnostic, inspects magic bytes)
    let metadata: any = null;
    let isSvg = false;

    // Check SVG
    if (
      rawMimeType.includes('svg') ||
      fileExt === '.svg' ||
      buffer.toString('utf-8', 0, 100).toLowerCase().includes('<svg')
    ) {
      isSvg = true;
    } else {
      try {
        metadata = await sharp(buffer, { failOn: 'none' }).metadata();
      } catch (e) {
        // Sharp could not parse metadata (e.g. unknown format)
      }
    }

    // Validate that it is genuinely an image
    const isValidFormat = Boolean(metadata?.format) || isSvg || ALLOWED_EXTENSIONS.has(fileExt) || rawMimeType.startsWith('image/');
    if (!isValidFormat) {
      return NextResponse.json(
        { error: 'Invalid file format. Please upload an image file (JPG, PNG, WebP, GIF, etc.).' },
        { status: 400 }
      );
    }

    let outputBuffer: Buffer;
    let finalExt = '.webp';
    let outputWidth: number | undefined;
    let outputHeight: number | undefined;

    try {
      if (isSvg) {
        outputBuffer = buffer;
        finalExt = '.svg';
      } else if (metadata?.format === 'gif' && (metadata.pages || 0) > 1) {
        // Preserve animated GIFs
        outputBuffer = buffer;
        finalExt = '.gif';
        outputWidth = metadata.width;
        outputHeight = metadata.height;
      } else {
        // Auto-orient based on camera EXIF (fixes sideways iPhone/Android photos)
        // Resize to high-resolution web-friendly dimensions (max 2560px on longest edge)
        // Convert to highly optimized modern WebP with smart subsampling
        outputBuffer = await sharp(buffer, { failOn: 'none' })
          .rotate()
          .resize({
            width: 2560,
            height: 2560,
            fit: 'inside',
            withoutEnlargement: true,
          })
          .webp({
            quality: 85,
            effort: 4,
            smartSubsample: true,
          })
          .toBuffer();

        const outMeta = await sharp(outputBuffer).metadata();
        outputWidth = outMeta.width;
        outputHeight = outMeta.height;
        finalExt = '.webp';
      }
    } catch (sharpErr) {
      console.warn('Sharp optimization warning, falling back to original buffer:', sharpErr);
      outputBuffer = buffer;
      finalExt = ALLOWED_EXTENSIONS.has(fileExt) ? fileExt : '.jpg';
    }

    const uniqueName = `ceylon_${Date.now()}_${Math.random().toString(36).substring(2, 8)}${finalExt}`;
    const contentType = getMimeType(finalExt, isSvg);

    let finalPublicUrl = '';
    let storageProvider = 'local';

    // 1. Try Supabase Storage upload if configured
    if (isSupabaseStorageConfigured()) {
      try {
        const supabase = getSupabaseClient()!;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(SUPABASE_STORAGE_BUCKET)
          .upload(uniqueName, outputBuffer, {
            contentType,
            upsert: true,
            cacheControl: '31536000',
          });

        if (uploadError) {
          console.error('Supabase storage upload error:', uploadError.message);
        } else if (uploadData) {
          const { data: publicData } = supabase.storage
            .from(SUPABASE_STORAGE_BUCKET)
            .getPublicUrl(uniqueName);

          if (publicData?.publicUrl) {
            finalPublicUrl = publicData.publicUrl;
            storageProvider = 'supabase';
          }
        }
      } catch (sbErr: any) {
        console.error('Supabase upload exception:', sbErr?.message || sbErr);
      }
    }

    // 2. Also save to local server disk (acts as fallback and local backup)
    try {
      ensureUploadDir();
      const localFilePath = path.join(UPLOAD_DIR, uniqueName);
      fs.writeFileSync(localFilePath, outputBuffer);

      // Mirror to standalone directory if running production standalone
      const standaloneDir = path.join(process.cwd(), '.next', 'standalone', 'public', 'uploads');
      if (fs.existsSync(path.dirname(standaloneDir))) {
        if (!fs.existsSync(standaloneDir)) fs.mkdirSync(standaloneDir, { recursive: true });
        fs.writeFileSync(path.join(standaloneDir, uniqueName), outputBuffer);
      }
    } catch (localWriteErr) {
      console.warn('Local file write warning:', localWriteErr);
    }

    // If Supabase wasn't configured or failed, use local URL
    if (!finalPublicUrl) {
      finalPublicUrl = `/uploads/${uniqueName}`;
      storageProvider = 'local';
    }

    return NextResponse.json({
      success: true,
      url: finalPublicUrl,
      filename: uniqueName,
      storage: storageProvider,
      width: outputWidth,
      height: outputHeight,
      originalSize: file.size,
      compressedSize: outputBuffer.length,
      savedBytes: Math.max(0, file.size - outputBuffer.length),
    });
  } catch (error: any) {
    console.error('File upload route error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to upload and optimize image.' },
      { status: 500 }
    );
  }
}
