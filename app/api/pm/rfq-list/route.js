// type RfqListItem = {
//   id: string;
//   status: {
//     code: string;
//     label: string;
//   };
//   createdAt: string;

//   rfq: {
//     Id: string;
//     name: string;
//     email: string;
//     company: string;
//     projectType: string;
//   };

//   isInternalRfqCreated: boolean;
// };

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { unauthorized } from "next/navigation";

export async function GET(req) {
  try {
    // 1️⃣ Auth
    const token = req.cookies.get("token")?.value;
    if (!token) {
      unauthorized();
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);

    // 🔒 Only Project Manager / Admin
    if (![1, 2].includes(payload.roleId)) {
      unauthorized();
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    
    // 2️⃣ Fetch RFQ List for PM
    const rfqList = await prisma.rfqList.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        rfq: {
          select: {
            Id: true,
            name: true,
            email: true,
            company: true,
            projectType: true,
            attachments: {
              select: {
                Id: true,
                fileName: true,
                fileUrl: true,
              },
            },
          },
        },
        vendorAssignments: {
          include: {
            vendorUser: {
              select: {
                FullName: true,
                email: true,
              },
            },
            quotes: {
              where: {
                statusCode: "ACCEPTED",
              },
              include: {
                attachments: {
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
        },
        customerQuote: {
          select: {
            Id: true,
            sellPrice: true,
            notes: true,
            decidedAt: true,
            statusCode: true,
            attachments: {
              select: {
                Id: true,
                fileName: true,
                fileUrl: true,
                createdAt: true,
              },
            },
          },
        },
        status: {
          select: {
            code: true,
            label: true,
          },
        },
      },
    });

    // console.log(rfqList, 'rfqList');
    
    // 3️⃣ Shape response for UI
    const response = rfqList.map((item) => {
      // ----------------------------
      // Vendor-related flags
      // ----------------------------
      const hasVendorAssigned = item.vendorAssignments.length > 0;

      const hasVendorQuotes = item.vendorAssignments.some(
        (a) => a.quotes.length > 0
      );

      const hasAcceptedVendorQuote = item.vendorAssignments.some(
        (a) => a.quotes.some((q) => q.statusCode === "ACCEPTED")
      );

      // ----------------------------
      // Accepted Vendor Quote (ONLY ONE)
      // ----------------------------
      const acceptedVendorAssignment = item.vendorAssignments.find(
        (a) => a.quotes.length > 0
      );

      const acceptedVendorQuote = acceptedVendorAssignment
        ? {
            vendorName: acceptedVendorAssignment.vendorUser.FullName,
            vendorEmail: acceptedVendorAssignment.vendorUser.email,
            amount: acceptedVendorAssignment.quotes[0].amount,
            notes: acceptedVendorAssignment.quotes[0].notes,
            attachments:
              acceptedVendorAssignment.quotes[0].attachments ?? [],
          }
        : null;

      // ----------------------------
      // Customer Quote details
      // ----------------------------
      const customerQuoteDetails = item.customerQuote
        ? {
            id: item.customerQuote.Id,
            amount: item.customerQuote.sellPrice,
            notes: item.customerQuote.notes,
            decidedAt: item.customerQuote.decidedAt,
            statusCode: item.customerQuote.statusCode,
            attachments: item.customerQuote.attachments ?? [],
          }
        : null;

      // ----------------------------
      // Customer quote sent flag
      // ----------------------------
      const isCustomerQuoteSent =
        item.customerQuote?.statusCode === "SENT" ||
        item.customerQuote?.statusCode === "ACCEPTED" ||
        item.customerQuote?.statusCode === "REJECTED";

      // ----------------------------
      // RFQ attachments
      // ----------------------------
      const attachmentCount = item.rfq.attachments.length;
      const hasAttachments = attachmentCount > 0;

      // ----------------------------
      // FINAL RESPONSE OBJECT
      // ----------------------------
      return {
        id: item.Id,
        createdAt: item.createdAt,
        isInternalRfqCreated: item.isInternalRfqCreated,

        status: {
          code: item.status.code,
          label: item.status.label,
        },

        rfq: {
          Id: item.rfq.Id,
          name: item.rfq.name,
          email: item.rfq.email,
          company: item.rfq.company,
          projectType: item.rfq.projectType,
        },

        // RFQ attachments
        hasAttachments,
        attachmentCount,
        attachments: item.rfq.attachments,

        // Vendor flow flags
        hasVendorAssigned,
        hasVendorQuotes,
        hasAcceptedVendorQuote,

        // ✅ Accepted Vendor Details (NEW)
        acceptedVendorQuote,

        // ✅ Customer Quote Details (NEW)
        customerQuoteDetails,

        // Locking flag
        isCustomerQuoteSent,
      };
    });

    // console.log(response, 'response');
    

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("PM RFQ list error:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
