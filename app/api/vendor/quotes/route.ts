import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { submitVendorQuoteSchema } from "@/utils/types";

export async function POST(req: NextRequest) {
  try {
    // 1️⃣ Auth
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload: any = await verifyToken(token);

    // 🔒 Vendor only
    if (payload.roleId !== 4) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 2️⃣ Parse & validate body
    const body = await req.json();
    const parsed = submitVendorQuoteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const {
      rfqVendorAssignmentId,
      amount,
      validUntil,
      notes,
    } = parsed.data;

    // 3️⃣ Fetch assignment + scope snapshot
    const assignment = await prisma.rfqVendorAssignment.findUnique({
      where: { Id: rfqVendorAssignmentId },
      include: {
        rfqList: {
          include: {
            internalRfq: {
              select: {
                rfqDescription: true,
              },
            },
          },
        },
      }
    });

    if (!assignment) {
      return NextResponse.json(
        { error: "Assignment not found" },
        { status: 404 }
      );
    }

    // 4️⃣ Create quote (OPTIONAL fields handled naturally)
    // const quote = await prisma.vendorQuote.create({
    //   data: {
    //     rfqVendorAssignmentId,
    //     amount,
    //     validUntil: validUntil ?? null, // ✅ optional
    //     notes: notes ?? null,             // ✅ optional
    //     scopeDescription:
    //       assignment.rfqList.internalRfq?.rfqDescription ??
    //       "No description provided",
    //       statusCode: 'NEW'
    //   },
    // });
    

    const quote = await prisma.$transaction(async (tx: any) => {
  // 🔹 Create quote (decision workflow)
      const createdQuote = await tx.vendorQuote.create({
        data: {
          rfqVendorAssignmentId,
          amount,
          validUntil: validUntil ?? null,
          notes: notes ?? null,
          scopeDescription:
            assignment.rfqList.internalRfq?.rfqDescription ??
            "No description provided",
          statusCode: "NEW", // ✅ quote status
        },
      });

  // 🔹 Update assignment status (participation workflow)
  await tx.rfqVendorAssignment.update({
    where: { Id: rfqVendorAssignmentId },
    data: {
      statusCode: "SUBMITTED", // ✅ assignment status
    },
  });


  await tx.rfqList.update({
        where: { Id: assignment.rfqListId },
        data: {
          statusId: "QUOTED",
        },
      });

  return createdQuote;
});
    return NextResponse.json(
      {
        message: "Quote submitted successfully",
        quoteId: quote.Id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Submit vendor quote error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
