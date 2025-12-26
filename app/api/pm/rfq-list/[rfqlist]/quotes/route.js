import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function GET(
  req,
  { params }
) {
  try {
    const { rfqlist } = await params;
    // 1️⃣ Auth
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);

    // 🔒 PM only (adjust roleId if needed)  //have to change
    if (payload.roleId === 3 || payload.roleId === 4) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // 2️⃣ Fetch assignments + vendors + quotes
    const assignments = await prisma.rfqVendorAssignment.findMany({
      where: {
        rfqListId: rfqlist,
        isActive: true,
      },
      orderBy: {
        assignedAt: "asc",
      },
      include: {
        vendorUser: {
          select: {
            Id: true,
            FullName: true,
            email: true,
          },
        },
        status: {
          select: {
            code: true,
            label: true,
          },
        },
        quotes: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
          select: {                     // ✅ ONLY select
            Id: true,
            amount: true,
            notes: true,
            createdAt: true,
            statusCode: true,
            attachments: {              // ✅ relation inside select
              select: {
                Id: true,
                fileName: true,
                fileUrl: true,
                createdAt: true,
              },
            },
          },
        },
      },
    });

    // console.log(assignments[0].quotes[0], 'assihdw');
    

    // 3️⃣ Shape response for UI
    const quotes = assignments
      .filter((a) => a.quotes.length > 0) // only vendors who submitted
      .map((a) => ({
        assignmentId: a.Id,
        vendorId: a.vendorUser.Id,
        vendorName: a.vendorUser.FullName,
        vendorEmail: a.vendorUser.email,
        quoteId: a.quotes[0].Id,
        amount: a.quotes[0].amount,
        notes: a.quotes[0].notes ?? undefined,
        submittedAt: a.quotes[0].createdAt,
        statusCode: a.quotes[0].statusCode,
        attachments: a.quotes[0].attachments
        // status: {
        //   code: a.status.code,
        //   label: a.status.label,
        // },
      }));

      // console.log(quotes, 'rfqlisttt');
      

    return NextResponse.json(
      {
        rfqListId: rfqlist,
        quotes,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get vendor quotes error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
