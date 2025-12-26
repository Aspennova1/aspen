import Image from "next/image";
// import cityImg from "@/assets/future-city.jpg"; 
import cityImg from "@/assets/section2.jpg";// use the same skyline image

export default function FuturePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative h-[570px]">
        <Image
          src={cityImg}
          alt="Aspen Group innovation"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-6xl mx-auto px-4 sm:px-8 text-white">
            <h1 className="text-4xl sm:text-5xl font-bold max-w-2xl">
              Delivering innovation
              <br />
              for the future.
            </h1>

            <p className="mt-6 max-w-2xl text-white/90 text-lg">
              Aspen Group builds future-ready systems by integrating engineering
              discipline, digital platforms, and execution excellence.
            </p>

            <div className="mt-8">
              <span className="inline-block px-6 py-3 rounded-full bg-lime-400 text-black font-semibold">
                Future-Ready by Design
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO – CENTERED */}
      <section className="py-20 bg-[#f8f6ee]">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#003646]">
            Engineering tomorrow’s systems today
          </h2>

          <p className="mt-8 text-gray-700 leading-relaxed text-lg">
            We design and deliver solutions that are scalable, compliant, and
            built to evolve. Our approach combines proven engineering practices
            with modern technology to help organizations adapt and grow.
          </p>
        </div>
      </section>

      {/* PILLAR STRIP – VERY DIFFERENT FROM OTHER PAGES */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: "Innovation with Purpose",
                desc: "Technology applied with clarity, intent, and measurable outcomes.",
              },
              {
                title: "Scalable Architecture",
                desc: "Systems designed to grow with operational and regulatory demands.",
              },
              {
                title: "Execution Discipline",
                desc: "Innovation grounded in reliable delivery and governance.",
              },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="mx-auto w-14 h-14 rounded-full bg-lime-400 flex items-center justify-center font-bold text-black text-xl">
                  {idx + 1}
                </div>
                <h3 className="mt-6 font-semibold text-[#003646] text-lg">
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

      {/* FUTURE COMMITMENT – STRONG BRAND SECTION */}
      <section className="py-24 bg-[#004a5a]">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Built for what’s next
          </h2>

          <p className="mt-6 text-white/90 leading-relaxed text-lg">
            Our commitment goes beyond today’s delivery. We help customers
            build systems that last, adapt, and remain resilient in a rapidly
            changing world.
          </p>

          <div className="mt-10">
            <span className="inline-block px-8 py-4 rounded-full bg-lime-400 text-black font-semibold">
              Aspen Group · Future Ready
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
