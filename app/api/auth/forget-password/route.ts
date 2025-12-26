import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from 'crypto';
import { Resend } from "resend";
import ResetPasswordEmail from "@/components/email/ResetPasswordEmail";
import { headers } from "next/headers";
import { checkForgotPasswordRateLimit, normalizeIp } from "@/lib/rateLimiter";
import { normalize } from "path";

const resend = new Resend(process.env.RESEND_API_KEY);

export function generateResetToken() {
  const token = crypto.randomBytes(32).toString("hex");
  const hash = crypto.createHash("sha256").update(token).digest("hex");

  return { token, hash };
}

export async function POST(req: Request) {
  try{
    const { email } = await req.json();
  
    const headersList = await headers();
    const ip = normalizeIp(headersList.get("x-forwarded-for")?.split(",")[0]) ?? "unknown";

    const allowed = await checkForgotPasswordRateLimit(email, ip);

    if (!allowed) {
      
      return NextResponse.json(
        {
          message:
            "Too many password reset attempts. Please try again later.",
        },
        { status: 429 }
      );
    }

    const user = await prisma.users.findUnique({ where: { email } });
  
    if (!user) {
      // Prevent email enumeration
      return NextResponse.json({status: true, message: "If an account exists for this email, a password reset link has been sent." });
    }
  
    const { token, hash } = generateResetToken();
  
    await prisma.passwordResetToken.create({
      data: {
        userId: user.Id,
        tokenHash: hash,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 mins
      },
    });
  
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}reset-password?token=${token}`;
  
    await sendResetEmail(user.email, user.FullName, resetUrl);
  
    return NextResponse.json({ status: true, message: "If an account exists for this email, a password reset link has been sent." });
  }
  catch(err){
    return NextResponse.json({ message: "Something went wrong!! Try again sometime later", status:false  });
  }
}


// export async function POST(req: Request) {
//   const { token, newPassword } = await req.json();

//   const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

//   const record = await prisma.passwordResetToken.findFirst({
//     where: {
//       tokenHash,
//       used: false,
//       expiresAt: { gt: new Date() },
//     },
//     include: { user: true },
//   });

//   if (!record) {
//     return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
//   }

//   const hashedPassword = await bcrypt.hash(newPassword, 12);

//   await prisma.$transaction([
//     prisma.user.update({
//       where: { Id: record.userId },
//       data: { password: hashedPassword },
//     }),
//     prisma.passwordResetToken.update({
//       where: { id: record.id },
//       data: { used: true },
//     }),
//   ]);

//   // OPTIONAL (Highly Recommended)
//   // Invalidate all sessions / refresh tokens

//   return NextResponse.json({ message: "Password reset successful" });
// }

async function sendResetEmail(userEmail: string, userName: string, resetUrl: string){
    await resend.emails.send({
        from: `Support <${process.env.SENDER_EMAIL}>`,
        to: userEmail,
        subject: "Reset Password",
        react: ResetPasswordEmail({resetUrl, name:userName}),
    })
}