import prisma from "@/lib/prisma";
import { getAuthUser } from "@/utils/auth";
import { notFound, redirect } from "next/navigation";
import PayoutConfirmCard from "./PayoutConfirmCard";

type Props = {
  params: { invoiceId: string };
};

export default async function PayOutVendor({ params }: Props) {
  const { invoiceId } = await params;

  // 1️⃣ Auth: PM / Admin
  const user = await getAuthUser([1, 2]);
  if (!user) redirect("/");

  // 2️⃣ Fetch invoice
  const invoice = await prisma.invoice.findUnique({
    where: { Id: invoiceId },
    include: {
      attachments: true,
      vendorPayouts: {
        orderBy: { createdAt: "desc" },
        take: 1, // 👈 only latest payout matters
      },
    },
  });

  if (!invoice) notFound();

  // 3️⃣ Validate vendor invoice
  if (invoice.issuedBy !== "VENDOR" || invoice.issuedTo !== "PM") {
    redirect("/unauthorized");
  }

  // 4️⃣ Extract latest payout (or null)
  const payout = invoice.vendorPayouts[0] ?? null;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-xl mx-auto">
        <PayoutConfirmCard
          invoice={invoice}
          payout={payout}
        />
      </div>
    </div>
  );
}
