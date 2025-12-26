import AboutSection from "@/components/AboutSection";
import IndustriesSection from "@/components/IndustriesSection";
import { SwiperComponent } from "@/components/Swiper";

export default function Home() {
  return (
    <>
      <section
        className="relative w-full"
        style={{ height: "calc(100vh - 80px)" }}
      >
        <SwiperComponent />
      </section>

      <section id="aboutus" className="py-20 bg-[#f8f6ee]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <AboutSection />
        </div>
      </section>

      <section id="solutions" className="py-20 bg-[#f8f6ee]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <IndustriesSection />
        </div>
      </section>
    </>
  );
}
