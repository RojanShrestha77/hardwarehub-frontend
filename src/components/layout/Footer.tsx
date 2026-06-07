"use client";

import Link from "next/link";
import { Wrench, Mail } from "lucide-react";

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

export function Footer() {
  return (
    <footer className="bg-[#0d0d0d] border-t border-[#1a1a1a]" role="contentinfo">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2 mb-5">
              <div className="flex items-center justify-center w-8 h-8 bg-accent">
                <Wrench size={16} className="text-white" />
              </div>
              <span className="font-black text-base uppercase tracking-wide text-white">
                HardwareHub
              </span>
            </Link>
            <p className="text-[#666] text-sm leading-relaxed max-w-xs">
              Industrial supply chain for the modern trade professional. Quality, reliability, and precision delivered to your site.
            </p>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white mb-5">Support</h3>
            <ul className="space-y-3">
              {[
                { label: "Warranty",          href: "/warranty" },
                { label: "Technical Support", href: "/contact"  },
                { label: "Shipping Policy",   href: "/shipping" },
                { label: "Tool Rentals",      href: "/rentals"  },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-[#666] hover:text-accent transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white mb-5">Connect</h3>
            <div className="flex items-center gap-3 mb-5">
              {[
                { icon: GithubIcon,   href: "#", label: "GitHub"   },
                { icon: XIcon,        href: "#", label: "Twitter"  },
                { icon: FacebookIcon, href: "#", label: "Facebook" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 flex items-center justify-center bg-[#1a1a1a] border border-[#2a2a2a] text-[#666] hover:text-accent hover:border-accent transition-colors"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
            <p className="text-[#666] text-xs leading-relaxed mb-3">
              Subscribe for technical bulletins and trade offers.
            </p>
            <form className="flex" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Email"
                className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] text-white text-sm px-3 py-2 outline-none focus:border-accent placeholder:text-[#444] min-w-0"
              />
              <button
                type="submit"
                className="bg-accent hover:bg-accent-hover px-3 py-2 text-white transition-colors"
                aria-label="Subscribe"
              >
                <Mail size={14} />
              </button>
            </form>
          </div>

          {/* Headquarters */}
          <div>
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white mb-5">Headquarters</h3>
            <div className="space-y-2 text-sm text-[#666]">
              <p>Newroad, Kathmandu</p>
              <p>Nepal 44600</p>
              <p className="pt-2">
                <a href="tel:+977-1-4000000" className="hover:text-accent transition-colors">
                  +977-1-4000000
                </a>
              </p>
              <p>
                <a href="mailto:hello@hardwarehub.np" className="hover:text-accent transition-colors">
                  hello@hardwarehub.np
                </a>
              </p>
            </div>
          </div>

        </div>
      </div>

      <div className="border-t border-[#1a1a1a]">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center">
          <p className="text-[11px] uppercase tracking-[0.15em] text-[#444] font-semibold">
            © {new Date().getFullYear()} HardwareHub Industrial Supply. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

