import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function GET() {
  // Clear the authentication cookie by setting it with an expired date
  const cookie = serialize("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development", // Ensure it's secure in production
    sameSite: "strict",
    expires: new Date(0), // Setting an expiration date in the past effectively deletes the cookie
    path: "/",
  });

  const response = NextResponse.json({ message: "Logout successful" }, { status: 200 });
  response.headers.set("Set-Cookie", cookie);

  return response;
}