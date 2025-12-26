type VendorRfq = {
  assignmentId: string;
  rfqListId: string;

  company: string;
  subject: string;
  description: string;

  hasQuoted: boolean;
  latestQuoteAmount: number | null;
  latestQuoteStatus: "ASSIGNED" | "MARKED_FOR_REVIEW" | "ACCEPTED" | "REJECTED" | null;
  // latestQuoteStatus: "Assigned" | "Marked for review" | "Accepted" | "Rejected" | null;

  assignedAt: string;
};


import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload: any = await verifyToken(token);

    // 🔒 Vendor only
    if (payload.roleId !== 4) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const vendorUserId = payload.Id;

    console.log(vendorUserId, 'venodruserid');
    

    const assignments = await prisma.rfqVendorAssignment.findMany({
      where: {
        vendorUserId,
        isActive: true,
      },
      include: {
        quotes: {
          orderBy: { createdAt: "desc" },
          take: 1, // 🔑 only latest quote
          include: {
            status: {
              select: {
                code: true,
                label: true,
              },
            },
          },
        },
        status:{
          select:{
            code: true,
            label: true,
          }
        },
        rfqList: {
          include: {
            rfq: {
              select: {
                company: true,
              },
            },
            internalRfq: {
              select: {
                rfqTitle: true,
                rfqDescription: true,
              },
            },
          },
        },
      },
      orderBy: {
        assignedAt: "desc",
      },
    });

    console.log(assignments,'assignments');
    console.log(assignments[0].quotes,'quotes assignments');

    const rfqs = assignments.map((a: any) => {
      const latestQuote = a.quotes[0] ?? null;
      console.log(latestQuote, 'latestde');
      
      const quotes = a.quotes ?? [];
      return {
        assignmentId: a.Id,
        rfqListId: a.rfqListId,

        company: a.rfqList.rfq.company,
        subject: a.rfqList.internalRfq?.rfqTitle ?? "RFQ",
        description:
          a.rfqList.internalRfq?.rfqDescription ?? "No description added",
        status: a.status.label,
        hasQuoted: !!latestQuote,
        latestQuoteAmount: latestQuote?.amount ?? null,
        latestQuoteStatus: latestQuote?.status?.label ?? 'New',
        previousQuotes: quotes.map((q: any) => q.amount),
        assignedAt: a.assignedAt,
      };
    });

    console.log(rfqs, 'fjhfh');
    

    return NextResponse.json({ rfqs }, { status: 200 });
  } catch (error) {
    console.error("Vendor RFQs fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


// export async function GET(req: NextRequest) {
//   try {
//     // 1️⃣ Auth
//     const token = req.cookies.get("token")?.value;
//     if (!token) {
//       return NextResponse.json(
//         { error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     const payload: any = await verifyToken(token);

//     // 🔒 Vendor only
//     if (payload.roleId !== 4) {
//       return NextResponse.json(
//         { error: "Forbidden" },
//         { status: 403 }
//       );
//     }

//     const vendorUserId = payload.Id;

//     // 2️⃣ Fetch RFQs assigned to this vendor
//     const assignments = await prisma.rfqVendorAssignment.findMany({
//       where: {
//         vendorUserId,
//         isActive: true,
//       },
//       include: {
//         vendorStatus: {
//           select: {
//             code: true,
//             label: true,
//           },
//         },
//         quotes: {
//           orderBy: {
//             createdAt: "desc",
//           },
//           select: {
//             amount: true,
//             createdAt: true,
//           },
//         },
//         rfqList: {
//           include: {
//             rfq: {
//               select: {
//                 company: true,
//               },
//             },
//             internalRfq: {
//               select: {
//                 rfqTitle: true,
//                 rfqDescription: true
//               },
//             },
//           },
//         },
//       },
//       orderBy: {
//         assignedAt: "desc",
//       },
//     });

//     // 3️⃣ Shape response for UI
//     const rfqs = assignments.map((a: any) => {
//       const quotes = a.quotes ?? [];
//       return {
//         assignmentId: a.Id,
//         rfqListId: a.rfqListId,
//         company: a.rfqList.rfq.company,
//         subject:
//         a.rfqList.internalRfq?.rfqTitle ?? "RFQ",
//         description: a.rfqList.internalRfq?.rfqDescription ?? 'No Description added..',
//         status: a.vendorStatus.code, // 🔮 later this will be per-vendor status
//         statusLabel: a.vendorStatus.label, // 🔮 later this will be per-vendor status
//         lastQuoteAmount: quotes.length > 0 ? quotes[0].amount : null,
  
//         previousQuotes: quotes.map((q: any) => q.amount),
//       }
//     });

//     return NextResponse.json(
//       { rfqs },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Vendor RFQs fetch error:", error);

//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
