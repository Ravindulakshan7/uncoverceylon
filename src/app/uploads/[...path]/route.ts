import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Dynamic route handler to serve runtime-uploaded media files from public/uploads.
// Guarantees 100% reliable image delivery in both dev and production.
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: segments } = await context.params;
    if (!segments || segments.length === 0) {
      return new NextResponse('File not found', { status: 404 });
    }

    // Sanitize filename to prevent directory traversal
    const safePath = segments.map((s) => path.basename(s)).join(path.sep);

    // Primary path: public/uploads/<safePath>
    let filePath = path.join(process.cwd(), 'public', 'uploads', safePath);

    // Fallback path: check .next/standalone/public/uploads if primary doesn't exist
    if (!fs.existsSync(filePath)) {
      const fallbackPath = path.join(process.cwd(), '.next', 'standalone', 'public', 'uploads', safePath);
      if (fs.existsSync(fallbackPath)) {
        filePath = fallbackPath;
      } else {
        return new NextResponse('File not found', { status: 404 });
      }
    }

    const fileBuffer = fs.readFileSync(filePath);
    const ext = path.extname(safePath).toLowerCase();

    let contentType = 'image/jpeg';
    if (ext === '.webp') contentType = 'image/webp';
    else if (ext === '.png') contentType = 'image/png';
    else if (ext === '.gif') contentType = 'image/gif';
    else if (ext === '.svg') contentType = 'image/svg+xml';
    else if (ext === '.avif') contentType = 'image/avif';
    else if (ext === '.ico') contentType = 'image/x-icon';
    else if (ext === '.jpg' || ext === '.jpeg' || ext === '.jfif') contentType = 'image/jpeg';

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': String(fileBuffer.length),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving upload:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
