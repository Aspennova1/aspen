import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { signToken } from "@/lib/jwt";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // check if exists
    const existing = await prisma.users.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const hashed = await bcrypt.hash(password, 10);

    // const user = await prisma.user.create({
    //   data: { name, email, password: hashed, role: "Admin", subcompany, isVerified: false },
    // });
    const user = await prisma.users.create({
      data: {
        FullName: name,
        email,
        password: hashed,
        RoleId: 3, //have to change
        IsActive: true,
      },
       include: {
        Role: true,
      },
    });
    console.log(user, 'user');
    
    const token = signToken({
      Id: user.Id,
      name: user.FullName,
      email: user.email,
      role: user.Role.Name,
      roleId: user.RoleId,
    });
    const response = NextResponse.json(
          { message: "Register successful", token },
          { status: 201 }
        );
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/", // cookie valid everywhere
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
    // return NextResponse.json(
    //   { message: "Registered successfully", token },
    //   { status: 201 }
    // );

    return response;
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
