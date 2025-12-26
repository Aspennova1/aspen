import Image from "next/image";
import millsImg from "@/assets/aspen7.jpg"; // use windmill image

export default function AspenMillsPage() {
  return (
    <>
      {/* HERO – CALM, INDUSTRIAL */}
      <section className="relative h-[520px]">
        <Image
          src={millsImg}
          alt="Aspen Mills infrastructure"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-[#0b2e2f]/60" />

        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-6xl mx-auto px-4 sm:px-8 text-white">
            <h1 className="text-4xl sm:text-5xl font-bold">
              Aspen Mills
            </h1>

            <p className="mt-6 max-w-2xl text-white/90 text-lg">
              Infrastructure and manufacturing-grade project delivery
              designed for scale, durability, and long-term performance.
            </p>

            <div className="mt-8">
              <span className="inline-block px-6 py-3 rounded-full bg-lime-400 text-black font-semibold">
                Built for Industry
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT WE DO – CLEAN, LINEAR */}
      <section className="py-20 bg-[#f8f6ee]">
        <div className="max-w-5xl mx-auto px-4 sm:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#003646]">
            Manufacturing & Infrastructure at Scale
          </h2>

          <p className="mt-8 text-gray-700 leading-relaxed text-lg">
            Aspen Mills operates and delivers manufacturing and infrastructure
            projects that support industrial supply chains, energy systems,
            and large-scale construction ecosystems.
          </p>

          <p className="mt-4 text-gray-700 leading-relaxed text-lg">
            Our focus is on reliability, throughput, and operational efficiency —
            ensuring facilities perform consistently under demanding conditions.
          </p>
        </div>
      </section>

      {/* CAPABILITIES – HORIZONTAL STRIP (UNIQUE) */}
      <section className="py-16 bg-white border-y">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
            {[
              {
                title: "Manufacturing Facilities",
                desc: "Design, development, and operation of industrial manufacturing units.",
              },
              {
                title: "Infrastructure Assets",
                desc: "Large-scale infrastructure supporting energy, logistics, and construction.",
              },
              {
                title: "Industrial Supply Chains",
                desc: "Processing and delivery of materials critical to project execution.",
              },
            ].map((item, idx) => (
              <div key={idx}>
                <h3 className="text-lg font-semibold text-[#003646]">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OPERATING PRINCIPLES – DATA-DRIVEN FEEL */}
      <section className="py-20 bg-[#f8f6ee]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold text-[#003646]">
              Operating Principles
            </h2>
            <p className="mt-6 text-gray-700 leading-relaxed">
              Aspen Mills follows disciplined operating principles that prioritize
              safety, performance, and long-term asset value.
            </p>
          </div>

          <div className="space-y-4">
            {[
              "Industrial-grade safety and compliance standards",
              "High-throughput, performance-driven operations",
              "Asset lifecycle management and durability",
              "Sustainability and energy efficiency integration",
              "Predictable output and operational reliability",
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 bg-white p-4 rounded-lg border shadow-sm"
              >
                <span className="mt-1 w-2 h-2 bg-lime-400 rounded-full" />
                <p className="text-gray-700 text-sm">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING – QUIET CONFIDENCE */}
      <section className="py-24 bg-[#004a5a]">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Infrastructure that performs. Manufacturing that endures.
          </h2>

          <p className="mt-6 text-white/90 leading-relaxed text-lg">
            Aspen Mills delivers the physical backbone required for modern
            infrastructure and industrial growth — engineered for longevity,
            efficiency, and scale.
          </p>
        </div>
      </section>
    </>
  );
}
