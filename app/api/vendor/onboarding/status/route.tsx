import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload: any = await verifyToken(token);

    // Vendor only
    if (payload.roleId !== 4) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const onboarding = await prisma.vendorOnboarding.findUnique({
      where: { userId: payload.Id },
      select: {
        status: true,
        chargesEnabled: true,
        payoutsEnabled: true,
      },
    });

    // Vendor never started onboarding
    if (!onboarding) {
      return NextResponse.json({
        status: "NOT_STARTED",
        chargesEnabled: false,
        payoutsEnabled: false,
      });
    }

    return NextResponse.json(onboarding);
  } catch (err) {
    console.error("Fetch onboarding status failed", err);
    return NextResponse.json(
      { error: "Failed to fetch onboarding status" },
      { status: 500 }
    );
  }
}
