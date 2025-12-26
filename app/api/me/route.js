import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";

export async function GET() {
  try {
    const cookie = await cookies();
    const token = cookie.get("token")?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const {name, email, role, roleId} = await verifyToken(token, process.env.JWT_SECRET);
    
    return NextResponse.json(
      {
        user: {
          name,
          email,
          role,
          roleId
        }
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
