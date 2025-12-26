import HomeNavbar from "@/components/HomeNavbar";
import FooterSection from "@/components/Footer";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="bg-black h-20">
        <HomeNavbar />
      </header>

      <main>{children}</main>

      <footer className="bg-[#003646]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <FooterSection />
        </div>
      </footer>
    </>
  );
}
