import { Button } from "@/components/ui/button";
import HomeNavbar from "@/components/HomeNavbar";
import {SwiperComponent} from "@/components/Swiper";
import AboutSection from "@/components/AboutSection";
import IndustriesSection from "@/components/IndustriesSection";
import FooterSection from "@/components/Footer";

import Image from "next/image";
import Logo from '../assets/logo.png';
import { Camera } from "lucide-react";


export default function Home() {
  return (
    <main>
      <header
  className="bg-black h-20"
  // style={{
  //   background:
  //     "linear-gradient(180deg, rgba(0,0,0,0.4), transparent, rgba(0,54,70,0.8))",
  //     backgroundColor: "rgba(0, 54, 70, 0.6)",
  // }}
>
        <HomeNavbar />
      </header>
      <section
        className="relative w-full"
        style={{ height: "calc(100vh - 80px)"}}
      >

        <SwiperComponent />

      </section> 
  {/* Max width content overlay — optional */}
  <section id="aboutus" className="py-20 bg-[#f8f6ee]">
    <div className="max-w-6xl mx-auto px-4 sm:px-8">
      {/* your center content */}
      <AboutSection />
    </div>
  </section>
<section className="py-20 bg-[#f8f6ee]">
    <div className="max-w-6xl mx-auto px-4 sm:px-8">
      {/* your center content */}
      {/* <ImpactSection /> */}
    </div>
  </section>
  <section id="solutions" className="py-20 bg-[#f8f6ee]">
    <div className="max-w-6xl mx-auto px-4 sm:px-8">
      {/* your center content */}
      <IndustriesSection />
    </div>
  </section>
  <section className="bg-[#003646]">
  <div className="max-w-6xl mx-auto px-4 sm:px-8">
    <FooterSection />
  </div>
</section>
    </main>
  );
}
