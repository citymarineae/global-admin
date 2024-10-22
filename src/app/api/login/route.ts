import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import { rateLimit } from "@/lib/rateLimit";

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500, // Max 500 users per second
});

export async function POST(req: Request) {
  try {
    await limiter.check(NextResponse.next(), 10, "CACHE_TOKEN"); // 10 requests per minute
  } catch {
    return NextResponse.json({ message: "Rate limit exceeded" }, { status: 429 });
  }

  await dbConnect();

  const { username, password } = await req.json();

  const user = await User.findOne({ username });

  if (!user || user.password !== password) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: "2h" });

  // Set cookie
  const cookie = serialize("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 3600,
    path: "/",
  });

  const response = NextResponse.json({ message: "Login successful" }, { status: 200 });
  response.headers.set("Set-Cookie", cookie);

  return response;
}
