import Image from "next/image";
import Link from "next/link";

import Logo1 from "../assets/conventional.jpg";
import epc from "../assets/epc.jpg";
import industrial from "../assets/industrial.jpg";
import highriser from "../assets/highriser infinity.jpg";
import fire from "../assets/aspen6.jpg";
import insurance from "../assets/insurance.jpg";

export default function IndustriesSection() {
  const industries = [
    {
      title: "Aspen EPC",
      slug: "aspen-epc",
      desc: "Aspen EPC delivers structured EPC and EPCM support for industrial, commercial, and infrastructure projects with strong focus on cost control, procurement efficiency, and execution reliability.",
      img: epc,
    },
    {
      title: "Aspen Industrial Solutions",
      slug: "aspen-industrial-solutions",
      desc: "Aspen Industrial Solutions supports industrial projects through execution-focused services that bridge engineering, procurement, and on-site operations.",
      img: industrial,
    },
    {
      title: "Aspen Developer",
      slug: "aspen-developer",
      desc: "Aspen Developer builds modern digital platforms for RFQs, vendor management, approvals, dashboards, and workflow automation across the Aspen ecosystem.",
      img: Logo1,
    },
    {
      title: "Aspen Fire & Safety",
      slug: "aspen-fire-safety",
      desc: "Aspen Fire & Safety provides safety, compliance, and risk mitigation services for construction, industrial, and infrastructure environments.",
      img: fire,
    },
    {
      title: "Aspen Mills",
      slug: "aspen-mills",
      desc: "Aspen Mills operates manufacturing and processing facilities supporting construction and industrial supply chains, including prefab, aggregates, and material processing.",
      img: Logo1,
    },
    {
      title: "Alexandria Infinity Tower",
      slug: "alexandria-infinity-tower",
      desc: "Alexandria Infinity Tower is a flagship development project under Aspen Group, focused on premium commercial and mixed-use infrastructure development.",
      img: highriser,
    },
    {
      title: "Aspen Insurance Services",
      slug: "aspen-insurance-services",
      desc: "Aspen Insurance Services supports project risk management through insurance coordination, compliance documentation, and asset coverage services.",
      img: insurance,
    },
  ];

  return (
    <div>
      {/* Heading */}
      <h2 className="text-start text-3xl sm:text-4xl font-bold mb-12 text-[#003646]">
        The <span className="text-[#003646]">industries</span> we operate in
      </h2>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {industries.map((item, idx) => (
          <Link
            key={idx}
            href={`/companies/${item.slug}`}
            className="relative rounded-2xl overflow-hidden shadow-lg h-72 group block"
          >
            {/* Background Image */}
            <Image
              src={item.img}
              alt={item.title}
              fill
              className="object-cover group-hover:scale-105 transition duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              priority={idx < 2}
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Content */}
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <p className="text-sm mt-2 opacity-90 line-clamp-4">{item.desc}</p>
              <span className="text-lime-300 text-sm font-medium mt-3 inline-block">
                Read more →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
