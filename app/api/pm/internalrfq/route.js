import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { createInternalRfqSchema } from "@/utils/types";

export async function POST(req) {
  try {
    // 1️⃣ Auth
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);

    
    // 🔒 Allow only PM / Admin
    if (![1, 2].includes(payload.roleId)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    
    // 2️⃣ Parse & validate body
    const body = await req.json();
    const { rfqListId, rfqTitle, rfqDescription } =
    createInternalRfqSchema.parse(body);
    
    // console.log(rfqListId, rfqTitle, rfqDescription, 'logsss' );
    
    // 3️⃣ Ensure RFQList exists
    const rfqList = await prisma.rfqList.findUnique({
      where: { Id: rfqListId },
      select: { rfqId: true },
    });
    // console.log(rfqList, 'body');

    if (!rfqList) {
      return NextResponse.json(
        { message: "RFQ not found" },
        { status: 404 }
      );
    }

    // 4️⃣ Prevent duplicate Internal RFQ
    const existingInternalRfq = await prisma.internalRfq.findUnique({
      where: { rfqListId },
    });

    if (existingInternalRfq) {
      return NextResponse.json(
        { message: "Internal RFQ already exists" },
        { status: 400 }
      );
    }

    // 5️⃣ Create Internal RFQ + update RfqList (TRANSACTION)
    const result = await prisma.$transaction(async (tx) => {
      const internalRfq = await tx.internalRfq.create({
        data: {
          rfqListId,
          rfqTitle,
          rfqDescription,
          createdByUserId: payload.Id,
        },
      });
      
      await tx.rfqList.update({
        where: { Id: rfqListId },
        data: {
          isInternalRfqCreated: true,
          statusId: "INTERNAL_RFQ_CREATED", // must exist in RfqStatus.codeId
        },
      });

      await tx.rfqs.update({
      where: {
        Id: rfqList.rfqId,
      },
      data: {
        isEditable: false,
      },
    });

      return internalRfq;
    });

    return NextResponse.json(
      {
        message: "Internal RFQ created successfully",
        internalRfq: result,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create Internal RFQ error:", error);

    // Zod validation error
    if (error?.name === "ZodError") {
      return NextResponse.json(
        { message: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
