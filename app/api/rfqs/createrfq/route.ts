import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function POST(req: NextRequest) {
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
    
    // 3️⃣ Read request body
    const body = await req.json();
    const {
      name,
      email,
      company,
      projectType,
      budgetRange,
      timeline,
      briefDescription,
    } = body;
    
    // 4️⃣ Basic validation
    if (!name || !email || !company || !projectType || !briefDescription) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // 5️⃣ Create RFQ
    const rfq = await prisma.rfqs.create({
      data: {
        name,
        email,
        company,
        projectType,
        budgetRange,
        timeline,
        briefDescription,
        createdByUserId: payload.Id, // ObjectId from token
      },
    });

    const rfqList = await prisma.rfqList.create({
        data: {
          rfqId: rfq.Id,
          statusId: "RFQ_NEW", // MUST exist in RfqStatus.codeId
          isInternalRfqCreated: false,
        },
      });

    return NextResponse.json(
      { message: "RFQ created successfully", rfq },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create RFQ error:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// export async function POST() {
//   try {
//     const statuses = [
//       { codeId: "RFQ_NEW", code: "NEW", label: "New" },
//       { codeId: "INTERNAL_RFQ_CREATED", code: "INTERNAL_RFQ_CREATED", label: "Internal RFQ Created" },
//       { codeId: "VENDOR_ASSIGNED", code: "VENDOR_ASSIGNED", label: "Vendor Assigned" },
//       { codeId: "QUOTED", code: "QUOTED", label: "Quoted" },
//       { codeId: "VENDOR_SELECTED", code: "VENDOR_SELECTED", label: "Vendor Selected" },
//       { codeId: "QUOTED_TO_CUSTOMER", code: "QUOTED_TO_CUSTOMER", label: "Quote sent to Customer" },
//       { codeId: "CUSTOMER_REJECTED", code: "CUSTOMER_REJECTED", label: "Customer Rejected" },
//       { codeId: "PENDING_PAYMENT", code: "PENDING_PAYMENT", label: "Pending Payment" },
//       { codeId: "CUSTOMER_ACCEPTED", code: "CUSTOMER_ACCEPTED", label: "Customer Accepted" },
//     ];

//     const results = [];

//     for (const status of statuses) {
//       const upserted = await prisma.rfqStatus.upsert({
//         where: { codeId: status.codeId },
//         update: {}, // 🔒 immutable
//         create: status,
//       });

//       results.push(upserted);
//     }

//     return NextResponse.json(
//       {
//         message: "RFQ statuses initialized successfully",
//         count: results.length,
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("RFQ status init error:", error);

//     return NextResponse.json(
//       { message: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }