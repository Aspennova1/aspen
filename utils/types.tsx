// import * as z from 'zod';
import { Attachment } from '@prisma/client';
import { z, ZodSchema } from 'zod';

export type LoginType = {
  email: string;
  password: string;

};

export type AppJwtPayload = {
  Id: string;
  email: string;
  name: string;
  roleId: number;
  role: string;
};

export type RegisterType = {
  id: string;
  username: string;
  email: string;
  password: string;
  Role: string;
};

export type CreateRFCType = {
  Name: string;
  Email: string;
  Company: z.ZodEnum<typeof RFQCompanies>;
  ProjectType: string;
  BriefDescription: string;
  BudgetRange: string;
  Timeline: string;
};

// export type CreateInternalRFCType = {
//   Name: string;
//   Email: string;
//   Company: z.ZodEnum<typeof RFQCompanies>;
//   ProjectType: string;
//   BriefDescription: string;
//   BudgetRange: string;
//   Timeline: string;
// };

export enum RFQCompanies {
  AspenEPC = 'Aspen EPC',
  AspenDeveloper = 'Aspen Developer',
  AspenMills = 'Aspen Mills',
  AspenFireSafety = 'Aspen Fire & Safety',
  AspenIndustrialSolutions = 'Aspen Industrial Solutions',
}

// export const createAndEditJobSchema = z.object({
//   position: z.string().min(2, {
//     message: 'position must be at least 2 characters.',
//   }),
//   company: z.string().min(2, {
//     message: 'company must be at least 2 characters.',
//   }),
//   location: z.string().min(2, {
//     message: 'location must be at least 2 characters.',
//   }),
//   status: z.nativeEnum(JobStatus),
//   mode: z.nativeEnum(JobMode),
// });

export const createAndEditRFQSchema = z.object({
  name: z.string().min(2, {
    message: 'name must be at least 2 characters.',
  }),
  email: z.email({
    message: 'Invalid email address.',
  }),
  company: z.enum(RFQCompanies),
  projectType: z.string().min(2, {
    message: 'location must be at least 5 characters.',
  }),
  briefDescription: z.string().min(2, {
    message: 'Description must be at least 10 characters.',
  }),
  budgetRange: z.string().optional(),
  timeline: z.string().optional(),
  // attachmentFile: z.file().
  // files: z.custom<FileList>().optional(),
});

export type CreateAndEditRFQType = z.infer<typeof createAndEditRFQSchema>;

export const registerUserSchema = z.object({
  name: z.string().min(2, {
    message: 'name must be at least 2 characters.',
  }),
  email: z.email({
    message: 'Invalid email address.',
  }),
  password: z.string().min(4, {
    message: 'Password must be at least 4 characters.',
  }),
  confirmPassword: z.string().min(4),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
  });

export type RegisterUserType = z.infer<typeof registerUserSchema>;


export const createInternalRfqSchema = z.object({
  rfqListId: z
    .string()
    .min(1, "RFQ reference is required"),

  rfqTitle: z
    .string()
    .min(3, "RFQ title must be at least 3 characters")
    .max(100, "RFQ title must be less than 100 characters"),

  rfqDescription: z
    .string()
    .min(10, "RFQ description must be at least 10 characters")
    .max(1000, "RFQ description must be less than 1000 characters"),
});

export type CreateInternalRfqType = z.infer<
  typeof createInternalRfqSchema
>;

