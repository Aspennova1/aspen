import Image from "next/image";
import section2 from "@/assets/section2.jpg";

export default function SolutionsPage() {
  return (
    <>
      {/* HERO */}
      <section className="py-24 bg-[#003646]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 text-white">
          <h1 className="text-4xl sm:text-5xl font-bold">
            Our Solutions
          </h1>
          <p className="mt-6 text-lg text-white/90 max-w-3xl">
            Integrated solutions designed to manage complexity, reduce risk,
            and deliver predictable outcomes across engineering, construction,
            and industrial environments.
          </p>
        </div>
      </section>

      {/* INTRO – CENTERED, NO GRID */}
      <section className="py-20 bg-[#f8f6ee]">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#003646]">
            Solutions built for execution
          </h2>
          <p className="mt-8 text-gray-700 leading-relaxed text-lg">
            Aspen Group delivers structured, execution-focused solutions across
            the full project lifecycle. Our offerings combine engineering
            expertise, disciplined project controls, and on-site delivery
            capability.
          </p>
        </div>
      </section>

      {/* SOLUTION CATEGORIES – CARD LED */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <h2 className="text-3xl font-bold text-[#003646] mb-12">
            Our Core Solution Areas
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "EPC & EPCM Delivery",
                desc: "End-to-end engineering, procurement, and construction services with strong governance and cost control.",
              },
              {
                title: "Industrial Services",
                desc: "Execution-focused industrial support including maintenance, shutdowns, and site operations.",
              },
              {
                title: "Fire & Safety Systems",
                desc: "Fire protection, safety compliance, and risk mitigation services for industrial and commercial environments.",
              },
              {
                title: "Project Controls",
                desc: "Scheduling, cost management, procurement tracking, and reporting to improve predictability.",
              },
              {
                title: "Digital Project Platforms",
                desc: "Technology solutions for RFQs, vendor management, approvals, and workflow automation.",
              },
              {
                title: "Operations Support",
                desc: "Post-project support, O&M services, and performance optimization.",
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

      {/* FULL-WIDTH VISUAL BREAK */}
      <section className="relative h-[460px]">
        <Image
          src={section2}
          alt="Aspen solutions execution"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-6xl mx-auto px-4 sm:px-8 text-white">
            <h2 className="text-3xl sm:text-4xl font-bold max-w-2xl">
              Solutions that scale from planning to operations
            </h2>
            <p className="mt-6 max-w-2xl text-white/90 leading-relaxed">
              Our solutions are designed to adapt across industries, project
              sizes, and delivery models — ensuring clarity, control, and
              accountability at every stage.
            </p>
          </div>
        </div>
      </section>

      {/* DELIVERY MODEL – LIST LED */}
      <section className="py-20 bg-[#f8f6ee]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold text-[#003646]">
              Our Delivery Model
            </h2>
            <p className="mt-6 text-gray-700 leading-relaxed">
              Aspen Group follows a disciplined delivery model designed to
              reduce uncertainty and improve execution performance across
              complex projects.
            </p>
          </div>

          <div className="space-y-4">
            {[
              "Clear scope definition and governance",
              "Integrated engineering and procurement",
              "Strong on-site execution leadership",
              "Real-time reporting and controls",
              "Safety-first operational culture",
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 bg-white p-4 rounded-lg border shadow-sm"
              >
                <span className="mt-1 w-2 h-2 bg-blue-400 rounded-full" />
                <p className="text-gray-700 text-sm">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
