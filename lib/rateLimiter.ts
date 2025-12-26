import prisma from "@/lib/prisma";

const WINDOW_MINUTES = 60;
const MAX_ATTEMPTS = 5;

export async function checkForgotPasswordRateLimit(
  email: string,
  ip: string
) {
  const since = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000);

  const count = await prisma.passwordResetRateLimit.count({
    where: {
      email,
      ip,
      createdAt: {
        gte: since,
      },
    },
  });

  if (count >= MAX_ATTEMPTS) {
    return false;
  }

  await prisma.passwordResetRateLimit.create({
    data: { email, ip },
  });

  return true;
}


export function normalizeIp(ip: string | null | undefined) {
  if (!ip) return "unknown";

  // Remove IPv6-mapped IPv4 prefix
  if (ip.startsWith("::ffff:")) {
    return ip.replace("::ffff:", "");
  }

  return ip;
}