'use server'

import prisma from "@/lib/prisma";
import { AttachmentContext, createAndEditRFQSchema, createCustomerQuoteSchema, createInternalRfqSchema, createInvoiceSchema, createPurchaseOrderSchema, CustomerAcceptedRFQ, fileSchema, imageSchema, MyRFQ, PMAcceptedRFQ, sendOrderToVendorSchema, submitVendorQuoteSchema, validateWithZodSchema, VendorAcceptedQuote, VendorRFQ } from "./types";
import { verifyToken } from "@/lib/jwt";
import { NextResponse } from "next/server";
import { AuthUser, getAuthUser } from "./auth";
import { redirect } from "next/navigation";
import { deleteAttachment, uploadAttachment } from "./azureBlob";
import { refresh, revalidatePath } from "next/cache";
import { fail } from "assert";

const renderError = (error: unknown): { message: string } => {
  // console.log(error);
  return {
    message: error instanceof Error ? error.message : 'an error occurred',
  };
};

const renderErrorModal = (error: unknown): { message: string, status: boolean } => {
  // console.log(error);
  return {
    message: error instanceof Error ? error.message : 'an error occurred',
    status: false
  };
};

// export const createRFQAction = async (
//   prevState: any,
//   formData: FormData
// ): Promise<{ message: string }> => {
//   try {
//     const rawData = Object.fromEntries(formData);
//     const file = formData.get('image') as File;
//     const validatedFields = validateWithZodSchema(createAndEditRFQSchema, rawData);
//     // const validatedFile = validateWithZodSchema(imageSchema, { image: file });
//     //const fullPath = await uploadImage(validatedFile.image);
    
//     const user = await getAuthUser([3]);
//     try {
//       const rawData = Object.fromEntries(formData);

//       const validatedFields = validateWithZodSchema(
//         createAndEditRFQSchema,
//         rawData
//       );

//       await prisma.$transaction(async (tx: any) => {
//         const rfq = await tx.rfqs.create({
//           data: {
//             ...validatedFields,
//             createdByUserId: user.Id,
//         },
//         });

//         await tx.rfqList.create({
//           data: {
//             rfqId: rfq.Id,
//             statusId: 'RFQ_NEW',
//             isInternalRfqCreated: false,
//           },
//         });
        
//     });
//     return { message: 'RFQ created successfully' };
//   } catch (error) {
//     return renderError(error);
//   }
//   redirect('/');
// };

export const createRFQAction = async (
  prevState: any,
  formData: FormData
): Promise<{
  message: string;
  attachmentResult?: {
    status: 'success' | 'partial' | 'failed';
    uploadedCount: number;
    failedCount: number;
    error?: string;
  };
}> => {
  let attachmentResult:
    | Awaited<ReturnType<typeof handleAttachmentsUpload>>
    | undefined;

  try {
    // 1️⃣ Auth (roleId = 3)
    const user = await getAuthUser([3]);

    // 2️⃣ Validate RFQ fields
    const rawData = Object.fromEntries(formData);
    const validatedFields = validateWithZodSchema(
      createAndEditRFQSchema,
      rawData
    );

    // 3️⃣ Create RFQ + RFQList
    const rfq = await prisma.$transaction(async (tx:any) => {
      const rfq = await tx.rfqs.create({
        data: {
          ...validatedFields,
          createdByUserId: user.Id,
        },
      });

      await tx.rfqList.create({
        data: {
          rfqId: rfq.Id,
          statusId: 'RFQ_NEW',
          isInternalRfqCreated: false,
        },
      });

      return rfq;
    });

    // 4️⃣ Handle attachments (OPTIONAL)
    const files = formData.getAll('attachments') as File[];

    attachmentResult = await handleAttachmentsUpload(
      files,
      {
        rfqId: rfq.Id,
        uploadedByUserId: user.Id,
        documentType: 'RFQ_ATTACHMENT'
      }
    );

    return {
      message:
        attachmentResult.status === 'failed'
          ? 'RFQ created, but attachments failed'
          : attachmentResult.status === 'partial'
          ? 'RFQ created, some attachments failed'
          : 'RFQ created successfully',
      attachmentResult,
    };
  } catch (error: any) {
    return {
      message:
        error?.message || 'Failed to create RFQ',
      attachmentResult,
    };
  }
};

