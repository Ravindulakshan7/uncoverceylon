import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

const INITIAL_REVIEWS = [
  {
    id: 'rev-1',
    name: 'Sarah Jenkins',
    country: 'United Kingdom',
    flag: '🇬🇧',
    role: 'Solo Backpacker',
    visited: 'Ella & South Coast',
    comment:
      'Uncover Ceylon helped us discover hidden waterfalls in Ella and secluded lagoons in Mirissa that weren’t listed on standard tourist maps. The route planner saved us days of research!',
    rating: 5,
    date: 'February 2026',
  },
  {
    name: 'Lukas Weber',
    id: 'rev-2',
    country: 'Germany',
    flag: '🇩🇪',
    role: 'Couple Getaway',
    visited: 'Cultural Triangle & Highlands',
    comment:
      'The scenic blue train ride from Kandy to Ella and climbing Sigiriya at 6 AM sunrise was the highlight of our entire Asia trip. The local timing tips were 100% accurate.',
    rating: 5,
    date: 'January 2026',
  },
  {
    id: 'rev-3',
    name: 'Kenji & Maya',
    country: 'Japan',
    flag: '🇯🇵',
    role: 'Adventure Travelers',
    visited: 'Yala Safari & Weligama',
    comment:
      'We followed the 5-day surf and safari route. Seeing wild leopards in Yala in the morning and catching sunset waves in Weligama was an absolute dream. Clean, modern platform!',
    rating: 5,
    date: 'March 2026',
  },
  {
    id: 'rev-4',
    name: 'Elena Rostova',
    country: 'Australia',
    flag: '🇦🇺',
    role: 'Food & Culture Explorer',
    visited: 'Galle Fort & Colombo',
    comment:
      'The culinary recommendations are incredible! Best crispy egg hoppers in Galle and authentic street kottu in Colombo. Sri Lanka will always hold a very special place in our hearts.',
    rating: 5,
    date: 'December 2025',
  },
];

