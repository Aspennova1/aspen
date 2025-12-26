import { Facebook, Linkedin, Twitter, Youtube, Instagram } from "lucide-react";

export default function FooterSection() {
  return (
    <footer className="py-16 text-white">

      {/* Top Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

        {/* Brand Column */}
        <div>
          <h2 className="text-2xl font-bold">Aspen Group</h2>
          <p className="mt-4 text-sm opacity-80 leading-relaxed">
            Transforming industries with engineering, technology, and sustainable solutions.
          </p>

          {/* Social Icons */}
          <div className="flex gap-4 mt-6">

            {/* Instagram */}
            <a
              href="https://www.instagram.com/aspennova4/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="AspenNova Instagram"
              className="hover:text-lime-300 transition"
            >
              <Instagram className="w-5 h-5 cursor-pointer" />
            </a>

            {/* Facebook */}
            <a
              href="https://www.facebook.com/profile.php?id=61584988333328"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="AspenNova Facebook"
              className="hover:text-lime-300 transition"
            >
              <Facebook className="w-5 h-5 cursor-pointer" />
            </a>

            {/* X / Twitter */}
            <a
              href="https://x.com/aspennova76896"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="AspenNova X (Twitter)"
              className="hover:text-lime-300 transition"
            >
              <Twitter className="w-5 h-5 cursor-pointer" />
            </a>
             <a
              href="https://www.youtube.com/@AspenNova"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Aspen Group YouTube"
            >
              <Youtube className="w-5 h-5 cursor-pointer hover:text-lime-300 transition" />
            </a>

          </div>
        </div>


        {/* Links */}
        <div>
          <h4 className="font-semibold text-lg mb-4">Solutions</h4>
          <ul className="space-y-2 text-sm opacity-90">
            <li>Engineering</li>
            <li>Low Carbon Energy</li>
            <li>Chemicals & Fuels</li>
            <li>Resources</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-lg mb-4">Company</h4>
          <ul className="space-y-2 text-sm opacity-90">
            <li>
              <a href="/aboutus">About us</a>
            </li>
            <li>Leadership</li>
            <li>Careers</li>
            <li>News & Media</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-lg mb-4">Resources</h4>
          <ul className="space-y-2 text-sm opacity-90">
            <li>Contact</li>
            <li>Privacy policy</li>
            <li>Terms of service</li>
            <li>Support</li>
          </ul>
        </div>

      </div>

      {/* Divider */}
      <div className="h-px bg-white/20 my-10"></div>

      {/* Bottom */}
      <p className="text-sm text-center opacity-70">
        © {new Date().getFullYear()} Aspen Group. All rights reserved.
      </p>
    </footer>
  );
}
