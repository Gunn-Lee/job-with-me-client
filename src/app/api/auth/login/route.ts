import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Here you would add your actual authentication logic:
    // 1. Validate the user credentials against your database
    // 2. Create or retrieve a valid JWT token
    // 3. Return appropriate response

    // For demo/development purposes:
    if (email === "test@example.com" && password === "password") {
      return NextResponse.json({
        token: `real_auth_token_${Date.now()}`,
        user: {
          id: "user_123",
          email,
          name: "Test User",
        },
      });
    }

    // If authentication fails
    return NextResponse.json(
      { message: "Invalid email or password" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
