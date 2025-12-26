import { NextResponse } from "next/server";
// import { verifyToken } from "@/lib/jwt";
import { jwtVerify } from "jose";
import { ROUTE_ACCESS } from "@/lib/routeAccess";


export async function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  // if (
  //   pathname.startsWith("/login") ||
  //   pathname.startsWith("/register") ||
  //   pathname.startsWith("/api")
  // ) {
  //   return NextResponse.next();
  // }

  if (!token) {
    const url = new URL("/", req.url);
    url.searchParams.set("login", "true");
    // url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  try {
    const {payload} = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
    // const decrypttoken = await jwtVerify(token); // JOSE verify now works on Edge
    // console.log(payload.roleId, 'decrypttoken');
    // console.log(payload.role, 'decrypttoken');
    // console.log(payload.email, 'decrypttoken');
    // console.log(payload.name, 'decrypttoken');
    
    for (const route in ROUTE_ACCESS) {
      if (pathname.startsWith(route)) {
        const allowedRoles = ROUTE_ACCESS[route];

        if (!allowedRoles.includes(payload.roleId)) {
          return NextResponse.redirect(new URL("/unauthorized", req.url));
        }
      }
    }
    return NextResponse.next();
  } catch (e) {
    console.error("JWT error:", e);

    const url = new URL("/", req.url);
    url.searchParams.set("login", "true");
    // url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }
  
}

// export const config = {
//   matcher: ["/my-rfqs/:path*", "/create-rfc"],
// };

export const config = {
  matcher: [
    "/rfqs/:path*",        // ✅ protects ALL RFQ pages
    "/profile",
  ],
};