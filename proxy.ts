import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  if (!req.auth) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/admin/:path*"],
}

// import { auth } from "@/auth"
// import { NextResponse } from "next/server"

// export default auth(async (req) => {
//   const session = req.auth  
  
//   // Check if user is authenticated and has admin role
//   if (!session?.user || session.user.role !== "admin") {
//     return NextResponse.redirect("/login")
//   }
//   // Allow access to admin routes
//   return NextResponse.next()
// })

// export const config = {
//   matcher: ["/admin/:path*"]
// }
