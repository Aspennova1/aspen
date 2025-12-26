import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function POST(
  req,
  { params }
) {
  try {
    const {quoteId} = await params;
    // 🔐 Auth
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);

    // 🔒 PM / Admin only
    if (![1, 2].includes(payload.roleId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { status } = await req.json();

    console.log(status, quoteId, 'status, quoteId');
    

    if (!["MARK_IN_PROGRESS", "REJECTED", "ACCEPTED"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    // 1️⃣ Fetch quote
    const quote = await prisma.vendorQuote.findUnique({
      where: { Id: quoteId },
      include: {
        assignment: true,
      },
    });

    if (!quote) {
      return NextResponse.json(
        { error: "Quote not found" },
        { status: 404 }
      );
    }
    

    // 2️⃣ ACCEPT logic (transaction)
    if (status === "ACCEPTED") {
      await prisma.$transaction(async (tx) => {
        // Accept selected quote
        await tx.vendorQuote.update({
          where: { Id: quote.Id },
          data: {
            statusCode: "ACCEPTED",
          },
        });

        // Reject all other quotes under same RFQ
        await tx.vendorQuote.updateMany({
          where: {
            rfqVendorAssignmentId: {
              not: quote.rfqVendorAssignmentId,
            },
            assignment: {
              rfqListId: quote.assignment.rfqListId,
            },
          },
          data: {
            statusCode: "REJECTED",
          },
        });

        await tx.rfqList.update({
        where: { Id: quote.assignment.rfqListId },
        data: {
          statusId: "VENDOR_SELECTED",
        },
      });

        // Optional: lock RFQ here later
      });
    } else {
      // 3️⃣ Normal status update
      await prisma.vendorQuote.update({
        where: { Id: quote.Id },
        data: {
          statusCode: status,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update vendor quote status error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
