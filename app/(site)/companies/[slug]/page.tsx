import Image from "next/image";
import { notFound } from "next/navigation";

import epc from "@/assets/epc.jpg";
import industrial from "@/assets/industrial.jpg";
import fire from "@/assets/aspen6.jpg";
import highriser from "@/assets/highriser infinity.jpg";
import insurance from "@/assets/insurance.jpg";
import Logo1 from "@/assets/conventional.jpg";

const companies = {
  "aspen-epc": {
    title: "Aspen EPC",
    desc: "Aspen EPC delivers structured EPC and EPCM support for industrial, commercial, and infrastructure projects with strong focus on cost control, procurement efficiency, and execution reliability.",
    img: epc,
  },
  "aspen-industrial-solutions": {
    title: "Aspen Industrial Solutions",
    desc: "Aspen Industrial Solutions supports industrial projects through execution-focused services that bridge engineering, procurement, and on-site operations.",
    img: industrial,
  },
  "aspen-developer": {
    title: "Aspen Developer",
    desc: "Aspen Developer builds modern digital platforms for RFQs, vendor management, approvals, dashboards, and workflow automation across the Aspen ecosystem.",
    img: Logo1,
  },
  "aspen-fire-safety": {
    title: "Aspen Fire & Safety",
    desc: "Aspen Fire & Safety provides safety, compliance, and risk mitigation services for construction, industrial, and infrastructure environments.",
    img: fire,
  },
  "aspen-mills": {
    title: "Aspen Mills",
    desc: "Aspen Mills operates manufacturing and processing facilities supporting construction and industrial supply chains, including prefab, aggregates, and material processing.",
    img: Logo1,
  },
  "alexandria-infinity-tower": {
    title: "Alexandria Infinity Tower",
    desc: "Alexandria Infinity Tower is a flagship development project under Aspen Group, focused on premium commercial and mixed-use infrastructure development.",
    img: highriser,
  },
  "aspen-insurance-services": {
    title: "Aspen Insurance Services",
    desc: "Aspen Insurance Services supports project risk management through insurance coordination, compliance documentation, and asset coverage services.",
    img: insurance,
  },
};

type Props = {
  params: { slug: string };
};

export default async function CompanyPage({ params }: Props) {
  const {slug} = await params;
  const company = companies[slug as keyof typeof companies];

  if (!company) notFound();

  return (
    <section className="py-20 bg-[#f8f6ee]">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Image */}
        <div className="relative w-full h-80 lg:h-[420px]">
          <Image
            src={company.img}
            alt={company.title}
            fill
            className="rounded-xl object-cover shadow-md"
            priority
          />
        </div>

        {/* Content */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#003646]">
            {company.title}
          </h1>

          <p className="mt-6 text-gray-700 leading-relaxed">
            {company.desc}
          </p>
        </div>
      </div>
    </section>
  );
}
