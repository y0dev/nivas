import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // TODO: Replace with actual token verification logic
    // For now, we'll simulate a valid token
    if (token.startsWith('mock-jwt-token-')) {
      const user = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        createdAt: new Date().toISOString()
      };

      return NextResponse.json(user);
    } else {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 