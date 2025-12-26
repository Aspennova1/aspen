import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
//not used
export async function GET(req: NextRequest) {
  try {
    // 1️⃣ Get token from cookie
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2️⃣ Verify token
    const payload: any = await verifyToken(token);

    if (!payload?.email) {
      return NextResponse.json(
        { message: "Invalid token" },
        { status: 401 }
      );
    }


    // console.log(payload.Id, 'payloadId');
    
    // 3️⃣ Fetch RFQs ONLY for this user
    const rfqs = await prisma.rfqs.findMany({
      where: {
        createdByUserId: payload.Id, // 🔒 CRITICAL SECURITY LINE
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
    customerQuote: {
      select: {
        Id: true,
        sellPrice: true,
        notes: true,
        statusCode: true, // NEW | SENT | ACCEPTED | REJECTED
        createdAt: true,
        sentAt: true,
      },
    },
  },
    });

    const response = rfqs.map((rfq:any) => ({
      Id: rfq.Id,
      name: rfq.name,
      email: rfq.email,
      projectType: rfq.projectType,
      company: rfq.company,
      budgetRange: rfq.budgetRange,
      timeline: rfq.timeline,
      briefDescription: rfq.briefDescription,
      isEditable: rfq.isEditable,
      createdAt: rfq.createdAt,

      // 🔑 This drives the UI
      customerQuote: rfq.customerQuote
        ? {
            id: rfq.customerQuote.Id,
            price: rfq.customerQuote.sellPrice,
            notes: rfq.customerQuote.notes,
            status: rfq.customerQuote.statusCode,
            sentAt: rfq.customerQuote.sentAt,
          }
        : null,
    }));


    return NextResponse.json({ rfqs: response }, { status: 200 });
  } catch (error) {
    console.error("Get My RFQs error:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
