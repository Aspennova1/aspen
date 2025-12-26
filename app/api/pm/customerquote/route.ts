import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function POST(req: NextRequest) {
  try {
    // 1️⃣ Auth
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const payload: any = await verifyToken(token);

    // 🔒 PM / Admin only
    if (![1, 2].includes(payload.roleId)) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // 2️⃣ Parse body
    const {
      customerRfqId,
      rfqListId,
      sellPrice,
      notes,
    } = await req.json();
    

    if (!customerRfqId || !rfqListId || !sellPrice ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 3️⃣ Ensure RFQ list exists
    const rfqList = await prisma.rfqList.findUnique({
      where: { Id: rfqListId },
    });

    if (!rfqList) {
      return NextResponse.json(
        { error: "RFQ list not found" },
        { status: 404 }
      );
    }

    // 4️⃣ Prevent duplicate customer quote
    const existingQuote = await prisma.customerQuote.findUnique({
      where: {
        rfqListId, // @@unique([rfqListId])
      },
    });

    if (existingQuote) {
      return NextResponse.json(
        { error: "Customer quote already exists for this RFQ" },
        { status: 409 }
      );
    }

    const result = await prisma.$transaction(async (tx: any) => {
      // 🔹 Create customer quote
      const customerQuote = await tx.customerQuote.create({
        data: {
          customerRfqId,
          rfqListId,
          sellPrice: Number(sellPrice),
          notes: notes ?? null,
          statusCode: "SENT",
        },
      });

      // 🔹 Update RFQ list status
      await tx.rfqList.update({
        where: { Id: rfqListId },
        data: {
          statusId: "QUOTED_TO_CUSTOMER",
        },
      });

      return customerQuote;
    });


    return NextResponse.json(
      {
        message: "Customer quote created successfully",
        result,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create customer quote error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
