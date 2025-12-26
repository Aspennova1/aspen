import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { verifyToken } from "@/lib/jwt";

export async function POST(req: NextRequest) {
  try {
    // 1️⃣ Auth
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload: any = await verifyToken(token);

    // 🔒 Allow only Admin / PM
    if (![1, 2].includes(payload.roleId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 2️⃣ Read body
    const { name, email, password, mobile, location } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 3️⃣ Check if user exists
    const existing = await prisma.users.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // 4️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5️⃣ Create Vendor user
    const vendor = await prisma.users.create({
      data: {
        FullName: name,
        email,
        password: hashedPassword,
        RoleId: 4, // 🔑 Vendor role
        IsActive: true,
        mobile,
        location,
      },
      select: {
        Id: true,
        FullName: true,
        email: true,
        RoleId: true,
        mobile: true,
        location: true,
      },
    });

    return NextResponse.json(
      {
        message: "Vendor created successfully",
        vendor,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create vendor error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