export const createVendorSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.email("Invalid email"),
  mobile: z
    .string()
    .min(10, "Mobile number must be at least 10 digits"),
  location: z.string().min(2, "City is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

export type CreateVendorType = z.infer<typeof createVendorSchema>;

const today = new Date();
today.setHours(0, 0, 0, 0);

export const submitVendorQuoteSchema = z.object({
  rfqVendorAssignmentId: z.string().min(1),
  amount: z.coerce.number({error: 'Amount is required'}).int().min(1, {
    message: 'Amount must be greater than 0'
  }),
  // amount: z.coerce.number({error: 'Amount is required'}).positive({error: 'Amount must be greater than 0'}),
  validUntil: z.coerce.date().optional().refine(
      (date) => !date || date > today,
      "Valid until date must be after today"
    ),
    notes: z.string().optional(),
});

export type SubmitVendorQuoteType = z.infer<
  typeof submitVendorQuoteSchema
>;

export const createCustomerQuoteSchema = z.object({
  customerRfqId: z.string(),
  rfqListId: z.string(),
  sellPrice: z.coerce.number({error: 'Amount is required'}).int().min(1, {
    message: 'Amount must be greater than 0'
  }),
  // sellPrice: z.coerce.number({error: 'Amount is required'}).positive({error: 'Amount must be greater than 0'}),
  // sellPrice: z.coerce.number({error: 'Amount is required'}).positive({error: 'Amount must be greater than 0'}),
  // sellPrice: z.number().min(1),
  notes: z.string().optional(),
});

export type CreateCustomerQuoteType = z.infer<
  typeof createCustomerQuoteSchema
>;

export type actionFunction = (
  prevState: any,
  formData: FormData
) => Promise<{ message: string }>;

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const ALLOWED_TYPES = [
  'application/pdf',
  'application/vnd.ms-excel', // .xls
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
];

export const imageSchema = z.object({
  image: validateImageFile(),
});

export const fileSchema = z.object({
  file: validateDocumentFile(),
});

function validateImageFile() {
  const maxUploadSize = 1024 * 1024;
  const acceptedFileTypes = ['image/'];
  return z
    .instanceof(File)
    .refine((file) => {
      return !file || file.size <= maxUploadSize;
    }, 'File size must be less than 1MB')
    .refine((file) => {
      return (
        !file || acceptedFileTypes.some((type) => file.type.startsWith(type))
      );
    }, 'File must be an image');
}

export function validateDocumentFile() {
  const maxUploadSize = 10 * 1024 * 1024; // 10MB

  const acceptedFileTypes = [
    'application/pdf',
    'application/vnd.ms-excel', // .xls
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  ];

  return z
    .instanceof(File)
    .refine(
      (file) => file.size <= maxUploadSize,
      'File size must be less than 10MB'
    )
    .refine(
      (file) => acceptedFileTypes.includes(file.type),
      'Only PDF and Excel files are allowed'
    );
}

export function validateWithZodSchema1<T>(
  schema: ZodSchema<T>,
  data: unknown
): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors = result.error.message;
    // errors.map((error) => error.message);
    throw new Error(errors);
  }
  return result.data;
}

export function validateWithZodSchema<T>(schema: ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);

  if (!result.success) {
    const messages = result.error.issues.map((issue: any) => issue.message);
    throw new Error(messages.join(", "));
  }

  return result.data;
}


export type MyRFQ = {
  Id: string;
  name: string;
  email: string;
  projectType: string;
  company: string;
  budgetRange?: string | null;
  timeline?: string | null;
  briefDescription: string;
  isEditable: boolean;
  createdAt: Date;
  attachments: Attachment[]
  customerQuote: {
    id: string;
    price: number;
    notes?: string | null;
    status: string;
    sentAt?: Date | null;
    attachments: {
      Id: string;
      fileName: string;
      fileUrl: string;
      createdAt: Date;
    }[];
  } | null;
};

export type VendorRFQ2 = {
  assignmentId: string;
  rfqListId: string;

  company: string;
  subject: string;
  description: string;

  status: string;
  hasQuoted: boolean;

  latestQuoteAmount: number | null;
  latestQuoteStatus: string;

  previousQuotes: number[];
  assignedAt: Date;

  attachments: Attachment[]
};

export type VendorRFQ = {
  assignmentId: string;
  rfqListId: string;

  company: string;
  subject: string;
  description: string;

  status: string;        // ✅ kept
  hasQuoted: boolean;    // ✅ kept

  latestQuoteAmount: number | null;   // ✅ kept
  latestQuoteStatus: string;           // ✅ kept

  // previousQuotes: number[];            // ✅ kept
  assignedAt: Date;

  // 📎 Internal RFQ attachments (read-only)
  attachments: {
    Id: string;
    fileName: string;
    fileUrl: string;
    createdAt: Date;
  }[];

  // 🆕 Vendor quote attachments (editable)
  quoteAttachments: {
    Id: string;
    fileName: string;
    fileUrl: string;
    createdAt: Date;
  }[];

  // 🆕 Vendor quote id (optional but useful)
  quoteId: string | null;
};


