import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from 'crypto';
import bcrypt from "bcrypt";
import { Resend } from "resend";

export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("token");

  if (!token) return NextResponse.json({ valid: false });

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const record = await prisma.passwordResetToken.findFirst({
    where: {
      tokenHash,
      used: false,
      expiresAt: { gt: new Date() },
    },
  });

  return NextResponse.json({ valid: !!record });
}


export async function POST(req: Request) {
  try{
    const { token, newPassword } = await req.json();
    
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    
  
    const record = await prisma.passwordResetToken.findFirst({
      where: {
        tokenHash,
        used: false,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });    
  
    if (!record) {
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
    }
  
    const hashedPassword = await bcrypt.hash(newPassword, 10);
  
    await prisma.$transaction([
      prisma.users.update({
        where: { Id: record.userId },
        data: { password: hashedPassword },
      }),
      prisma.passwordResetToken.update({
        where: { id: record.id },
        data: { used: true },
      }),
    ]);
  
    // OPTIONAL (Highly Recommended)
    // Invalidate all sessions / refresh tokens
  
    return NextResponse.json({ message: "Password reset successful", status: true });
  }
  catch(err){
    return NextResponse.json({ message: "Something went wrong!", status: false});
  }
}