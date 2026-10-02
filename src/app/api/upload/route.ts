import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

export async function POST(request: NextRequest) {
  try {
    ensureUploadDir();
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate mime type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/gif', 'image/avif'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload a JPG, PNG, WEBP, or GIF image.' },
        { status: 400 }
      );
    }

    // Limit size to 15MB
    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 15MB.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Auto-compress & convert to modern WebP with Sharp
    let outputBuffer: Buffer;
    let finalExt = '.webp';

    try {
      if (file.type === 'image/gif') {
        outputBuffer = buffer;
        finalExt = '.gif';
      } else {
        outputBuffer = await sharp(buffer)
          .rotate() // Fix phone camera EXIF rotation
          .resize({ width: 2048, height: 2048, fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 82, effort: 4 })
          .toBuffer();
      }
    } catch (sharpError) {
      console.warn('Sharp compression fallback to raw buffer:', sharpError);
      outputBuffer = buffer;
      finalExt = path.extname(file.name)?.toLowerCase() || '.jpg';
    }

    const uniqueName = `ceylon_${Date.now()}_${Math.random().toString(36).substring(2, 8)}${finalExt}`;
    const filePath = path.join(UPLOAD_DIR, uniqueName);

    fs.writeFileSync(filePath, outputBuffer);

    const publicUrl = `/uploads/${uniqueName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: uniqueName,
      originalSize: file.size,
      compressedSize: outputBuffer.length,
      savedBytes: Math.max(0, file.size - outputBuffer.length),
    });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
