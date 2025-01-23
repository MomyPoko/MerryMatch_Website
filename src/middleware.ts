import { validateRegister } from "./middlewares/validate_Register";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET;

// ฟังก์ชันเช็คว่า token หมดอายุหรือไม่
function isTokenExpired(token: any) {
  const expiry = token.exp; // ค่าที่มาจาก token
  return Date.now() >= expiry * 1000; // เปลี่ยนเป็น milliseconds
}

export async function middleware(req: NextRequest) {
  const url = new URL(req.url);
  // console.log("check request: ", req);

  const token = await getToken({ req, secret });

  if (!token || isTokenExpired(token)) {
    if (url.pathname.startsWith("/matching")) {
      return NextResponse.redirect(new URL("/auth/login", url.origin));
    }
    return NextResponse.next();
  }

  if (url.pathname.startsWith("/api/auth/register")) {
    try {
      const response = await validateRegister(req);
      return response;
    } catch (error) {
      console.error("Error in validation middleware:", error);
      return new NextResponse("Validation failed.", { status: 400 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/auth/register", "/matching"],
};
