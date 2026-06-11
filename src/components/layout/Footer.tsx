'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Moon, ArrowUpRight } from 'lucide-react'

const footerLinks = {
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Contact', href: '/contact' },
  ],
  Services: [
    { label: 'Mobile Apps', href: '/about#services' },
    { label: 'Website Development', href: '/about#services' },
    { label: 'UI/UX Design', href: '/about#services' },
    { label: 'Support & Maintenance', href: '/about#services' },
  ],
}


export default function Footer() {
  const pathname = usePathname()
  if (pathname.startsWith('/admin')) return null

  return (
    <footer className="border-t border-border bg-card">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4 group w-fit">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                <Moon className="w-4 h-4 text-white" fill="currentColor" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-heading font-bold text-base text-foreground">Strongmoon</span>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Labs</span>
              </div>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mb-6">
              We build modern websites and mobile apps that help businesses grow. Clean design, solid code, real results.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-heading font-semibold text-sm text-foreground mb-4 uppercase tracking-wider">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 group"
                    >
                      {label}
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Strongmoon Labs. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="mailto:hello@strongmoonlabs.com" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              hello@strongmoonlabs.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
