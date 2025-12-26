import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/utils/auth";

export async function POST(
  req,
  { params }
) {
  try {
    const {invoiceId} = await params;
    // 1️⃣ Auth: PM / Admin only
    const user = await getAuthUser([1, 2]);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2️⃣ Fetch vendor invoice
    const vendorInvoice = await prisma.invoice.findUnique({
      where: { Id: invoiceId },
      include: {
        vendorPayouts: true,
      },
    });

    if (!vendorInvoice) {
      return NextResponse.json(
        { error: "Vendor invoice not found" },
        { status: 404 }
      );
    }

    // 3️⃣ Validate vendor invoice type
    if (
      vendorInvoice.issuedBy !== "VENDOR" ||
      vendorInvoice.issuedTo !== "PM"
    ) {
      return NextResponse.json(
        { error: "Invalid vendor invoice" },
        { status: 400 }
      );
    }

    // 🔑 IMPORTANT FIX
    // Vendor invoice must be SUBMITTED (SENT), not PAID
    if (vendorInvoice.statusCode !== "SENT") {
      return NextResponse.json(
        { error: "Vendor invoice not ready for payout" },
        { status: 400 }
      );
    }

    // 4️⃣ Ensure customer has PAID
    const customerInvoice = await prisma.invoice.findFirst({
      where: {
        purchaseOrderId: vendorInvoice.purchaseOrderId,
        issuedBy: "PM",
        issuedTo: "CUSTOMER",
        statusCode: "PAID",
      },
    });

    if (!customerInvoice) {
      return NextResponse.json(
        { error: "Customer has not paid yet" },
        { status: 400 }
      );
    }

    // 5️⃣ Prevent duplicate active payouts
    const activePayout = vendorInvoice.vendorPayouts.find((p) =>
      ["READY", "PROCESSING", "PAID"].includes(p.status)
    );

    if (activePayout) {
      return NextResponse.json(
        { error: "Payout already exists for this invoice" },
        { status: 409 }
      );
    }

    // 6️⃣ Check vendor onboarding eligibility
    const onboarding = await prisma.vendorOnboarding.findFirst({
      where: {
        userId: vendorInvoice.createdByUserId,
        status: "COMPLETED",
        payoutsEnabled: true,
      },
    });

    if (!onboarding) {
      return NextResponse.json(
        { error: "Vendor not eligible for payout" },
        { status: 400 }
      );
    }

    // 7️⃣ Create VendorPayout (NO STRIPE CALL)
    const payout = await prisma.vendorPayout.create({
      data: {
        invoice: {
          connect: { Id: vendorInvoice.Id },
        },
        user: {
          connect: { Id: vendorInvoice.createdByUserId },
        },
        purchaseOrder: {
          connect: { Id: vendorInvoice.purchaseOrderId },
        },
        // vendorUserId: vendorInvoice.createdByUserId,
        vendorAmount: vendorInvoice.amount,
        status: "READY",
      },
    });

    return NextResponse.json({
      success: true,
      payoutId: payout.Id,
    });
  } catch (err) {
    console.error("Create VendorPayout failed", err);
    return NextResponse.json(
      { error: err.message || "Failed to create payout" },
      { status: 500 }
    );
  }
}
