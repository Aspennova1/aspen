import section1 from '@/assets/section1.jpeg'
import section2 from '@/assets/section2.jpg'
import aspen3 from '@/assets/section3.jpg';
import Image from 'next/image'
import Link from 'next/link'

export default function AboutSection() {
  return (
    <>
      {/* SECTION 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-0">
        {/* Image */}
        <div className="relative w-full h-72 sm:h-96 lg:h-full lg:min-h-[420px]">
          <Image
            src={section1}
            alt="About"
            fill
            className="rounded-xl shadow-md object-cover"
            priority
          />
        </div>

        {/* Text */}
        <div className="flex flex-col justify-center max-w-xl">
          <h2 className="text-3xl sm:text-4xl font-bold leading-tight text-[#003646]">
            Partnering with customers.
            <br />
            <span className="text-[#003646]">Delivering projects and</span>
            <br />
            <span className="text-[#003646]">creating value.</span>
          </h2>

          <p className="mt-6 text-gray-700 leading-relaxed">
            Aspen Group is a forward-thinking services organization focused on
            engineering, technology, and infrastructure delivery. We work as an
            extension of our customers’ teams to understand objectives, reduce
            risk, and ensure successful outcomes.
          </p>

          <p className="mt-4 text-gray-700 leading-relaxed">
            Our approach is built on collaboration, transparency, and execution
            excellence—helping clients move confidently from planning to
            delivery.
          </p>

          {/* <Link href={'/about'}>
            <button className="mt-8 w-fit px-6 py-3 bg-blue-400 rounded-full text-black font-semibold hover:bg-blue-500 transition shadow">
              Read more
            </button>
          </Link> */}
        </div>
      </div>

      {/* SECTION 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-stretch mt-20">
        {/* Text */}
        <div className="flex flex-col justify-center max-w-xl">
          <h2 className="text-3xl sm:text-4xl font-bold leading-tight text-[#003646]">
            Execution & Capabilities.
            <br />
            <span className="text-[#003646]">
              From planning to execution. Built to perform.
            </span>
          </h2>

          <p className="mt-6 text-gray-700 leading-relaxed">
            Aspen Group delivers end-to-end solutions across EPC, industrial
            services, fire & safety systems, and technology-enabled project
            delivery. We combine technical expertise with structured processes
            to manage complexity and control costs.
          </p>

          <p className="mt-4 text-gray-700 leading-relaxed">
            Every project is executed with a focus on safety, quality, and
            schedule reliability—ensuring predictable and measurable results.
          </p>

          {/* <button className="mt-8 w-fit px-6 py-3 bg-blue-400 rounded-full text-black font-semibold hover:bg-blue-500 transition shadow">
            About us
          </button> */}
        </div>

        {/* Image */}
        <div className="relative w-full h-72 sm:h-96 lg:h-full lg:min-h-[420px]">
          <Image
            src={section2}
            alt="About"
            fill
            className="rounded-xl shadow-md object-cover"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-20">

      {/* Image */}
      <div>
        <Image
          src={aspen3}
          alt="About"
          className="rounded-xl shadow-md w-full object-cover"
        />
      </div>

      {/* Text */}
      <div>
        <h2 className="text-3xl sm:text-4xl font-bold leading-tight text-[#003646]">
          Impact & Future-Ready.
          <br />
          <span className="text-[#003646]">Building reliable systems for tomorrow.</span>
          <br />
          
        </h2>

        <p className="mt-6 text-gray-700 leading-relaxed">
          We design and deliver solutions that are scalable, compliant, and future-ready. Aspen Group integrates engineering best practices with modern technology to support sustainable infrastructure and long-term operational success.
        </p>

        <p className="mt-4 text-gray-700 leading-relaxed">
          Our commitment goes beyond delivery—we help customers build systems that last, adapt, and grow with their business.
        </p>

      <Link href={'/impact'}>
        <button className="mt-8 px-6 py-3 bg-blue-400 rounded-full text-black font-semibold hover:bg-blue-500 transition shadow">
          Read more
        </button>
      </Link>
      </div>

    </div>
    </>
  )
}
