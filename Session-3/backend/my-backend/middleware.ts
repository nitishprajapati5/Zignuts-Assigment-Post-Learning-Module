import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // 1. Define common headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
  };


  const response = NextResponse.next();
  
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

export const config = {
  // Matches all API routes starting with /api/
  matcher: "/api/:path*",
};