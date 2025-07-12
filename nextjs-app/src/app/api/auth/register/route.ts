import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    // Basic validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // TODO: Replace with actual registration logic
    // For now, we'll simulate a successful registration
    const token = 'mock-jwt-token-' + Date.now();
    const user = {
      id: Date.now().toString(),
      name: name,
      email: email,
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      token,
      user
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 