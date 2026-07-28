import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
 
  if (req.nextUrl.pathname.startsWith("/admin")) {
    
    if (!req.auth) {
      const signinUrl = new URL("/auth/signin", req.nextUrl.origin)
      signinUrl.searchParams.set("callbackUrl", req.nextUrl.pathname)
      return NextResponse.redirect(signinUrl)
    }

    // Optional: Check if user has admin role (if you have role-based access control)
    // if (req.auth.user?.role !== "admin") {
    //   return NextResponse.redirect(new URL("/", req.nextUrl.origin))
    // }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    // Protect admin routes
    "/admin/:path*",
    // Don't protect auth routes
    "/((?!api|_next/static|_next/image|favicon.ico|auth).*)",
  ],
}
