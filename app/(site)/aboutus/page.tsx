import Image from "next/image";
import section1 from "@/assets/section1.jpeg";
import section2 from "@/assets/section2.jpg";

export default function AboutPage() {
  return (
    <>
      {/* HERO / INTRO */}
      <section className="py-24 bg-[#003646]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 text-white">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
            About Aspen Group
          </h1>
          <p className="mt-6 text-lg text-white/90 max-w-3xl">
            Delivering engineering, infrastructure, and technology solutions
            through disciplined execution, strong partnerships, and measurable
            outcomes.
          </p>
        </div>
      </section>

      {/* ABOUT CONTENT */}
    <section className="py-24 bg-[#f8f6ee]">
      <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#003646] leading-tight">
          Built on trust.
          <br />
          Driven by execution.
        </h2>

        <p className="mt-8 text-gray-700 leading-relaxed text-lg">
          Aspen Group is a multidisciplinary organization delivering engineering,
          infrastructure, industrial, and technology-enabled solutions across
          complex project environments.
        </p>

        <p className="mt-4 text-gray-700 leading-relaxed text-lg">
          Our role extends beyond service delivery — we partner with our clients
          to bring structure, clarity, and discipline to projects where certainty
          matters most.
        </p>
      </div>
    </section>


      {/* EXECUTION & CAPABILITIES */}
      <section className="relative h-[520px]">
      <Image
        src={section1}
        alt="Aspen execution"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 text-white">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-bold">
              From planning to delivery.
            </h2>
            <p className="mt-6 text-white/90 leading-relaxed">
              We bring disciplined execution, strong governance, and technical
              expertise to every phase of the project lifecycle — ensuring safety,
              predictability, and long-term value.
            </p>
          </div>
        </div>
      </div>
    </section>


      {/* VALUES */}
      <section className="py-20 bg-[#f8f6ee]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <h2 className="text-3xl font-bold text-[#003646] mb-12">
            Our Core Values
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Integrity",
                desc: "We operate with transparency, accountability, and ethical responsibility.",
              },
              {
                title: "Safety",
                desc: "Safety is embedded into our culture, processes, and decision-making.",
              },
              {
                title: "Execution",
                desc: "We deliver what we commit through disciplined planning and ownership.",
              },
              {
                title: "Partnership",
                desc: "We succeed by working closely with clients and stakeholders.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl bg-white p-6 shadow-sm border"
              >
                <h3 className="font-semibold text-[#003646]">
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
    </>
  );
}