export const getMyRFQsAction = async (): Promise<MyRFQ[]> => {
  // 🔐 Auth (any logged-in user)
  const user = await getAuthUser([3]);

  try {
    const rfqs = await prisma.rfqs.findMany({
      where: {
        createdByUserId: user.Id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        // RFQ-level attachments (customer uploaded at RFQ creation)
        attachments: {
          select: {
            Id: true,
            fileName: true,
            fileUrl: true,
            createdAt: true,
          },
        },

        // 🔑 Correct path to customer quote
        rfqList: {
          include: {
            customerQuote: {
              select: {
                Id: true,
                sellPrice: true,
                notes: true,
                statusCode: true,
                createdAt: true,
                sentAt: true,
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
      },
    });

    // Shape response for UI
    return rfqs.map((rfq: any) => ({
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
      attachments: rfq.attachments,
      customerQuote: rfq.rfqList?.customerQuote
        ? {
            id: rfq.rfqList?.customerQuote.Id,
            price: rfq.rfqList?.customerQuote.sellPrice,
            notes: rfq.rfqList?.customerQuote.notes,
            status: rfq.rfqList?.customerQuote.statusCode,
            sentAt: rfq.rfqList?.customerQuote.sentAt,
            attachments: rfq.rfqList?.customerQuote.attachments ?? [],
          }
        : null,
    }));

  } catch (error) {
    console.error('Get My RFQs error:', error);
    throw new Error('Failed to fetch RFQs');
  }
};

export const getCustomerAcceptedRFQsAction = async (): Promise<
  CustomerAcceptedRFQ[]
> => {
  // 🔐 Auth — Customer only
  const user = await getAuthUser([3]);

  try {
    const rfqs = await prisma.rfqs.findMany({
        where: {
          createdByUserId: user.Id,
          rfqList: {
            customerQuote: {
              statusCode: "ACCEPTED",
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          rfqList: {
            include: {
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

              // 🔥 PURCHASE ORDER (KEY)
              purchaseOrder: {
                select: {
                  Id: true,
                  statusCode: true,
                  createdAt: true,
                  attachments: {
                    where:{
                      documentType: {
                        in: ['PURCHASE_ORDER', 'SIGNED_CUSTOMER_ORDER']
                      }
                    },
                    select: {
                      Id: true,
                      fileName: true,
                      fileUrl: true,
                      createdAt: true,
                      documentType: true,
                      description: true,
                    },
                  },
                   invoices: {
                    include: {
                      attachments: true,
                    },
                    orderBy: {
                      createdAt: 'asc',
                    },
                  },
                },
              },
            },
          },
        },
      });

      return rfqs.map((rfq: any) => {
      const po = rfq.rfqList.purchaseOrder;

      const customerInvoices =
        po?.invoices
          ?.filter(
            (inv: any) =>
              inv.issuedBy === 'PM' &&
              inv.attachments.some(
                (a: any) => a.documentType === 'CUSTOMER_INVOICE'
              )
          )
          .map((inv: any) => ({
            id: inv.Id,
            amount: inv.amount,
            statusCode: inv.statusCode,
            createdAt: inv.createdAt,
            description: inv.description ?? null,

            invoiceAttachments: inv.attachments
              .filter(
                (a: any) => a.documentType === 'CUSTOMER_INVOICE'
              )
              .map((a: any) => ({
                Id: a.Id,
                fileName: a.fileName,
                fileUrl: a.fileUrl,
                createdAt: a.createdAt,
                description: a.description ?? null,
              })),
          })) ?? [];

      const poAttachments = po?.attachments ?? [];
        
      let orderStatus= 'Order Pending';

      if (po?.statusCode === "ORDER_SUBMITTED") {
        orderStatus = "Order Submitted";
      }
      //have to change
      if (po?.statusCode === "SENT_TO_VENDOR" || po?.statusCode === "VENDOR_SIGNED") {
        orderStatus = "In progress";
      }
      if (po?.statusCode === "ORDER_SIGNED_BY_PM") {
        orderStatus = "Invoice pending";
      }
      if (customerInvoices.length > 0) {
        orderStatus = 'Invoice Received';
      }

      return {
        rfqId: rfq.Id,
        rfqListId: rfq.rfqList.Id,
        company: rfq.company,

        customerQuote: {
          id: rfq.rfqList.customerQuote.Id,
          sellPrice: rfq.rfqList.customerQuote.sellPrice,
          notes: rfq.rfqList.customerQuote.notes,
          decidedAt: rfq.rfqList.customerQuote.decidedAt,
          statusCode: rfq.rfqList.customerQuote.statusCode,
          attachments: rfq.rfqList.customerQuote.attachments ?? [],
        },

        orderStatus,

        purchaseOrder: po
      ? {
          id: po.Id,
          statusCode: po.statusCode,
          createdAt: po.createdAt,

          customerPOAttachments: poAttachments
            .filter(
              (a: any) => a.documentType === "PURCHASE_ORDER"
            )
            .map((a: any) => ({
              Id: a.Id,
              fileName: a.fileName,
              fileUrl: a.fileUrl,
              createdAt: a.createdAt,
              description: a.description ?? null,
            })),

          pmSignedOrderToCustomerAttachments: poAttachments
            .filter(
              (a: any) =>
                a.documentType ===
                "SIGNED_CUSTOMER_ORDER"
            )
            .map((a: any) => ({
              Id: a.Id,
              fileName: a.fileName,
              fileUrl: a.fileUrl,
              createdAt: a.createdAt,
              description: a.description ?? null,
            })),
            customerInvoices
        }
      : null,
      };
    });
  } catch (error) {
    console.error(
      "Get Customer Accepted RFQs error:",
      error
    );
    throw new Error(
      "Failed to fetch accepted RFQs"
    );
  }
};

export const deleteAttachmentAction = async (
  prevState: any,
  formData: FormData
): Promise<{ message: string}> => {
  try{

      const user = await getAuthUser([3]);
    
      //const rawData = Object.fromEntries(formData);
    
        // IMPORTANT: attachment key must match input name
      const attachmentId = formData.get('attachmentId') as File | null;
      
      const attachment = await prisma.attachment.findUnique({
        where: { Id: attachmentId },
      });
    
      if (!attachment) {
        return renderError('Attachment not found');
      }
    
      // 🔐 ensure ownership
      const rfq = await prisma.rfqs.findFirst({
        where: {
          Id: attachment.rfqId!,
          createdByUserId: user.Id,
        },
      });
    
      if (!rfq) {
        return renderError('Unauthorized');
      }
    
      // delete from blob
      await deleteAttachment(attachment.fileUrl);
    
      // delete DB record
      await prisma.attachment.delete({
        where: { Id: attachmentId },
      });
    
      return {message: 'Deleted successfully'}
  }
  catch(error){
    console.log(error, 'dwedew');
    
    return renderError(error);
  }
};

export const deleteVendorAttachmentAction = async (
  prevState: any,
  formData: FormData
): Promise<{ message: string}> => {
  try{

      const user = await getAuthUser([4]);
    
      const attachmentId = formData.get('attachmentId') as File | null;

      const attachment = await prisma.attachment.findUnique({
        where: { Id: attachmentId },
        include: {
          vendorQuote: {
            include: {
              assignment: true,
            },
          },
        },
      });

      console.log(attachment, 'attchmentvendor');
      

      if (!attachment?.vendorQuote) {
        throw new Error('Attachment not found');
      }

      if (attachment.vendorQuote.assignment.vendorUserId !== user.Id) {
        throw new Error('Unauthorized');
      }
    
      //delete from blob
      await deleteAttachment(attachment.fileUrl);
    
      // delete DB record
      await prisma.attachment.delete({
        where: { Id: attachmentId },
      });
      refresh();
      return {message: 'Deleted successfully'}
  }
  catch(error){
    console.log(error, 'dwedew');
    
    return renderError(error);
  }
};

export const uploadRFQAttachmentAction = async (
prevState: any,
  formData: FormData
): Promise<{ message: string}> => {
  const user = await getAuthUser();

  const rfqId = formData.get('rfqId') as string;
  const files = formData.getAll('attachments') as File[];

  for (const file of files) {
    const validated = validateWithZodSchema(
      fileSchema,
      { file }
    );

    const url = await uploadAttachment(validated.file);

    await prisma.attachment.create({
      data: {
        rfqId,
        fileName: validated.file.name,
        fileUrl: url,
        fileType: validated.file.type,
        fileSize: validated.file.size,
        uploadedByUserId: user.Id,
      },
    });
  }

  return {message: 'Attached successfully'}
};

export const deleteRFQAction = async (
  prevState: any,
  formData: FormData
): Promise<{ message: string}> => {
  try{

    const user = await getAuthUser([3]);
  
      const rfqId = formData.get('rfqId') as String;
      
      const rfq = await prisma.rfqs.findFirst({
        where: {
          Id: rfqId,
          createdByUserId: user.Id,
        },
      });
  
      if (!rfq) {
        return renderError('RFQ not found or unauthorized')
      }
  
      // ✅ This automatically deletes RfqList
      await prisma.rfqs.delete({
        where: { Id: rfqId },
      });
  
      return {
        message: 'RFQ Deleted successfully'
      }
  }
  catch(err){
    return renderError(err);
  }
}

export const getRfqDetails = async(Id: string)  => {
  const user = await getAuthUser([3]);
  const rfq = await prisma.rfqs.findFirst({
    where: {
      Id,
      createdByUserId: user.Id,
      isEditable: true,
    },
  });
  if(!rfq){
    redirect('/rfqs/my-rfqs');
  }
  return rfq;
}

export const updateRFQAction = async (
  rfqId: string,
  prevState: any,
  formData: FormData
): Promise<{ message: string}> => {
  let attachmentResult:
    | Awaited<ReturnType<typeof handleAttachmentsUpload>>
    | undefined;

  try {
    // 1️⃣ Auth
    const user = await getAuthUser();

    // 2️⃣ Validate RFQ fields
    const rawData = Object.fromEntries(formData);
    const validatedFields = validateWithZodSchema(
      createAndEditRFQSchema,
      rawData
    );

    // 3️⃣ Ownership + editable check
    const rfq = await prisma.rfqs.findFirst({
      where: {
        Id: rfqId,
        createdByUserId: user.Id,
        isEditable: true,
      },
    });

    if (!rfq) {
      throw new Error('RFQ not found or not editable');
    }

    // 4️⃣ Update RFQ
    await prisma.rfqs.update({
      where: { Id: rfqId },
      data: validatedFields,
    });

    // 5️⃣ Attachments (OPTIONAL)
    const files = formData.getAll('attachments') as File[];

    attachmentResult = await handleAttachmentsUpload(
      files,
      {
        rfqId,
        uploadedByUserId: user.Id,
        documentType:'RFQ_ATTACHMENT'
      }
    );
    
    return {
      message:
        attachmentResult.status === 'failed'
          ? 'RFQ updated, but attachments failed'
          : attachmentResult.status === 'partial'
          ? 'RFQ updated, some attachments failed'
          : 'RFQ updated successfully'
    };
  } catch (error: any) {
    return {
      message: error.message || 'Update failed',
    };
  }
}

export const createInternalRFQ = async(prevState: any,
  formData: FormData): Promise<{ message: string, status:boolean, attachmentResult?: {
    status: 'success' | 'partial' | 'failed';
    uploadedCount: number;
    failedCount: number;
    error?: string;
  };}>=>{
    let attachmentResult:
    | Awaited<ReturnType<typeof handleAttachmentsUpload>>
    | undefined;

  try {
    // 1️⃣ Auth (PM role)
    const user = await getAuthUser([1,2]);

    // 2️⃣ Validate form fields
    const rawData = Object.fromEntries(formData);
    const {
      rfqListId,
      rfqTitle,
      rfqDescription,
    }: any = validateWithZodSchema(
      createInternalRfqSchema,
      rawData
    );

    // 3️⃣ Fetch RFQ list (needed for rfqId)
    const rfqList = await prisma.rfqList.findUnique({
      where: { Id: rfqListId },
      select: {
        Id: true,
        rfqId: true,
      },
    });

    if (!rfqList) {
      throw new Error('RFQ List not found');
    }

    const existingInternalRfq = await prisma.internalRfq.findUnique({
          where: { rfqListId },
        });
    
        if (existingInternalRfq) {
          return { message: "Internal RFQ already exists", status: true}
        }

    let internalRfqId: string;

    // 4️⃣ Transaction: create Internal RFQ + update states
    await prisma.$transaction(async (tx: any) => {
      const internalRfq = await tx.internalRfq.create({
        data: {
          rfqListId,
          rfqTitle,
          rfqDescription,
          createdByUserId: user.Id,
        },
      });

      internalRfqId = internalRfq.Id;

      await tx.rfqList.update({
        where: { Id: rfqListId },
        data: {
          isInternalRfqCreated: true,
          statusId: 'INTERNAL_RFQ_CREATED',
        },
      });

      await tx.rfqs.update({
        where: { Id: rfqList.rfqId },
        data: {
          isEditable: false,
        },
      });
    });

    // 5️⃣ Handle attachments (OPTIONAL)
    const files = formData.getAll('attachments') as File[];

    attachmentResult = await handleAttachmentsUpload(
      files,
      {
        internalRfqId: internalRfqId!,
        uploadedByUserId: user.Id,
        documentType: 'INTERNAL_RFQ_ATTACHMENT'
      }
    );

    return {
      message:
        attachmentResult.status === 'failed'
          ? 'Internal RFQ created, but attachments failed'
          : attachmentResult.status === 'partial'
          ? 'Internal RFQ created, some attachments failed'
          : 'Internal RFQ created successfully',
      status: true,
    };
  } catch (err: any) {
    return {
      message:
        err?.message ||
        'Failed to create internal RFQ',
        status: false
    };
  }
};

export const getVendorRFQsAction = async (): Promise<VendorRFQ[]> => {
  // 🔐 Vendor only
  const user = await getAuthUser([4]);

  try {
    
    const assignments = await prisma.rfqVendorAssignment.findMany({
      where: {
        vendorUserId: user.Id,
        isActive: true,
      },
      orderBy: {
        assignedAt: 'desc',
      },
      include: {
        quotes: {
          orderBy: { createdAt: 'desc' },
          take: 1, // ✅ latest quote only
          include: {
            status: {
              select: {
                code: true,
                label: true,
              },
            },
            attachments: {          // ✅ ADD THIS
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
      },
    });

    return assignments.map((a: any): VendorRFQ => {
        const latestQuote = a.quotes[0] ?? null;
        const internalRfq = a.rfqList.internalRfq;

        return {
          assignmentId: a.Id,
          rfqListId: a.rfqListId,

          company: a.rfqList.rfq.company,
          subject: internalRfq?.rfqTitle ?? 'RFQ',
          description:
            internalRfq?.rfqDescription ?? 'No description added',

          // ✅ kept
          status: a.status.label,
          hasQuoted: !!latestQuote,

          // ✅ kept
          latestQuoteAmount: latestQuote?.amount ?? null,
          latestQuoteStatus: latestQuote?.status?.label ?? 'New',

          // ✅ kept
          // previousQuotes: a.quotes.map((q: any) => q.amount),
          assignedAt: a.assignedAt,

          // ✅ kept — Internal RFQ attachments (read-only)
          attachments: internalRfq?.attachments ?? [],

          // 🆕 Vendor quote attachments (editable)
          quoteAttachments: latestQuote?.attachments ?? [],          

          // 🆕 Vendor quote id
          quoteId: latestQuote?.Id ?? null,
        };
    });

    
  } catch (error) {
    console.log(error, 'catch error');
    
    throw new Error('Failed to fetch vendor RFQs');
  }
};

export const submitVendorQuoteAction = async(prevState: any,
  formData: FormData): Promise<{ message: string, status: boolean, attachmentResult?: {
    status: 'success' | 'partial' | 'failed';
    uploadedCount: number;
    failedCount: number;
    error?: string;
  };}>=>{
    let attachmentResult:
    | Awaited<ReturnType<typeof handleAttachmentsUpload>>
    | undefined;

  try{
  // 🔐 Vendor only
    const user = await getAuthUser([4]);

  // 1️⃣ Convert FormData → plain object
  const raw = Object.fromEntries(formData.entries());

  // 2️⃣ Validate input
  const parsed = submitVendorQuoteSchema.safeParse({
    rfqVendorAssignmentId: raw.rfqVendorAssignmentId,
    amount: Number(raw.amount),
    validUntil: raw.validUntil
      ? new Date(raw.validUntil as string)
      : undefined,
    notes: raw.notes,
  });

  if (!parsed.success) {
    // return renderError(parsed.error); 
    throw new Error('Please enter valid amount');
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
    },
  });

  if (!assignment) {
    throw new Error('Assignment not found');
  }

  const createdQuote = await prisma.$transaction(async (tx: any) => {
    // 🔹 Create vendor quote
    const existingQuote = await tx.vendorQuote.findFirst({
    where: { rfqVendorAssignmentId },
  });

  let savedQuote;

  if (existingQuote) {
    // 🔁 UPDATE existing quote
    savedQuote = await tx.vendorQuote.update({
      where: { Id: existingQuote.Id },
      data: {
        amount,
        validUntil: validUntil ?? null,
        notes: notes ?? null,
        scopeDescription:
          assignment.rfqList.internalRfq?.rfqDescription ??
          'No description provided',
        // status remains NEW until PM acts
        statusCode: 'NEW',
      },
    });
    } else {
      // 🆕 CREATE first quote
      savedQuote = await tx.vendorQuote.create({
        data: {
          rfqVendorAssignmentId,
          amount,
          validUntil: validUntil ?? null,
          notes: notes ?? null,
          scopeDescription:
            assignment.rfqList.internalRfq?.rfqDescription ??
            'No description provided',
          statusCode: 'NEW',
        },
      });
    }

    // 2️⃣ Update assignment participation status
    await tx.rfqVendorAssignment.update({
      where: { Id: rfqVendorAssignmentId },
      data: {
        statusCode: 'SUBMITTED',
      },
    });

    // 3️⃣ Update RFQ workflow
    await tx.rfqList.update({
      where: { Id: assignment.rfqListId },
      data: {
        statusId: 'QUOTED',
      },
    });

    return savedQuote;
  });

  // 5️⃣ Handle attachments (common method ✅)
  const files = formData.getAll('attachments') as File[];

  if (files.length > 0) {
    await handleAttachmentsUpload(files, {
      vendorQuoteId: createdQuote.Id,
      uploadedByUserId: user.Id,
      documentType:"VENDOR_QUOTE_ATTACHMENT",
    });
  }

  // 6️⃣ Revalidate dashboard
    revalidatePath('/vendor/dashboard');

    return { message: 'Quote submitted successfully', status: true };
  }
  catch(error){
    return renderErrorModal(error);
  }
}

export const createCustomerQuoteRFQ = async(prevState: any,
  formData: FormData): Promise<{ message: string, status: boolean, attachmentResult?: {
    status: 'success' | 'partial' | 'failed';
    uploadedCount: number;
    failedCount: number;
    error?: string;
  };}>=>{
    let attachmentResult:
    | Awaited<ReturnType<typeof handleAttachmentsUpload>>
    | undefined;

  try {
    // 1️⃣ Auth (PM role)
    const user = await getAuthUser([1,2]);

    // 2️⃣ Parse form fields
    const customerRfqId = formData.get('customerRfqId') as string | null;
    // const rfqListId = formData.get('rfqListId') as string | null;
    // const sellPriceRaw = formData.get('sellPrice');
    // const notes = formData.get('notes') as string | null;

    const rawData = Object.fromEntries(formData);

    const {
      rfqListId,
      sellPrice,
      notes,
    } = validateWithZodSchema(
      createCustomerQuoteSchema,
      rawData
    );

    if (!customerRfqId || !rfqListId || !sellPrice) {
      throw new Error('Missing required fields');
    }

    // 3️⃣ Ensure RFQ list exists
    const rfqList = await prisma.rfqList.findUnique({
      where: { Id: rfqListId },
      select: { Id: true },
    });

    if (!rfqList) {
      throw new Error('RFQ list not found');
    }

    // 4️⃣ Prevent duplicate customer quote
    const existingQuote = await prisma.customerQuote.findUnique({
      where: { rfqListId }, // @@unique([rfqListId])
    });

    if (existingQuote) {
      return { message: 'Customer quote already exists for this RFQ', status: true };
    }

    let customerQuoteId: string;

    // 5️⃣ Transaction: create customer quote + update RFQ list status
    await prisma.$transaction(async (tx: any) => {
      const customerQuote = await tx.customerQuote.create({
        data: {
          // customerRfqId,
          rfqListId,
          sellPrice,
          notes: notes ?? null,
          statusCode: 'SENT',
        },
      });

      customerQuoteId = customerQuote.Id;

      await tx.rfqList.update({
        where: { Id: rfqListId },
        data: {
          statusId: 'QUOTED_TO_CUSTOMER',
        },
      });
    });

    // 6️⃣ Handle attachments (OPTIONAL)
    const files = formData.getAll('attachments') as File[];

    if (files.length > 0) {
      attachmentResult = await handleAttachmentsUpload(files, {
        customerQuoteId: customerQuoteId!,
        uploadedByUserId: user.Id,
        documentType:"CUSTOMER_QUOTE_ATTACHMENT",
      });
    }

    // 7️⃣ Revalidate PM views
    revalidatePath('/rfqs/dashboard');

    return {
      message:
        attachmentResult?.status === 'failed'
          ? 'Customer quote created, but attachments failed'
          : attachmentResult?.status === 'partial'
          ? 'Customer quote created, some attachments failed'
          : 'Customer quote created successfully',
      status: true,
    };
    
  } catch (err: any) {
    return {
      message:
        err?.message ||
        'Failed to create internal RFQ',
        status: false
    };
  }
};


export const decideCustomerQuoteAction = async(prevState: any,
  formData: FormData): Promise<{ message: string}>=>{
  try {
    // 1️⃣ Auth (PM role)
    const user = await getAuthUser([3]);

    // 2️⃣ Validate form fields
    const quoteId = formData.get('quoteId') as string | null;
    const decision = formData.get('decision') as string | null;

    if (!quoteId || !decision) {
      throw new Error('Missing required fields');
    }

    if (!['ACCEPTED', 'REJECTED'].includes(decision)) {
      throw new Error('Invalid decision');
    }

    
    // 3️⃣ Fetch quote + ownership
    // const quote = await prisma.customerQuote.findUnique({
    //   where: { Id: quoteId },
    //   include: {
    //     customerRfq: {
    //       select: {
    //         createdByUserId: true,
    //       },
    //     },
    //   },
    // });
    const quote = await prisma.customerQuote.findUnique({
      where: { Id: quoteId },
      include: {
        rfqList: {
          include: {
            rfq: {
              select: {
                createdByUserId: true,
              },
            },
          },
        },
      },
    });
    
    if (!quote) {
      throw new Error('Quote not found');
    }
    
    // 🔐 Ownership check
    if (quote.rfqList.rfq.createdByUserId !== user.Id) {
      throw new Error('Forbidden');
    }

    // 🚫 Allow decision only once
    if (quote.statusCode !== 'SENT') {
      throw new Error('Quote already finalized');
    }

    // 4️⃣ Transaction
    await prisma.$transaction(async (tx: any) => {
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
            decision === 'ACCEPTED'
              ? 'CUSTOMER_ACCEPTED'
              : 'CUSTOMER_REJECTED',
        },
      });
    });

    // 5️⃣ Revalidate customer views
    revalidatePath('/my-rfqs');

    return {
      message: `Quote ${decision.toLowerCase()} successfully`,
    };
  } catch (err: any) {
    return {
      message:
        err?.message ||
        'Failed to process decision'
    };
  }
};

export const assignVendorsAction = async(prevState: any,
  formData: FormData): Promise<{ message: string, status: boolean}>=>{
  try {
    // 1️⃣ Auth (PM role)
    const user = await getAuthUser([1,2]);
    
    const rfqListId = formData.get('rfqListId') as string | null;
    const vendorIds = formData.getAll('vendorIds') as string[];

    if (!rfqListId) {
      throw new Error('RFQ List ID is required');
    }

    if (!Array.isArray(vendorIds) || vendorIds.length === 0) {
      throw new Error('No vendors selected');
    }

    // 3️⃣ Prevent duplicate assignments
    const existingAssignments =
      await prisma.rfqVendorAssignment.findMany({
        where: {
          rfqListId,
          vendorUserId: { in: vendorIds },
        },
        select: {
          vendorUserId: true,
        },
      });

    const alreadyAssignedIds = new Set(
      existingAssignments.map((a:any) => a.vendorUserId)
    );

    const newAssignments = vendorIds
      .filter(id => !alreadyAssignedIds.has(id))
      .map(id => ({
        rfqListId,
        vendorUserId: id,
        statusCode: 'NEW',
        isActive: true,
      }));

    // 4️⃣ Nothing new to assign
    if (newAssignments.length === 0) {
      return {
        message: 'Vendors already assigned',
        status: false
      };
    }

    // 5️⃣ Transaction
    await prisma.$transaction(async (tx: any) => {
      await tx.rfqVendorAssignment.createMany({
        data: newAssignments,
      });

      await tx.rfqList.update({
        where: { Id: rfqListId },
        data: {
          statusId: 'VENDOR_ASSIGNED',
        },
      });
    });

    return {
      message: 'Vendors assigned successfully',
      status: true
    }
    
    
  } catch (err: any) {
    return {
      message:
        err?.message ||
        'Failed to create internal RFQ',
        status: false
    };
  }
};


export const updateVendorQuoteStatusAction = async(prevState: any,
  formData: FormData): Promise<{ message: string, status: boolean}>=>{
  try {
    // 1️⃣ Auth (PM role)
    const user = await getAuthUser([1,2]);
    
    const quoteId = formData.get('quoteId') as string;
    const status = formData.get('status') as string;

    if (!quoteId || !status) {
      throw new Error('Missing quoteId or status');
    }

    if (!['MARK_IN_PROGRESS', 'REJECTED', 'ACCEPTED'].includes(status)) {
      throw new Error('Invalid status');
    }

    // 3️⃣ Fetch quote
    const quote = await prisma.vendorQuote.findUnique({
      where: { Id: quoteId },
      include: {
        assignment: true,
      },
    });

    if (!quote) {
      throw new Error('Quote not found');
    }

    // 4️⃣ ACCEPT logic (transaction)
    if (status === 'ACCEPTED') {
      await prisma.$transaction(async (tx: any) => {
        // Accept selected quote
        await tx.vendorQuote.update({
          where: { Id: quote.Id },
          data: {
            statusCode: 'ACCEPTED',
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
            statusCode: 'REJECTED',
          },
        });

        // Update RFQ workflow status
        await tx.rfqList.update({
          where: { Id: quote.assignment.rfqListId },
          data: {
            statusId: 'VENDOR_SELECTED',
          },
        });
      });
    } else {
      // 5️⃣ Normal status update
      await prisma.vendorQuote.update({
        where: { Id: quote.Id },
        data: {
          statusCode: status,
        },
      });
    }
      // 6️⃣ Revalidate PM views
    revalidatePath('/rfqs/dashboard');

    return {
      message: 'Vendor quote status updated successfully',
      status: true
    }
    
    
  } catch (err: any) {
    return {
      message:
        err?.message ||
        'Failed to update!! Try again',
        status: false
    };
  }
};

export const uploadPurchaseOrderAction = async(prevState: any,
  formData: FormData): Promise<{ message: string, status:boolean, attachmentResult?: {
    status: 'success' | 'partial' | 'failed';
    uploadedCount: number;
    failedCount: number;
    error?: string;
  };}>=>{
    let attachmentResult:
    | Awaited<ReturnType<typeof handleAttachmentsUpload>>
    | undefined;

  try {
    // 1️⃣ Auth (PM role)
    const user = await getAuthUser([3]);

    // 2️⃣ Validate
    const rawData = Object.fromEntries(formData);
    const { rfqListId, description } =
      validateWithZodSchema(createPurchaseOrderSchema, rawData);

    // 🔒 Prevent duplicate PO
    const existingPO = await prisma.purchaseOrder.findUnique({
      where: { rfqListId },
    });

    if (existingPO) {
      return {
        status: false,
        message: 'Purchase order already submitted',
      };
    }

    const files = formData.getAll('attachments') as File[];

    if (!files || files.length === 0 || files[0].name === 'undefined') {
      throw new Error('Attachment is mandatory');
    }

    let purchaseOrderId: string;

    // 1️⃣ Create PO first
    const po = await prisma.purchaseOrder.create({
      data: {
        rfqListId,
        description: description ?? null,
        statusCode: 'ORDER_SUBMITTED',
        createdByUserId: user.Id,
      },
    });

    purchaseOrderId = po.Id;


    // 2️⃣ Upload attachments
    const attachmentResult = await handleAttachmentsUpload(files, {
      purchaseOrderId: po.Id,
      uploadedByUserId: user.Id,
      documentType: 'PURCHASE_ORDER',
      description,
    });

    // 3️⃣ Rollback if attachment failed
    if (attachmentResult.status === 'failed') {
      await prisma.purchaseOrder.delete({
        where: { Id: purchaseOrderId },
      });

      throw new Error(
        attachmentResult.error ||
          'Failed to upload purchase order attachment'
      );
    }

    // 4️⃣ Revalidate
    revalidatePath('/customer/accepted-rfqs');

    return {
      status: true,
      message: 'Purchase order submitted successfully',
    };
  } catch (err: any) {
    return {
      message:
        err?.message ||
        'Failed to create purchase order',
        status: false
    };
  }
};

export const getPmAcceptedRFQsAction =
  async (): Promise<PMAcceptedRFQ[]> => {
    // 🔐 PM / Admin only
    const user = await getAuthUser([1, 2]);

    try {
      const rfqs = await prisma.rfqs.findMany({
        where: {
          // createdByUserId: user.Id,
          rfqList: {
            customerQuote: {
              statusCode: "ACCEPTED",
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          rfqList: {
            include: {
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

              // 🔥 PURCHASE ORDER (KEY)
              purchaseOrder: {
                select: {
                  Id: true,
                  statusCode: true,
                  createdAt: true,
                  status:{
                    select:{
                      code: true,
                      label: true,
                    }
                  },
                  attachments: {
                    select: {
                      Id: true,
                      fileName: true,
                      fileUrl: true,
                      createdAt: true,
                      documentType: true,
                      description: true,
                    },
                  },
                  invoices: {
                    include: {
                      attachments: true,
                    },
                    orderBy: {
                      createdAt: 'asc',
                    },
                  },
                },
              },
            },
          },
        },
      });

      return rfqs.map((rfq: any) => {
        const po = rfq.rfqList.purchaseOrder;

        const vendorInvoices =
          po?.invoices
            ?.filter(
              (inv: any) =>
                inv.issuedBy === 'VENDOR' &&
                inv.attachments.some(
                  (a: any) =>
                    a.documentType === 'VENDOR_INVOICE'
                )
            )
            .map((inv: any) => ({
              id: inv.Id,
              amount: inv.amount,
              statusCode: inv.statusCode,
              issuedBy: inv.issuedBy,
              issuedTo: inv.issuedTo,
              createdAt: inv.createdAt,
              description: inv.description,
              invoiceAttachments: inv.attachments
                .filter(
                  (a: any) =>
                    a.documentType === 'VENDOR_INVOICE'
                )
                .map((a: any) => ({
                  Id: a.Id,
                  fileName: a.fileName,
                  fileUrl: a.fileUrl,
                  createdAt: a.createdAt,
                  description: a.description ?? null,
                })),
            })) ?? [];

            const customerInvoices =
              po?.invoices
                ?.filter(
                  (inv: any) =>
                    inv.issuedBy === 'PM' &&
                    inv.attachments.some(
                      (a: any) => a.documentType === 'CUSTOMER_INVOICE'
                    )
                )
                .map((inv: any) => ({
                  id: inv.Id,
                  amount: inv.amount,
                  statusCode: inv.statusCode,
                  issuedBy: inv.issuedBy,
                  issuedTo: inv.issuedTo,
                  createdAt: inv.createdAt,
                  description: inv.description,

                  invoiceAttachments: inv.attachments
                    .filter(
                      (a: any) => a.documentType === 'CUSTOMER_INVOICE'
                    )
                    .map((a: any) => ({
                      Id: a.Id,
                      fileName: a.fileName,
                      fileUrl: a.fileUrl,
                      createdAt: a.createdAt,
                      description: a.description ?? null,
                    })),
                })) ?? [];
        let orderStatus: CustomerAcceptedRFQ["orderStatus"] = "ORDER_PENDING";

        orderStatus = po?.status.label; 

        const poAttachments = po?.attachments ?? [];

        return {
          rfqId: rfq.Id,
          rfqListId: rfq.rfqList.Id,

          // ✅ CUSTOMER INFO (REQUIRED FOR PM)
          customer: {
            name: rfq.name,
            email: rfq.email,
          },

          customerQuote: {
            id: rfq.rfqList.customerQuote.Id,
            sellPrice: rfq.rfqList.customerQuote.sellPrice,
            notes: rfq.rfqList.customerQuote.notes,
            decidedAt: rfq.rfqList.customerQuote.decidedAt,
            statusCode: rfq.rfqList.customerQuote.statusCode,
            attachments: rfq.rfqList.customerQuote.attachments ?? [],
          },

          orderStatus,
          orderCode: po?.status.code,
          purchaseOrder: po
            ? {
                id: po.Id,
                statusCode: po.statusCode,
                createdAt: po.createdAt,

                // 🔥 SEGREGATION BY documentType
                customerPOAttachments: poAttachments
                  .filter((a: any) => a.documentType === "PURCHASE_ORDER")
                  .map((a: any) => ({
                    Id: a.Id,
                    fileName: a.fileName,
                    fileUrl: a.fileUrl,
                    createdAt: a.createdAt,
                    description: a.description ?? null, // ✅ KEEP THIS
                  })),

                orderToVendorAttachments: poAttachments
                  .filter((a: any) => a.documentType === "ORDER_TO_VENDOR")
                  .map((a: any) => ({
                    Id: a.Id,
                    fileName: a.fileName,
                    fileUrl: a.fileUrl,
                    createdAt: a.createdAt,
                    description: a.description ?? null, // ✅ KEEP THIS
                  })),

                 vendorSignedOrderAttachments: poAttachments
                  .filter(
                    (a: any) => a.documentType === "SIGNED_VENDOR_ORDER"
                  )
                  .map((a: any) => ({
                    Id: a.Id,
                    fileName: a.fileName,
                    fileUrl: a.fileUrl,
                    createdAt: a.createdAt,
                    description: a.description ?? null,
                  })),

                // 4️⃣ PM → Customer (SIGNED)
                pmSignedOrderToCustomerAttachments: poAttachments
                  .filter(
                    (a: any) =>
                      a.documentType ===
                      "SIGNED_CUSTOMER_ORDER"
                  )
                  .map((a: any) => ({
                    Id: a.Id,
                    fileName: a.fileName,
                    fileUrl: a.fileUrl,
                    createdAt: a.createdAt,
                    description: a.description ?? null,
                  })),
                  vendorInvoices,
                  customerInvoices
              }
            : null,
        };
    });
    } catch (error) {
      console.error(
        "Get PM Accepted RFQs error:",
        error
      );
      throw new Error(
        "Failed to fetch accepted RFQs for PM"
      );
    }
};

export const sendOrderToVendorAction = async(prevState: any,
  formData: FormData): Promise<{ message: string, status:boolean, attachmentResult?: {
    status: 'success' | 'partial' | 'failed';
    uploadedCount: number;
    failedCount: number;
    error?: string;
  };}>=>{
    let attachmentResult:
    | Awaited<ReturnType<typeof handleAttachmentsUpload>>
    | undefined;

  try {
    // 1️⃣ Auth (PM role)
    const user = await getAuthUser([1, 2]);

    // 2️⃣ Validate
    const rawData = Object.fromEntries(formData);
    const {
      purchaseOrderId,
      description,
    } = validateWithZodSchema(
      sendOrderToVendorSchema,
      rawData
    );

    // 🔒 Custmoer should upload PO
    const purchaseOrder = await prisma.purchaseOrder.findUnique({
      where: { Id: purchaseOrderId },
    });

    if (!purchaseOrder) {
      return {
        status: true,
        message: `Purchase order not found`,
      };
    }

     // 4️⃣ Ensure correct state
    if (purchaseOrder.statusCode !== "ORDER_SUBMITTED") {
      return {
        status: false,
        message:
          "Order already sent or invalid state",
      };
    }

    const files = formData.getAll('attachments') as File[];

    if (!files || files.length === 0 || files[0].name === 'undefined') {
      throw new Error('Please upload at least one attachment');
    }

    const attachmentResult =
      await handleAttachmentsUpload(files, {
        purchaseOrderId,
        uploadedByUserId: user.Id,
        documentType: "ORDER_TO_VENDOR",
        description,
      });

    if (attachmentResult.status === "failed") {
      return {
        status: false,
        message:
          attachmentResult.error ||
          "Failed to upload order attachments",
      };
    }

    // 7️⃣ Update PO status
    await prisma.purchaseOrder.update({
      where: { Id: purchaseOrderId },
      data: {
        statusCode: "SENT_TO_VENDOR",
      },
    });

    // 8️⃣ Revalidate pages
    revalidatePath("/pm/accepted-rfqs");

    return {
      status: true,
      message:
        "Order successfully sent to vendor",
    };
  } catch (err: any) {
    return {
      message:
        err?.message ||
        'Failed to send purchase order',
        status: false
    };
  }
};


export const sendSignedOrderToCustomer = async(prevState: any,
  formData: FormData): Promise<{ message: string, status:boolean, attachmentResult?: {
    status: 'success' | 'partial' | 'failed';
    uploadedCount: number;
    failedCount: number;
    error?: string;
  };}>=>{
    let attachmentResult:
    | Awaited<ReturnType<typeof handleAttachmentsUpload>>
    | undefined;

  try {
    // 1️⃣ Auth (PM role)
    const user = await getAuthUser([1, 2]);

    // 2️⃣ Validate
    const rawData = Object.fromEntries(formData);
    const {
      purchaseOrderId,
      description,
    } = validateWithZodSchema(
      sendOrderToVendorSchema,
      rawData
    );

    // 🔒 Custmoer should upload PO
    const purchaseOrder = await prisma.purchaseOrder.findUnique({
      where: { Id: purchaseOrderId },
    });

    if (!purchaseOrder) {
      return {
        status: true,
        message: `Purchase order not found`,
      };
    }

    const files = formData.getAll('attachments') as File[];

    if (!files || files.length === 0 || files[0].name === 'undefined') {
      throw new Error('Please upload at least one attachment');
    }

    const attachmentResult =
      await handleAttachmentsUpload(files, {
        purchaseOrderId,
        uploadedByUserId: user.Id,
        documentType: "SIGNED_CUSTOMER_ORDER",
        description,
      });

    if (attachmentResult.status === "failed") {
      return {
        status: false,
        message:
          attachmentResult.error ||
          "Failed to upload order attachments",
      };
    }

    // 7️⃣ Update PO status
    await prisma.purchaseOrder.update({
      where: { Id: purchaseOrderId },
      data: {
        statusCode: "ORDER_SIGNED_BY_PM",
      },
    });

    // 8️⃣ Revalidate pages
    revalidatePath("/pm/accepted-rfqs");

    return {
      status: true,
      message:
        "Signed Order successfully sent to customer",
    };
  } catch (err: any) {
    return {
      message:
        err?.message ||
        'Failed to send signed order',
        status: false
    };
  }
};


export const getVendorAcceptedQuotesAction =
  async (): Promise<VendorAcceptedQuote[]> => {
    // 🔐 PM / Admin only
    const user = await getAuthUser([4]);

    try {
      const assignments =
        await prisma.rfqVendorAssignment.findMany({
          where: {
            vendorUserId: user.Id,
            quotes: {
              some: {
                statusCode: "ACCEPTED",
              },
            },
          },
          include: {
            rfqList: {
              include: {
                rfq: true,

                purchaseOrder: {
                  include: {
                    attachments: true,
                    status: true,
                    invoices: {
                      include: {
                        attachments: true,
                      },
                      orderBy: {
                        createdAt: "asc",
                      },
                    },
                  },
                },
              },
            },

            quotes: {
              where: {
                statusCode: "ACCEPTED",
              },
              include: {
                attachments: true,
              },
            },
          },
        });

      // 🎯 Shape response
      const result = assignments.flatMap((assignment: any) =>
        assignment.quotes.map((quote: any) => {
          const po = assignment.rfqList.purchaseOrder;
          
          // let orderStatus: CustomerAcceptedRFQ["orderStatus"] = "ORDER_PENDING";

          const hasOrderFromPM =
            po &&
            po.attachments.some(
              (a: any) => a.documentType === "ORDER_TO_VENDOR"
            );

          const orderAttachments =
            po?.attachments.filter(
              (a: any) =>
                a.documentType === "ORDER_TO_VENDOR"
            ) ?? [];

          const signedOrderAttachments =
            po?.attachments.filter(
              (a: any) =>
                a.documentType === "SIGNED_VENDOR_ORDER"
            ) ?? [];

            const vendorInvoices =
              po?.invoices
                ?.filter(
                  (inv: any) =>
                    inv.issuedBy === "VENDOR" &&
                    inv.attachments.some(
                      (a: any) =>
                        a.documentType === "VENDOR_INVOICE"
                    )
                )
                .map((inv: any) => ({
                  id: inv.Id,
                  amount: inv.amount,
                  statusCode: inv.statusCode,
                  issuedBy: inv.issuedBy,
                  issuedTo: inv.issuedTo,
                  description: inv.description,
                  createdAt: inv.createdAt,

                  invoiceAttachments: inv.attachments
                    .filter(
                      (a: any) =>
                        a.documentType === "VENDOR_INVOICE"
                    )
                    .map((a: any) => ({
                      Id: a.Id,
                      fileName: a.fileName,
                      fileUrl: a.fileUrl,
                      createdAt: a.createdAt,
                      description: a.description,
                    })),
                })) ?? [];

          return {
            vendorQuoteId: quote.Id,
            rfqListId: assignment.rfqListId,

            // Customer RFQ
            company: assignment.rfqList.rfq.company,
            projectType:
              assignment.rfqList.rfq.projectType,
            briefDescription:
              assignment.rfqList.rfq.briefDescription,

            // Vendor Quote
            amount: quote.amount,
            notes: quote.notes,
            submittedAt: quote.createdAt,
            // Vendor Quote Attachments
            quoteAttachments: quote.attachments.map(
              (a: any) => ({
                Id: a.Id,
                fileName: a.fileName,
                fileUrl: a.fileUrl,
                createdAt: a.createdAt,
              })
            ),

            orderStatus: hasOrderFromPM ? po?.status?.label: 'ORDER_NOT_RECEIVED',
            // orderStatus,
            orderCode: hasOrderFromPM ? po?.status.code : null,

            // Purchase Order (optional)
            purchaseOrder: hasOrderFromPM
            ? {
              id: po.Id,
              statusCode: po.statusCode,
              createdAt: po.createdAt,
                  orderAttachments:
                    orderAttachments.map((a: any) => ({
                      Id: a.Id,
                      fileName: a.fileName,
                      fileUrl: a.fileUrl,
                      createdAt: a.createdAt,
                      description: a.description,
                    })),

                  signedOrderAttachments:
                    signedOrderAttachments.map(
                      (a: any) => ({
                        Id: a.Id,
                        fileName: a.fileName,
                        fileUrl: a.fileUrl,
                        createdAt: a.createdAt,
                        description: a.description,
                      })
                    ),
                    vendorInvoices
                }
              : null,
          };
        })
      );
      
      result.sort((a: any, b: any) => {
        const aTime = a.purchaseOrder?.createdAt
          ? new Date(a.purchaseOrder.createdAt).getTime()
          : 0;

        const bTime = b.purchaseOrder?.createdAt
          ? new Date(b.purchaseOrder.createdAt).getTime()
          : 0;

        return bTime - aTime; // newest first
      });
      return result;

    } catch (error) {
      console.error(
        "Get PM Accepted RFQs error:",
        error
      );
      throw new Error(
        "Failed to fetch accepted RFQs for PM"
      );
    }
};


export const sendOrderToPMAction = async(prevState: any,
  formData: FormData): Promise<{ message: string, status:boolean, attachmentResult?: {
    status: 'success' | 'partial' | 'failed';
    uploadedCount: number;
    failedCount: number;
    error?: string;
  };}>=>{
    let attachmentResult:
    | Awaited<ReturnType<typeof handleAttachmentsUpload>>
    | undefined;

  try {
    // 1️⃣ Auth (PM role)
    const user = await getAuthUser([4]);

    console.log(user, 'uservendorrole');
    

    // 2️⃣ Validate
    const rawData = Object.fromEntries(formData);
    const {
      purchaseOrderId,
      description,
    } = validateWithZodSchema(
      sendOrderToVendorSchema,
      rawData
    );

    // 🔒 Custmoer should upload PO
    const purchaseOrder = await prisma.purchaseOrder.findUnique({
      where: { Id: purchaseOrderId },
    });

    if (!purchaseOrder) {
      return {
        status: true,
        message: `Purchase order not found`,
      };
    }

     // 4️⃣ Ensure correct state
    if (purchaseOrder.statusCode !== "SENT_TO_VENDOR") {
      return {
        status: false,
        message:
          "Order already sent or invalid state",
      };
    }

    const files = formData.getAll('attachments') as File[];

    if (!files || files.length === 0 || files[0].name === 'undefined') {
      throw new Error('Please upload at least one attachment');
    }

    const attachmentResult =
      await handleAttachmentsUpload(files, {
        purchaseOrderId,
        uploadedByUserId: user.Id,
        documentType: "SIGNED_VENDOR_ORDER",
        description,
      });

    if (attachmentResult.status === "failed") {
      return {
        status: false,
        message:
          attachmentResult.error ||
          "Failed to upload order attachments",
      };
    }

    // 7️⃣ Update PO status
    await prisma.purchaseOrder.update({
      where: { Id: purchaseOrderId },
      data: {
        statusCode: "VENDOR_SIGNED",
      },
    });

    // 8️⃣ Revalidate pages
    // revalidatePath("/vendor/accepted-quotes");

    return {
      status: true,
      message:
        "Order successfully sent to Project Manager",
    };
  } catch (err: any) {
    return {
      message:
        err?.message ||
        'Failed to send purchase order',
        status: false
    };
  }
};

export async function generateInvoiceNumber(
  tx: typeof prisma
): Promise<string> {
  const year = new Date().getFullYear();

  const counter = await tx.invoiceCounter.upsert({
    where: { year },
    update: {
      lastValue: { increment: 1 },
    },
    create: {
      year,
      lastValue: 1,
    },
  });

  const padded = String(counter.lastValue).padStart(6, '0');

  return `INV-${year}-${padded}`;
}

export const sendInvoiceToPMAction = async(prevState: any,
  formData: FormData): Promise<{ message: string, status:boolean, attachmentResult?: {
    status: 'success' | 'partial' | 'failed';
    uploadedCount: number;
    failedCount: number;
    error?: string;
  };}>=>{
    let attachmentResult:
    | Awaited<ReturnType<typeof handleAttachmentsUpload>>
    | undefined;

  try {
    // 1️⃣ Auth (PM role)
    const user = await getAuthUser([1,2,4]);

    // 2️⃣ Validate
    const rawData = Object.fromEntries(formData);
    const {
      purchaseOrderId,
      description,
      amount
    } = validateWithZodSchema(
      createInvoiceSchema,
      rawData
    );

    const files = formData.getAll('attachments') as File[];

    if (!files || files.length === 0 || files[0].name === 'undefined') {
      throw new Error('Please upload at least one attachment');
    }


    // 3️⃣ Create invoice FIRST (DRAFT)
    const invoice = await prisma.$transaction(async (tx: any) => {
      // 1️⃣ Generate invoice number (safe + sequential)
      const invoiceNumber = await generateInvoiceNumber(tx);

      console.log(invoiceNumber, 'invoicenumber'); //have to check
      
      // 2️⃣ Create invoice
      return await tx.invoice.create({
        data: {
          invoiceNumber, // ✅ REQUIRED
          purchaseOrderId,
          amount: Math.round(amount * 100), // cents
          description,

          issuedBy: user.roleId === 4 ? 'VENDOR' : 'PM',
          issuedTo: user.roleId === 4 ? 'PM' : 'CUSTOMER',

          statusCode: 'SENT',
          typeCode: 'PARTIAL',

          createdByUserId: user.Id,
        },
      });
    });

    // 4️⃣ Upload attachments (best-effort)
    const uploadResult = await handleAttachmentsUpload(files, {
      invoiceId: invoice.Id,
      uploadedByUserId: user.Id,
      documentType:
        user.roleId === 4
          ? 'VENDOR_INVOICE'
          : 'CUSTOMER_INVOICE',
      description,
    });

    // 5️⃣ Update invoice status based on upload
    if (uploadResult.status !== 'success') {
      await prisma.invoice.delete({
        where: { Id: invoice.Id },
      });

      throw new Error('Attcahment upload failed. Invoice was not created.')
    }

    if(user.roleId === 4){
      revalidatePath('/vendor/accepted-quotes');
    }
    if(user.roleId === 1 || user.roleId === 2){
      revalidatePath('/pm/accepted-rfqs');
    }
    // 6️⃣ Revalidate views
    // revalidatePath(`/purchase-orders/${purchaseOrderId}`);

    return {
      status: true,
      message: 'Invoice created and sent successfully'
    };
  } catch (err: any) {
    return {
      message:
        err?.message || //have to remove in prod
        'Failed to create invoice',
        status: false
    };
  }
};

export async function handleAttachmentsUpload(
  files: File[],
  context: AttachmentContext
): Promise<{
  status: 'success' | 'partial' | 'failed';
  uploadedCount: number;
  failedCount: number;
  error?: string;
}> {

  const parentRefs = [
  context.rfqId,
  context.internalRfqId,
  context.vendorQuoteId,
  context.customerQuoteId,
  context.purchaseOrderId,
  context.invoiceId
].filter(Boolean);

if (parentRefs.length !== 1) {
  throw new Error(
    'Attachment must belong to exactly ONE entity'
  );
}
  if (!files || files.length === 0) {
    return {
      status: 'success',
      uploadedCount: 0,
      failedCount: 0,
    };
  }
  
  let uploadedCount = 0;
  let failedCount = 0;
  let lastError: string | undefined;

  for (const file of files) {
    try {
      if (!file || file.size === 0) continue;

      const validated = validateWithZodSchema(
        fileSchema,
        { file }
      );
      
      const url = await uploadAttachment(validated.file);

      await prisma.attachment.create({
        data: {
          rfqId: context.rfqId,
          internalRfqId: context.internalRfqId,
          vendorQuoteId: context.vendorQuoteId,
          customerQuoteId: context.customerQuoteId,
          purchaseOrderId: context.purchaseOrderId,
          invoiceId: context.invoiceId,

          description: context.description,
          documentType: context.documentType,
          
          fileName: validated.file.name,
          fileUrl: url,
          fileType: validated.file.type,
          fileSize: validated.file.size,
          uploadedByUserId: context.uploadedByUserId,
        },
      });

      uploadedCount++;
    } catch (err: any) {
      failedCount++;
      lastError =
        err?.message || 'Attachment upload failed';
    }
  }

  if (uploadedCount === 0 && failedCount > 0) {
    return {
      status: 'failed',
      uploadedCount,
      failedCount,
      error: lastError,
    };
  }

  if (failedCount > 0) {
    return {
      status: 'partial',
      uploadedCount,
      failedCount,
      error: lastError,
    };
  }

  return {
    status: 'success',
    uploadedCount,
    failedCount,
  };
}