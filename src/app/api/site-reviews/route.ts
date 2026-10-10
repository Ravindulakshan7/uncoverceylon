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

export async function GET() {
  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: 'site_reviews' },
    });

    if (!setting || !setting.value) {
      return NextResponse.json({ reviews: INITIAL_REVIEWS });
    }

    const savedReviews = JSON.parse(setting.value);
    return NextResponse.json({
      reviews: Array.isArray(savedReviews) ? savedReviews : INITIAL_REVIEWS,
    });
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
    };

    // Retrieve existing reviews or default
    const setting = await prisma.siteSetting.findUnique({
      where: { key: 'site_reviews' },
    });

    let currentList = INITIAL_REVIEWS;
    if (setting && setting.value) {
      try {
        const parsed = JSON.parse(setting.value);
        if (Array.isArray(parsed)) currentList = parsed;
      } catch (e) {
        // use default
      }
    }

    // Prepend new review
    const updatedList = [newReview, ...currentList];

    await prisma.siteSetting.upsert({
      where: { key: 'site_reviews' },
      update: { value: JSON.stringify(updatedList) },
      create: { key: 'site_reviews', value: JSON.stringify(updatedList) },
    });

    return NextResponse.json({ success: true, review: newReview, reviews: updatedList });
  } catch (error: any) {
    console.error('Error saving site review:', error);
    return NextResponse.json({ error: error.message || 'Failed to submit review' }, { status: 500 });
  }
}
