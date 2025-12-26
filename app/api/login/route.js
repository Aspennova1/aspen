import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { signToken } from "@/lib/jwt";

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    
    //const user = await prisma.users.findUnique({ where: { email } });
    const user = await prisma.users.findUnique({
      where: { email },
      select: {
        Id: true,
        FullName: true,
        email: true,
        password: true,
        IsActive: true,
        RoleId: true,
        Role: {
          select: {
            Name: true,
          },
        },
      },
    });
    
    if (!user) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const isCorrect = await bcrypt.compare(password, user.password);
    if (!isCorrect) {
      return NextResponse.json({ error: "Wrong password" }, { status: 400 });
    }
    
    const token = signToken({
      Id: user.Id,
      name: user.FullName,
      email: user.email,
      role: user.Role.Name,
      roleId: user.RoleId
    });

    const response = NextResponse.json(
      { message: "Login successful", token },
      { status: 200 }
    );
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/", // cookie valid everywhere
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
    return response;
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}


// export async function GET() {
//   try {


//     await prisma.roles.createMany({
//       data: [
//     { RoleId: 1, Name: "Admin" },
//     { RoleId: 2, Name: "Project Manager" },
//     { RoleId: 3, Name: "Customer" },
//     { RoleId: 4, Name: "Vendor" },
//   ],
//     });
    

//     return NextResponse.json({
//       message: "Roles inserted successfully",
//     });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { error: "Failed to insert roles" },
//       { status: 500 }
//     );
//   }
// }