import Image from "next/image";
import aspen3 from '@/assets/section3.jpg'; // use the same image as the card

export default function ImpactPage() {
  return (
    <>
      {/* HERO */}
      <section className="py-24 bg-[#f8f6ee]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Image */}
          <div className="relative w-full h-72 sm:h-96 lg:h-[420px]">
            <Image
              src={aspen3}
              alt="Impact and future-ready systems"
              fill
              className="rounded-2xl object-cover shadow-md"
              priority
            />
          </div>

          {/* Text */}
          <div className="max-w-xl">
            <h1 className="text-3xl sm:text-4xl font-bold leading-tight text-[#003646]">
              Impact & Future-Ready.
              <br />
              <span className="text-[#003646]">
                Building reliable systems for
              </span>
              <br />
              <span className="text-[#003646]">
                tomorrow.
              </span>
            </h1>

            <p className="mt-6 text-gray-700 leading-relaxed">
              Aspen Group designs and delivers solutions that are scalable,
              compliant, and built for long-term performance. We integrate
              engineering best practices with modern technology to support
              sustainable infrastructure and operational resilience.
            </p>

            <p className="mt-4 text-gray-700 leading-relaxed">
              Our focus is not only on delivery, but on creating systems that
              evolve with changing business needs, regulatory environments,
              and technological advancements.
            </p>
          </div>
        </div>
      </section>

      {/* IMPACT AREAS */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <h2 className="text-3xl font-bold text-[#003646] mb-12">
            How We Create Impact
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Sustainable Design",
                desc: "Solutions engineered to minimize environmental impact while maximizing performance and efficiency.",
              },
              {
                title: "Future-Ready Systems",
                desc: "Platforms and infrastructure designed to adapt to evolving technology and regulatory demands.",
              },
              {
                title: "Operational Reliability",
                desc: "Strong execution models that ensure uptime, safety, and predictable outcomes.",
              },
              {
                title: "Long-Term Value",
                desc: "Systems built to last, scale, and support business growth over time.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl border bg-[#f8f6ee] p-6 shadow-sm"
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

      {/* COMMITMENT */}
      <section className="py-20 bg-[#003646]">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Our Commitment to the Future
          </h2>

          <p className="mt-6 text-white/90 leading-relaxed text-lg">
            Our commitment goes beyond delivery. We help customers build
            systems that last, adapt, and grow with their organizations—
            enabling resilience, sustainability, and long-term success.
          </p>
        </div>
      </section>
    </>
  );
}
