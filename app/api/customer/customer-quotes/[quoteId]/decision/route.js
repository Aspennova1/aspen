import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function POST(
  req,
  { params }
) {
  try {
    const {quoteId} = await params;
    // 1️⃣ Auth
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);

    // 🔒 Customer only
    if (payload.roleId !== 3) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { decision } = await req.json();

    if (!["ACCEPTED", "REJECTED"].includes(decision)) {
      return NextResponse.json(
        { error: "Invalid decision" },
        { status: 400 }
      );
    }

    // 2️⃣ Fetch quote + RFQ ownership
    const quote = await prisma.customerQuote.findUnique({
      where: { Id: quoteId },
      include: {
        customerRfq: {
          select: {
            createdByUserId: true,
          },
        },
      },
    });

    if (!quote) {
      return NextResponse.json(
        { error: "Quote not found" },
        { status: 404 }
      );
    }

    // 🔐 Ownership check
    if (quote.customerRfq.createdByUserId !== payload.Id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 🚫 Only allow decision if SENT
    if (quote.statusCode !== "SENT") {
      return NextResponse.json(
        { error: "Quote already finalized" },
        { status: 409 }
      );
    }

    // 3️⃣ Transaction
    await prisma.$transaction(async (tx) => {
      // Update customer quote
      await tx.customerQuote.update({
        where: { Id: quoteId },
        data: {
          statusCode: decision,
          decidedAt: new Date(),
        },
      });

      // Update RFQ list status
      await tx.rfqList.update({
        where: { Id: quote.rfqListId },
        data: {
          statusId:
            decision === "ACCEPTED"
              ? "CUSTOMER_ACCEPTED"
              : "CUSTOMER_REJECTED",
        },
      });
    });

    return NextResponse.json(
      { message: `Quote ${decision.toLowerCase()} successfully` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Customer quote decision error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
