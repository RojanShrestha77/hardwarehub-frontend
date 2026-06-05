import Link from "next/link";
import { Cpu, Mail, Phone, MapPin } from "lucide-react";

const GithubIcon = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

const XIcon = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.766l7.74-8.835L2.376 2.25H8.53l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const FacebookIcon = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const FOOTER_LINKS = {
  Products: [
    { label: "Graphics Cards (GPU)", href: "/products?category=GPU" },
    { label: "Processors (CPU)",     href: "/products?category=CPU" },
    { label: "Memory (RAM)",         href: "/products?category=RAM" },
    { label: "Storage (SSD/HDD)",    href: "/products?category=Storage" },
    { label: "Motherboards",         href: "/products?category=Motherboard" },
    { label: "Power Supplies",       href: "/products?category=PSU" },
  ],
  Support: [
    { label: "FAQ",              href: "/faq" },
    { label: "Warranty Policy",  href: "/warranty" },
    { label: "Return Policy",    href: "/returns" },
    { label: "Track Order",      href: "/orders" },
    { label: "Contact Us",       href: "/contact" },
  ],
  Company: [
    { label: "About HardwareHub", href: "/about" },
    { label: "Careers",           href: "/careers" },
    { label: "Privacy Policy",    href: "/privacy" },
    { label: "Terms of Service",  href: "/terms" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-surface border-t border-border mt-auto" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 group mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-md bg-accent group-hover:bg-accent-hover transition-colors">
                <Cpu size={18} className="text-white" />
              </span>
              <span className="font-bold text-lg">
                Hardware<span className="text-accent">Hub</span>
              </span>
            </Link>
            <p className="text-sm text-muted leading-relaxed max-w-xs mb-6">
              Nepal&apos;s premier destination for PC components, peripherals, and hardware. Quality products, expert advice, fast delivery.
            </p>
            <div className="space-y-2 text-sm text-muted">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-accent shrink-0" />
                <span>Newroad, Kathmandu, Nepal</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-accent shrink-0" />
                <a href="tel:+977-1-XXXXXXX" className="hover:text-white transition-colors">+977-1-XXXXXXX</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-accent shrink-0" />
                <a href="mailto:hello@hardwarehub.np" className="hover:text-white transition-colors">hello@hardwarehub.np</a>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6">
              {[
                { icon: GithubIcon,   href: "#", label: "GitHub"   },
                { icon: XIcon,        href: "#", label: "Twitter"  },
                { icon: FacebookIcon, href: "#", label: "Facebook" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 flex items-center justify-center rounded-md bg-[#0a0a0a] border border-border text-muted hover:text-accent hover:border-accent transition-colors"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-white mb-4">{title}</h3>
              <ul className="space-y-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-muted hover:text-accent transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted">
          <p>© {new Date().getFullYear()} HardwareHub. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>🔒 Secure Checkout</span>
            <span>🚚 Free Delivery over Rs. 5000</span>
            <span>↩ 15-Day Returns</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
