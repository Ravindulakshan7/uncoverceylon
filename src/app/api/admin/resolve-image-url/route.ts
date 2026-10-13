import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const url = body?.url?.trim();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // 1. Direct check if URL contains Google imgurl parameter
    const directMatch = url.match(/[?&]imgurl=([^&]+)/);
    if (directMatch) {
      return NextResponse.json({
        success: true,
        directUrl: decodeURIComponent(directMatch[1]),
      });
    }

    // 2. Follow redirects for short links (e.g. share.google, goo.gl, photos.app.goo.gl)
    const res = await fetch(url, {
      redirect: 'follow',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    const finalUrl = res.url;
    const finalMatch = finalUrl.match(/[?&]imgurl=([^&]+)/);
    if (finalMatch) {
      return NextResponse.json({
        success: true,
        directUrl: decodeURIComponent(finalMatch[1]),
      });
    }

    // 3. Check for og:image or high-res photo in page HTML
    const html = await res.text();
    const ogMatch = html.match(/<meta property="og:image" content="([^"]+)"/i);
    if (ogMatch && ogMatch[1] && !ogMatch[1].includes('google_logo')) {
      return NextResponse.json({
        success: true,
        directUrl: ogMatch[1],
      });
    }

    return NextResponse.json(
      { error: 'Could not extract direct image file from this webpage link.' },
      { status: 404 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to resolve image URL' },
      { status: 500 }
    );
  }
}