export type CustomerAcceptedRFQ = {
  rfqId: string;
  rfqListId: string;

  company: string;

  customerQuote: {
    id: string;
    sellPrice: number;
    notes?: string | null;
    decidedAt?: Date | null;
    statusCode: string;
    attachments: Attachment[];
  };

  // 🧭 Derived, customer-friendly status
  orderStatus: string;

  purchaseOrder: {
    id: string;
    statusCode: string;
    createdAt: Date;

    // 1️⃣ Customer → PM (Original PO)
    customerPOAttachments: Attachment[];

    // 2️⃣ PM → Customer (Signed Order)
    pmSignedOrderToCustomerAttachments: Attachment[];

    // 🧾 PM → Customer invoices (WHAT CUSTOMER CARES ABOUT)
    customerInvoices: {
      id: string;
      amount: number;
      statusCode: string;
      createdAt: Date;
      description: string | null;

      invoiceAttachments: {
        Id: string;
        fileName: string;
        fileUrl: string;
        createdAt: Date;
        description?: string | null;
      }[];
    }[];
  } | null;
};


export const createPurchaseOrderSchema = z.object({
  rfqListId: z.string().min(1, "RFQ List is required"),
  customerQuoteId: z.string().min(1, "Customer quote is required"),
  description: z.string().optional(),
});


export type PMAcceptedRFQ = {
  rfqId: string;
  rfqListId: string;

  // 👤 Customer info (REQUIRED for PM view)
  customer: {
    name: string;
    email: string;
  };

  company: string;

  // 💰 Customer Quote (PM → Customer)
  customerQuote: {
    id: string;
    sellPrice: number;
    notes?: string | null;
    decidedAt?: Date | null;
    statusCode: string;

    attachments: {
      Id: string;
      fileName: string;
      fileUrl: string;
      createdAt: Date;
    }[];
  };

  // 📦 Purchase Order (Customer + PM → Vendor)
  purchaseOrder: {
    id: string;
    statusCode: string;
    createdAt: Date;

    // 🔥 Segregated by documentType (DO NOT merge)
    customerPOAttachments: {
      Id: string;
      fileName: string;
      fileUrl: string;
      createdAt: Date;
      description?: string | null;
    }[];

    orderToVendorAttachments: {
      Id: string;
      fileName: string;
      fileUrl: string;
      createdAt: Date;
      description?: string | null;
    }[];

    vendorSignedOrderAttachments: {
      Id: string;
      fileName: string;
      fileUrl: string;
      createdAt: Date;
      description?: string | null;
    }[];

    pmSignedOrderToCustomerAttachments: {
      Id: string;
      fileName: string;
      fileUrl: string;
      createdAt: Date;
      description?: string | null;
    }[];

    vendorInvoices: {
      id: string;
      amount: number;
      statusCode: string;
      createdAt: Date;
      description: string;
      invoiceAttachments: {
        Id: string;
        fileName: string;
        fileUrl: string;
      }[];
    }[];

  customerInvoices: {
    id: string;
    amount: number;
    statusCode: string;
    createdAt: Date;
    description: string | null;

      invoiceAttachments: {
        Id: string;
        fileName: string;
        fileUrl: string;
        createdAt: Date;
        description?: string | null;
      }[];
    }[];
  } | null;

  orderCode: string  // PM sent order to vendor 
  // 🟡 Derived for UI (based on purchaseOrder.statusCode)
  orderStatus: string;
};

export type DocumentType =
  | 'RFQ_ATTACHMENT'            // Customer RFQ
  | 'INTERNAL_RFQ_ATTACHMENT'   // PM internal RFQ
  | 'VENDOR_QUOTE_ATTACHMENT'   // Vendor quote
  | 'CUSTOMER_QUOTE_ATTACHMENT' // PM → Customer
  | 'PURCHASE_ORDER'            // Customer → PM
  | 'SIGNED_CUSTOMER_ORDER'     // PM -> Customer
  | 'ORDER_TO_VENDOR'           // PM → Vendor
  | 'INVOICE';                  // Vendor → PM


