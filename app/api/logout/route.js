import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
// import {Resend} from 'resend'
// import Stripe from "stripe";
// import PayReceiptEmail from '@/components/email/PayReceiptEmail';
// import ResetPasswordEmail from "@/components/email/ResetPasswordEmail";

// const resend = new Resend(process.env.RESEND_API_KEY);
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET() {
  try {
        const response = NextResponse.json({ message: "Logged out" });
        response.cookies.set("token", "", {
        expires: new Date(0),
        path: "/",
    });
    
    return response;
  } catch (err) {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}


// const VENDOR_STATUSES = [
//   { code: "ASSIGNED", label: "Assigned" },
//   { code: "MARKED_FOR_REVIEW", label: "Marked for review" },
//   { code: "ACCEPTED", label: "Accepted" },
//   { code: "REJECTED", label: "Rejected" },
// ];

// export async function POST() {
//   try {
//     const statuses = [
//       { code: "NEW", label: "New" },
//       { code: "SENT", label: "Sent to Customer" },
//       { code: "ACCEPTED", label: "Accepted" },
//       { code: "REJECTED", label: "Rejected" },
//     ];

//     for (const status of statuses) {
//       await prisma.customerQuoteStatus.upsert({
//         where: { code: status.code },
//         update: {}, // 🔒 immutable
//         create: status,
//       });
//     }

//     return NextResponse.json(
//       {
//         message: "customer quote statuses initialized successfully",
//         count: statuses.length,
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Vendor status init error:", error);

//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// export async function POST() {
//   try {
//     const statuses = [
//       { code: "PO_PENDING", label: "Customer uploaded PO" },
//       { code: "PO_REVIEWED", label: "PM reviewed" },
//       { code: "PO_SENT_TO_VENDOR", label: "PM reviewed" },
//       { code: "PO_REJECTED", label: "PM sent to vendor" },
//       { code: "PO_REVISED", label: "Customer revised PO" },
//     ];

//     for (const status of statuses) {
//       await prisma.purchaseOrderStatus.upsert({
//         where: { code: status.code },
//         update: {}, // 🔒 immutable
//         create: status,
//       });
//     }

//     return NextResponse.json(
//       {
//         message: "customer quote statuses initialized successfully",
//         count: statuses.length,
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Vendor status init error:", error);

//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// const statuses = [
//       { code: "PO_PENDING", label: "Customer uploaded PO" },
//       { code: "PO_REVIEWED", label: "PM reviewed" },
//       { code: "PO_SENT_TO_VENDOR", label: "PM reviewed" },
//       { code: "PO_REJECTED", label: "PM sent to vendor" },
//       { code: "PO_REVISED", label: "Customer revised PO" },
//     ];
// export async function POST() {
//   try {
//     await prisma.vendorAssignmentStatus.createMany({
//   data: [
//     { code: "NEW", label: "New" },
//     { code: "SUBMITTED", label: "Submitted" },
//     { code: "CANCELLED", label: "Cancelled" },
//   ],
// });

//     return NextResponse.json(
//       {
//         message: "Vendor statuses initialized successfully",
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Vendor status init error:", error);

//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// export async function POST() {
//   try {
//   const statuses= [
//       { code: "ORDER_PENDING", label: "Pending from Customer" },
//       { code: "ORDER_SUBMITTED", label: "Submitted by Customer" },
//       { code: "ORDER_CANCELLED", label: "Canelled" },
//       { code: "SENT_TO_VENDOR", label: "Order sent to Vendor" },
//       { code: "ORDER_SIGNED_BY_PM", label: "Signed by Project Manager" },
//       { code: "VENDOR_SIGNED", label: "Vendor signed order" },
//     ];
    

// const results = [];

//     for (const status of statuses) {
//       const created = await prisma.purchaseOrderStatus.upsert({
//         where: { code: status.code },
//         update: {
//           label: status.label,
//         },
//         create: {
//           code: status.code,
//           label: status.label,
//         },
//       });

//       results.push(created);
//     }

//     return NextResponse.json(
//       {
//         message: "Purchase order statuses initialized",
//         statuses: results,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Vendor status init error:", error);

//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// export async function POST() {
//   try {
//     const statuses = [
//       { code: "NEW", label: "New" },
//       { code: "SENT", label: "Sent to Customer" },
//       { code: "ACCEPTED", label: "Accepted" },
//       { code: "REJECTED", label: "Rejected" },
//     ];

//     for (const status of statuses) {
//       await prisma.customerQuoteStatus.upsert({
//         where: { code: status.code },
//         update: {}, // 🔒 immutable
//         create: status,
//       });
//     }

//     return NextResponse.json(
//       {
//         message: "customer quote statuses initialized successfully",
//         count: statuses.length,
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Vendor status init error:", error);

//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }


// export async function POST() {
//   try {
//   const statuses= [
//       { code: "ORDER_PENDING", label: "Pending from Customer" },
//       { code: "ORDER_SUBMITTED", label: "Submitted by Customer" },
//       { code: "ORDER_CANCELLED", label: "Canelled" },
//       { code: "SENT_TO_VENDOR", label: "Order sent to Vendor" },
//       { code: "ORDER_SIGNED_BY_PM", label: "Signed by Project Manager" },
//       { code: "VENDOR_SIGNED", label: "Vendor signed order" },
//     ];
    

// const results = [];

//     for (const status of statuses) {
//       const created = await prisma.purchaseOrderStatus.upsert({
//         where: { code: status.code },
//         update: {
//           label: status.label,
//         },
//         create: {
//           code: status.code,
//           label: status.label,
//         },
//       });

//       results.push(created);
//     }

//     return NextResponse.json(
//       {
//         message: "Purchase order statuses initialized",
//         statuses: results,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Vendor status init error:", error);

//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }


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


// export async function POST() {
//   try {
//     await prisma.vendorAssignmentStatus.createMany({
//   data: [
//     { code: "NEW", label: "New" },
//     { code: "SUBMITTED", label: "Submitted" },
//     { code: "CANCELLED", label: "Cancelled" },
//   ],
// });

//     return NextResponse.json(
//       {
//         message: "Vendor statuses initialized successfully",
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Vendor status init error:", error);

//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }


export async function POST() {
  try {
    

    // const deleted = await stripe.accounts.del('acct_1SiEosGj3GP6dpml');
    // console.log(deleted, 'deletedddd');
    
    // await resend.emails.send({
    //   from: `Support <${process.env.SENDER_EMAIL}>`,
    //   to: 'juloorisaikumar2821@gmail.com',
    //   subject: "Order Confirmation",
    //   react: ResetPasswordEmail({id: '13345566', company:'Aspen Groups', name:'Dhanush', email:'dk40828@gmail.com', createdAt: 2323323*1000, pricePaidInCents: 122344 }),
    // })

    // await resend.emails.send({
    //     from: `Support <${process.env.SENDER_EMAIL}>`,
    //     to: 'juloorisaikumar2821@gmail.com',
    //     subject: "Reset Password",
    //     react: ResetPasswordEmail({ name:'aspnnova.com', resetUrl:'Saikumar'}),
    // })
    // async function sendResetEmail(){
    // }

    return NextResponse.json(
      {
        message: "Email sent successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Vendor status init error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
// export async function POST() {
//   try {
//     await prisma.vendorQuoteStatus.createMany({
//   data: [
//     { code: "NEW", label: "New" },
//     { code: "MARK_IN_PROGRESS", label: "Mark in Progress" },
//     { code: "ACCEPTED", label: "Accepted" },
//     { code: "REJECTED", label: "Rejected" },
//   ],
// });

//     return NextResponse.json(
//       {
//         message: "Vendor quote statuses initialized successfully",
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Vendor status init error:", error);

//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
