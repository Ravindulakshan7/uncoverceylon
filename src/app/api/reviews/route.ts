import { NextRequest, NextResponse } from 'next/server';
import { prisma, logActivity } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

async function updatePlaceReviewStats(placeId: number) {
  const reviews = await prisma.review.findMany({
    where: {
      place_id: placeId,
      status: 'approved',
    },
    select: { rating: true },
  });

  const count = reviews.length;
  const avg = count > 0 ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / count) * 10) / 10 : 0;

  await prisma.place.update({
    where: { id: placeId },
    data: {
      rating: avg,
      review_count: count,
    },
  });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const placeId = searchParams.get('place_id');
    const isAdmin = searchParams.get('admin') === 'true';
    const status = searchParams.get('status');

    if (isAdmin) {
      const where: any = {};
      if (status && status !== 'all') {
        where.status = status;
      }

      const reviews = await prisma.review.findMany({
        where,
        include: {
          place: { select: { name: true } },
        },
        orderBy: { created_at: 'desc' },
      });

      const formatted = reviews.map((r) => ({
        ...r,
        place_name: r.place?.name || '',
      }));

      return NextResponse.json({ reviews: formatted });
    }

    if (placeId) {
      const numericPlaceId = parseInt(placeId, 10);
      const reviews = await prisma.review.findMany({
        where: {
          place_id: numericPlaceId,
          status: 'approved',
        },
        orderBy: { created_at: 'desc' },
      });

      return NextResponse.json({ reviews });
    }

    return NextResponse.json({ error: 'Missing place_id or admin flag' }, { status: 400 });
  } catch (error) {
    console.error('GET /api/reviews error:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { place_id, author, rating, comment, website } = body;

    if (website && String(website).trim().length > 0) {
      return NextResponse.json({ error: 'Bot detected' }, { status: 400 });
    }

    if (!place_id || !author || !rating || !comment) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const sessionUser = getUserFromRequest(request);

    const cleanAuthor = sessionUser ? sessionUser.name : String(author).trim();
    const cleanImage = sessionUser?.image || body.user_image || '';
    const cleanComment = String(comment).trim();
    const numRating = Number(rating);
    const numPlaceId = Number(place_id);

    const newReview = await prisma.review.create({
      data: {
        place_id: numPlaceId,
        user_id: sessionUser?.id || null,
        user_image: cleanImage,
        author: cleanAuthor,
        rating: numRating,
        comment: cleanComment,
        status: 'approved',
      },
    });

    await updatePlaceReviewStats(numPlaceId);

    return NextResponse.json({
      id: newReview.id,
      status: 'approved',
      message: 'Thank you! Review posted successfully.',
    }, { status: 201 });
  } catch (error) {
    console.error('POST /api/reviews error:', error);
    return NextResponse.json({ error: 'Failed to add review' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    const reviewId = parseInt(id, 10);
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    await prisma.review.update({
      where: { id: reviewId },
      data: { status },
    });

    await updatePlaceReviewStats(review.place_id);
    await logActivity('MODERATE_REVIEW', 'reviews', reviewId, `Review marked as "${status}"`);

    return NextResponse.json({ success: true, message: `Review status updated to ${status}` });
  } catch (error) {
    console.error('PATCH /api/reviews error:', error);
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing review id' }, { status: 400 });
    }

    const reviewId = parseInt(id, 10);
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    await prisma.review.delete({
      where: { id: reviewId },
    });

    await updatePlaceReviewStats(review.place_id);
    await logActivity('DELETE_REVIEW', 'reviews', reviewId, `Deleted review #${reviewId}`);

    return NextResponse.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/reviews error:', error);
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}