export async function GET(request: NextRequest) {
  try {
    const isAdmin = request.nextUrl.searchParams.get('admin') === 'true';
    const setting = await prisma.siteSetting.findUnique({
      where: { key: 'site_reviews' },
    });

    let currentList = INITIAL_REVIEWS.map(r => ({ ...r, status: 'approved' }));
    if (setting && setting.value) {
      try {
        const parsed = JSON.parse(setting.value);
        if (Array.isArray(parsed)) currentList = parsed;
      } catch (e) {}
    }

    // If admin is requesting, return all including pending & spam
    if (isAdmin) {
      return NextResponse.json({ reviews: currentList });
    }

    // Public view: ONLY approved reviews are shown
    const approvedReviews = currentList.filter(
      (r: any) => r.status === 'approved' || (!r.status && !String(r.id).startsWith('rev-17'))
    );
    return NextResponse.json({ reviews: approvedReviews });
  } catch (error) {
    console.error('Error fetching site reviews:', error);
    return NextResponse.json({ reviews: INITIAL_REVIEWS });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    const body = await request.json();
    const { rating, comment, role, country } = body;

    if (!comment || typeof comment !== 'string' || comment.trim().length < 5) {
      return NextResponse.json({ error: 'Please write a meaningful review comment.' }, { status: 400 });
    }

    const authorName = user?.name || body.author || 'Verified Traveler';
    const authorImage = user?.image || '';
    const dateFormatted = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

    const newReview = {
      id: `rev-${Date.now()}`,
      name: authorName,
      user_image: authorImage,
      country: country?.trim() || 'Global Traveler',
      flag: '🌟',
      role: role?.trim() || 'Community Member',
      visited: 'Uncover Ceylon Community',
      comment: comment.trim(),
      rating: Number(rating) || 5,
      date: dateFormatted,
      status: 'pending', // All user submissions go to pending moderation!
    };

    // Retrieve existing reviews or default
    const setting = await prisma.siteSetting.findUnique({
      where: { key: 'site_reviews' },
    });

    let currentList = INITIAL_REVIEWS.map(r => ({ ...r, status: 'approved' }));
    if (setting && setting.value) {
      try {
        const parsed = JSON.parse(setting.value);
        if (Array.isArray(parsed)) currentList = parsed;
      } catch (e) {
        // use default
      }
    }

    // Prepend new review with pending status
    const updatedList = [newReview, ...currentList];

    await prisma.siteSetting.upsert({
      where: { key: 'site_reviews' },
      update: { value: JSON.stringify(updatedList) },
      create: { key: 'site_reviews', value: JSON.stringify(updatedList) },
    });

    return NextResponse.json({
      success: true,
      review: newReview,
      message: 'Review submitted for moderation! It will be published once approved by an admin.',
    });
  } catch (error: any) {
    console.error('Error saving site review:', error);
    return NextResponse.json({ error: error.message || 'Failed to submit review' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'id and status are required' }, { status: 400 });
    }

    const setting = await prisma.siteSetting.findUnique({
      where: { key: 'site_reviews' },
    });

    let currentList = INITIAL_REVIEWS.map(r => ({ ...r, status: 'approved' }));
    if (setting && setting.value) {
      try {
        const parsed = JSON.parse(setting.value);
        if (Array.isArray(parsed)) currentList = parsed;
      } catch (e) {}
    }

    const updatedList = currentList.map((r: any) => {
      if (String(r.id) === String(id)) {
        return { ...r, status };
      }
      return r;
    });

    await prisma.siteSetting.upsert({
      where: { key: 'site_reviews' },
      update: { value: JSON.stringify(updatedList) },
      create: { key: 'site_reviews', value: JSON.stringify(updatedList) },
    });

    return NextResponse.json({ success: true, reviews: updatedList });
  } catch (error: any) {
    console.error('Error updating site review status:', error);
    return NextResponse.json({ error: error.message || 'Failed to update status' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Review ID is required' }, { status: 400 });
    }

    const setting = await prisma.siteSetting.findUnique({
      where: { key: 'site_reviews' },
    });

    let currentList = INITIAL_REVIEWS;
    if (setting && setting.value) {
      try {
        const parsed = JSON.parse(setting.value);
        if (Array.isArray(parsed)) currentList = parsed;
      } catch (e) {
        // fallback
      }
    }

    const updatedList = currentList.filter((r: any) => String(r.id) !== String(id));

    await prisma.siteSetting.upsert({
      where: { key: 'site_reviews' },
      update: { value: JSON.stringify(updatedList) },
      create: { key: 'site_reviews', value: JSON.stringify(updatedList) },
    });

    return NextResponse.json({ success: true, reviews: updatedList });
  } catch (error: any) {
    console.error('Error deleting site review:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete review' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, country, comment, rating, role, visited } = body;

    if (!id) {
      return NextResponse.json({ error: 'Review ID is required' }, { status: 400 });
    }

    const setting = await prisma.siteSetting.findUnique({
      where: { key: 'site_reviews' },
    });

    let currentList = INITIAL_REVIEWS;
    if (setting && setting.value) {
      try {
        const parsed = JSON.parse(setting.value);
        if (Array.isArray(parsed)) currentList = parsed;
      } catch (e) {
        // fallback
      }
    }

    const updatedList = currentList.map((r: any) => {
      if (String(r.id) === String(id)) {
        return {
          ...r,
          name: name !== undefined ? name : r.name,
          country: country !== undefined ? country : r.country,
          comment: comment !== undefined ? comment : r.comment,
          rating: rating !== undefined ? Number(rating) : r.rating,
          role: role !== undefined ? role : r.role,
          visited: visited !== undefined ? visited : r.visited,
          status: body.status !== undefined ? body.status : r.status,
        };
      }
      return r;
    });

    await prisma.siteSetting.upsert({
      where: { key: 'site_reviews' },
      update: { value: JSON.stringify(updatedList) },
      create: { key: 'site_reviews', value: JSON.stringify(updatedList) },
    });

    return NextResponse.json({ success: true, reviews: updatedList });
  } catch (error: any) {
    console.error('Error updating site review:', error);
    return NextResponse.json({ error: error.message || 'Failed to update review' }, { status: 500 });
  }
}