export type AttachmentContext = {
  // 🔗 Parent relationship (exactly ONE should be set)
  rfqId?: string;
  internalRfqId?: string;
  vendorQuoteId?: string;
  customerQuoteId?: string;
  purchaseOrderId?: string;
  invoiceId?: string; 
  // 👤 Audit
  uploadedByUserId: string;

  // 🏷️ Business intent (MANDATORY going forward)
  documentType:
    | 'RFQ_ATTACHMENT'
    | 'INTERNAL_RFQ_ATTACHMENT'
    | 'VENDOR_QUOTE_ATTACHMENT'
    | 'CUSTOMER_QUOTE_ATTACHMENT'

    //Purchase irder lifecycle
    | 'PURCHASE_ORDER'
    | 'ORDER_TO_VENDOR'
    | 'SIGNED_VENDOR_ORDER'
    | 'SIGNED_CUSTOMER_ORDER'

    //Invoices
    | 'VENDOR_INVOICE'
    | 'CUSTOMER_INVOICE' ;

  // 📝 Optional notes (PO / Order / Invoice)
  description?: string;
};


export const sendOrderToVendorSchema = z.object({
  purchaseOrderId: z.string().min(1, "Purchase Order Id is required"),
  description: z.string().optional(),
});


export type VendorAcceptedQuote = {
  vendorQuoteId: string;
  rfqListId: string;

  // Customer RFQ
  company: string;
  projectType: string;
  briefDescription: string;

  // Vendor Quote
  amount: number;
  notes?: string | null;
  submittedAt: Date;

  // Vendor's own quote attachments
  quoteAttachments: {
    Id: string;
    fileName: string;
    fileUrl: string;
    createdAt: Date;
  }[];

  // Purchase Order from PM
  purchaseOrder?: {
    id: string;
    statusCode: string;
    createdAt: Date;
    orderStatus: string;
    orderCode: string;
    // PM → Vendor
    orderAttachments: {
      Id: string;
      fileName: string;
      fileUrl: string;
      createdAt: Date;
      description?: string | null;
    }[];

    // PM → Vendor (signed copy)
    signedOrderAttachments: {
      Id: string;
      fileName: string;
      fileUrl: string;
      createdAt: Date;
      description?: string | null;
    }[];

    vendorInvoices: {
      id: string;
      amount: number;
      statusCode: string;
      issuedBy: 'VENDOR';
      issuedTo: 'PM' | 'CUSTOMER';
      createdAt: Date;
      description: string;
      invoiceAttachments: {
        Id: string;
        fileName: string;
        fileUrl: string;
        createdAt: Date;
        description?: string | null;
      }[];
    }[];
  } | null;
};


export const createInvoiceSchema = z.object({
  purchaseOrderId: z
    .string()
    .min(1, 'Purchase order is required'),

  amount: z.coerce.number({error: 'Amount is required'}).int().min(1, {
    message: 'Amount must be greater than 0'
  }),
  description: z
    .string()
    .max(500, 'Description too long')
    .optional(),
});


export type CreateInvoiceSchemaType = z.infer<
  typeof createInvoiceSchema
>;

export type InvoiceWithPurchaseOrderRFQ = {
  Id: string;
  amount: number;
  currency: string;
  status: string;

  // 🧾 Invoice details
  invoiceNumber: string;
  description?: string;
  dueDate?: Date;
  createdAt: Date;
  purchaseOrder: {
    Id: string;

    rfqList: {
      Id: string;

      rfq: {
        name: string;
        email: string;
        company: string;
        createdByUserId: string;
      };
    };
  } | null;
};



export const resetPasswordSchema = z
  .object({
    password: z.string().min(7, "Minimum 7 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordType = z.infer<typeof resetPasswordSchema>;

export const forgotPasswordSchema = z.object({
  email: z.email("Enter a valid email"),
});

export type ForgotPasswordType = z.infer<typeof forgotPasswordSchema>;