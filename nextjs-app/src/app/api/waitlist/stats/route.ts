import { NextRequest, NextResponse } from 'next/server';

const USE_BACKEND = process.env.NEXT_PUBLIC_USE_BACKEND === 'true';
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export async function GET(request: NextRequest) {
  try {
    if (USE_BACKEND) {
      // Forward to backend
      const response = await fetch(`${BACKEND_URL}/api/waitlist/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return NextResponse.json(
          { message: data.message || 'Failed to fetch waitlist stats' },
          { status: response.status }
        );
      }

      return NextResponse.json(data);
    } else {
      // Mock response for development
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return NextResponse.json({
        status: 'success',
        data: {
          totalSubscribers: 1247,
          recentSubscribers: 23,
          featureStats: [
            { _id: 'ROI Calculator', count: 456 },
            { _id: 'Property Search & Discovery', count: 234 },
            { _id: 'Market Analysis', count: 198 },
            { _id: 'Portfolio Tracking', count: 156 },
            { _id: 'Investment Alerts', count: 89 },
            { _id: 'Property Management', count: 67 },
            { _id: 'Financial Planning Tools', count: 45 },
            { _id: 'Community & Networking', count: 2 }
          ]
        }
      });
    }
  } catch (error) {
    console.error('Waitlist stats API error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 