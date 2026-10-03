import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

// Dynamic route handler to serve runtime-uploaded media files from public/uploads.
// In Next.js production builds (next start / standalone), dynamically created files
// in public/ are not in the static build manifest and return 404 unless routed dynamically.
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
    const filePath = path.join(process.cwd(), 'public', 'uploads', safePath);

    if (!fs.existsSync(filePath)) {
      return new NextResponse('File not found', { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);
    const ext = path.extname(safePath).toLowerCase();

    let contentType = 'image/jpeg';
    if (ext === '.webp') contentType = 'image/webp';
    else if (ext === '.png') contentType = 'image/png';
    else if (ext === '.gif') contentType = 'image/gif';
    else if (ext === '.svg') contentType = 'image/svg+xml';
    else if (ext === '.avif') contentType = 'image/avif';
    else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving upload:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
