'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Moon, Mail, Github, Twitter, Linkedin, ArrowUpRight } from 'lucide-react'

const footerLinks = {
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Contact', href: '/contact' },
  ],
  Services: [
    { label: 'Mobile Apps', href: '/about#services' },
    { label: 'Web Development', href: '/about#services' },
    { label: 'SaaS Products', href: '/about#services' },
    { label: 'AI Solutions', href: '/about#services' },
  ],
}

const socialLinks = [
  { icon: Github, href: 'https://github.com/strongmoonlabs', label: 'GitHub' },
  { icon: Twitter, href: 'https://twitter.com/strongmoonlabs', label: 'Twitter' },
  { icon: Linkedin, href: 'https://linkedin.com/company/strongmoonlabs', label: 'LinkedIn' },
  { icon: Mail, href: 'mailto:hello@strongmoonlabs.com', label: 'Email' },
]

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
              We build exceptional digital products — mobile apps, web platforms, SaaS, and AI-powered solutions that drive real business results.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-blue-500/50 hover:bg-blue-500/5 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
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
