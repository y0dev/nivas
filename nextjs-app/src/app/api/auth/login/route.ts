import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // TODO: Replace with actual authentication logic
    // For now, we'll simulate a successful login
    if (email === 'test@example.com' && password === 'password') {
      const token = 'mock-jwt-token-' + Date.now();
      const user = {
        id: '1',
        name: 'Test User',
        email: email,
        createdAt: new Date().toISOString()
      };

      return NextResponse.json({
        token,
        user
      });
    } else {
      return NextResponse.json(
        { message: 'Invalid credentials' },
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