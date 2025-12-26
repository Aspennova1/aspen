import Image from "next/image";
// import fireImg from "@/assets/fire-safety.jpg"; // use the same slider image
import fireImg from "@/assets/aspen6.jpg";

export default function FireSafetyPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative h-[570px]">
        <Image
          src={fireImg}
          alt="Aspen Fire & Safety"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/55" />

        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-6xl mx-auto px-4 sm:px-8 text-white">
            <h1 className="text-4xl sm:text-5xl font-bold max-w-2xl">
              Aspen Fire & Safety
            </h1>

            <p className="mt-6 max-w-2xl text-white/90 text-lg">
              Fire, safety, and protection systems engineered for reliability,
              compliance, and operational readiness.
            </p>

            <div className="mt-8">
              <span className="inline-block px-6 py-3 rounded-full bg-lime-400 text-black font-semibold">
                Safety Without Compromise
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO – NO GRID */}
      <section className="py-20 bg-[#f8f6ee]">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#003646]">
            Protection systems you can depend on
          </h2>

          <p className="mt-8 text-gray-700 leading-relaxed text-lg">
            Aspen Fire & Safety delivers engineered fire protection, detection,
            and life safety systems for commercial, industrial, and
            infrastructure environments.
          </p>

          <p className="mt-4 text-gray-700 leading-relaxed text-lg">
            Our solutions are designed to meet stringent regulatory standards
            while ensuring rapid response, operational continuity, and
            long-term reliability.
          </p>
        </div>
      </section>

      {/* SERVICE AREAS – OPERATIONAL FEEL */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <h2 className="text-3xl font-bold text-[#003646] mb-12">
            Our Fire & Safety Capabilities
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Fire Detection Systems",
                desc: "Advanced detection solutions including smoke, heat, and gas detection systems.",
              },
              {
                title: "Fire Suppression",
                desc: "Sprinkler, foam, gaseous, and specialized suppression systems engineered for site-specific risks.",
              },
              {
                title: "Life Safety Systems",
                desc: "Emergency alarms, evacuation systems, and occupant safety solutions.",
              },
              {
                title: "Compliance & Audits",
                desc: "Regulatory compliance, inspections, and fire safety audits.",
              },
              {
                title: "System Integration",
                desc: "Integrated fire, safety, and building management systems.",
              },
              {
                title: "Operations & Maintenance",
                desc: "Preventive maintenance, testing, and long-term system support.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl border bg-[#f8f6ee] p-6 shadow-sm"
              >
                <h3 className="font-semibold text-[#003646] text-lg">
                  {item.title}
                </h3>
                <p className="mt-3 text-gray-600 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SAFETY COMMITMENT – STRONG CLOSE */}
      <section className="py-24 bg-[#004a5a]">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Engineered for safety. Trusted in critical environments.
          </h2>

          <p className="mt-6 text-white/90 leading-relaxed text-lg">
            Safety is not optional. Our fire and life safety systems are designed,
            installed, and maintained with precision, accountability, and
            unwavering commitment to protection.
          </p>
        </div>
      </section>
    </>
  );
}
