import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify, JWTPayload } from "jose";

export async function middleware(request: NextRequest) {
  const isApiRoute = request.nextUrl.pathname.startsWith("/api");
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const token = request.cookies.get("token")?.value;

  //Allow public access to the admin login page
  if (request.nextUrl.pathname === "/admin" && !token) {
    return NextResponse.next();
  }


  // Handle API routes
  if (isApiRoute) {
    // Allow GET requests without authentication
    const response = NextResponse.next();
    if (request.method === "GET") {
      // Add CORS headers for GET requests
      response.headers.set("Cache-Control", "no-store, max-age=0");
      response.headers.set("Pragma", "no-cache");
      response.headers.set("Expires", "0");
      response.headers.set("Access-Control-Allow-Origin", "*");
      response.headers.set("Access-Control-Allow-Methods", "GET");
      response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
      return response;
    }

    if (request.nextUrl.pathname === "/api/login") {
      return NextResponse.next();
    }

    // For non-GET API requests, require authentication
    if (!token) {
      return new NextResponse(JSON.stringify({ error: "Authentication required" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Verify token for API routes
    try {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
      const userId = (payload as JWTPayload).id as string;
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-user-id", userId);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      console.error("Token verification failed for API:", error);
      return new NextResponse(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

 

  // Handle admin routes (excluding the login page)
  if (isAdminRoute) {
    if (!token) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    // Verify token for admin routes
    try {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
      const userId = (payload as JWTPayload).id as string;
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-user-id", userId);

      if(request.nextUrl.pathname==="/admin" && token){
        return NextResponse.redirect(new URL("/admin/dashboard",request.url))
      }

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });

    } catch (error) {
      console.error("Token verification failed for admin:", error);
      const response = NextResponse.redirect(new URL("/admin", request.url));
      response.cookies.delete("token");
      return response;
    }
  }

  // For all other routes, proceed without authentication
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
