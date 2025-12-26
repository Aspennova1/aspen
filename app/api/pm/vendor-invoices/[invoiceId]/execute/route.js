import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { getAuthUser } from "@/utils/auth";

export async function GET(
  req, { params }
) {
  try {
    const {invoiceId} = await params;
    const payoutId = invoiceId;
    
    // 1️⃣ Auth (PM / Admin only)
    const user = await getAuthUser([1, 2]);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2️⃣ Fetch payout + relations
    const payout = await prisma.vendorPayout.findUnique({
      where: { Id: payoutId },
      include: {
        invoice: true,
        purchaseOrder: true,
        user: {
          include: {
            vendorOnboarding: true,
          },
        },
      },
    });

    if (!payout) {
      return NextResponse.json(
        { error: "Vendor payout not found" },
        { status: 404 }
      );
    }

    // 3️⃣ Validate payout state
    if (!["READY", "FAILED"].includes(payout.status)) {
      return NextResponse.json(
        { error: "Payout cannot be executed in current state" },
        { status: 400 }
      );
    }

    const onboarding = payout.user.vendorOnboarding;
    if (
      !onboarding ||
      onboarding.status !== "COMPLETED" ||
      !onboarding.payoutsEnabled ||
      !onboarding.stripeConnectedAccountId
    ) {
      return NextResponse.json(
        { error: "Vendor not eligible for transfer" },
        { status: 400 }
      );
    }

    if (payout.status === "FAILED") {
      await prisma.vendorPayout.update({
        where: { Id: payout.Id },
        data: { stripeTransferId: null },
      });
    }
    
    // 4️⃣ Lock payout (CRITICAL)
    await prisma.vendorPayout.update({
      where: { Id: payout.Id },
      data: { status: "PROCESSING" },
    });

    try{
      // 5️⃣ Stripe Transfer (MONEY MOVES HERE)
      const transfer = await stripe.transfers.create({
        amount: payout.vendorAmount, // cents
        currency: 'usd',
        destination: onboarding.stripeConnectedAccountId,
        metadata: {
          vendorPayoutId: payout.Id,
          invoiceId: payout.invoiceId,
        },
      });
  
      // 6️⃣ Save Stripe transfer reference
      await prisma.vendorPayout.update({
        where: { Id: payout.Id },
        data: {
          stripeTransferId: transfer.id,
        },
      });
  
      return NextResponse.json({
        success: true,
        transferId: transfer.id,
      });
    }
    catch(stripeErr){
      // 🔄 ROLLBACK payout state
      await prisma.vendorPayout.update({
        where: { Id: payout.Id },
        data: {
          status: "FAILED",
          stripeTransferId: null,
        },
      });

      return NextResponse.json(
        {
          error:
            stripeErr?.message ||
            "Transfer failed due to Stripe error",
        },
        { status: 400 }
      );
    }
  } catch (err) {
    console.error("Execute payout failed", err);
    return NextResponse.json(
      { error: err.message || "Failed to execute payout" },
      { status: 500 }
    );
  }
}
