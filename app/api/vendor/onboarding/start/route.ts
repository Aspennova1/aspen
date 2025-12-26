import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload: any = await verifyToken(token);

    // 🔒 Vendor only
    if (payload.roleId !== 4) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const existingOnboarding = await prisma.vendorOnboarding.findUnique({
      where: { userId: payload.Id },
    });

    // ✅ Already onboarded → do nothing
    if (existingOnboarding?.status === "COMPLETED") {
      return NextResponse.json({
        message: "Vendor already onboarded",
      });
    }

    let stripeAccountId = existingOnboarding?.stripeConnectedAccountId;

    console.log(stripeAccountId, 'stripeaccountIddddddd');
    
    // 🆕 Create Stripe account ONLY ONCE
    if (!stripeAccountId) {
        const account = await stripe.accounts.create({
            type: "express",
            email: payload.email,
            country: "US", // or dynamic later
            business_type: "individual", // or company
            metadata: {
                userId: payload.Id,
                name: payload.name,
            },
        });
        stripeAccountId = account.id;
    }


    const accountLink = await stripe.accountLinks.create({
        account: stripeAccountId,
        refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/vendor/onboarding/refresh`,
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/vendor/onboarding/complete`,
        type: "account_onboarding",
    });

    await prisma.vendorOnboarding.upsert({
        where: { userId: payload.Id },
        update: {
            stripeConnectedAccountId: stripeAccountId,
            onboardingUrl: accountLink.url,
            status: "IN_PROGRESS",
        },
        create: {
            userId: payload.Id,
            stripeConnectedAccountId: stripeAccountId,
            onboardingUrl: accountLink.url,
            status: "IN_PROGRESS",
        },
    });

    return NextResponse.json({
        onboardingUrl: accountLink.url,
    });
  }
  catch(err: any){
    console.error("Vendor onboarding error:", err);

    return NextResponse.json(
      { error: err.message || "Failed to start onboarding" },
      { status: 500 }
    );
  }
}