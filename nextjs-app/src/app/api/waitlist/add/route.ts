import { NextRequest, NextResponse } from 'next/server';

const USE_BACKEND = process.env.NEXT_PUBLIC_USE_BACKEND === 'true';
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, featurePreference } = body;

    if (!email || !featurePreference) {
      return NextResponse.json(
        { message: 'Email and feature preference are required' },
        { status: 400 }
      );
    }

    if (USE_BACKEND) {
      // Forward to backend
      const response = await fetch(`${BACKEND_URL}/api/waitlist/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, featurePreference }),
      });

      const data = await response.json();

      if (!response.ok) {
        return NextResponse.json(
          { message: data.message || 'Failed to add to waitlist' },
          { status: response.status }
        );
      }

      return NextResponse.json(data);
    } else {
      // Mock response for development
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return NextResponse.json({
        status: 'success',
        message: 'Successfully added to waitlist',
        data: {
          waitlist: {
            id: Date.now(),
            email,
            featurePreference,
            createdAt: new Date().toISOString()
          }
        }
      });
    }
  } catch (error) {
    console.error('Waitlist API error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 