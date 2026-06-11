import { Smartphone, Globe, Palette, Zap, Search, HeadphonesIcon } from 'lucide-react'
import SectionHeader from '@/components/ui/SectionHeader'
import AnimatedSection from '@/components/ui/AnimatedSection'

const services = [
  {
    icon: Smartphone,
    title: 'Mobile App Development',
    description:
      'Cross-platform iOS & Android apps built with React Native. Clean UI, smooth performance, and ready for the App Store and Google Play.',
    features: ['React Native', 'iOS & Android', 'App Store publishing', 'Push notifications'],
    color: 'from-blue-500 to-cyan-500',
    glow: 'group-hover:shadow-blue-500/20',
  },
  {
    icon: Globe,
    title: 'Website Development',
    description:
      'Modern, fast, and responsive websites. From landing pages to multi-page business sites — built to impress and convert.',
    features: ['Next.js & React', 'Responsive design', 'SEO optimized', 'Fast loading'],
    color: 'from-violet-500 to-purple-500',
    glow: 'group-hover:shadow-violet-500/20',
  },
  {
    icon: Palette,
    title: 'UI/UX Design',
    description:
      'Clean, modern interfaces that users actually enjoy. We design every screen with purpose — beautiful and functional.',
    features: ['Figma prototypes', 'Mobile-first design', 'Brand consistency', 'User-friendly layouts'],
    color: 'from-emerald-500 to-teal-500',
    glow: 'group-hover:shadow-emerald-500/20',
  },
  {
    icon: Search,
    title: 'SEO & Performance',
    description:
      'We build sites that rank. Fast load times, semantic HTML, meta tags, and structured data — optimized from day one.',
    features: ['On-page SEO', 'Core Web Vitals', 'Google Analytics setup', 'Sitemap & robots.txt'],
    color: 'from-orange-500 to-amber-500',
    glow: 'group-hover:shadow-orange-500/20',
  },
  {
    icon: Zap,
    title: 'Landing Pages',
    description:
      'High-converting landing pages for your product, service, or campaign. Built fast, looks sharp, performs great.',
    features: ['Quick turnaround', 'Conversion focused', 'Mobile optimized', 'Easy to update'],
    color: 'from-pink-500 to-rose-500',
    glow: 'group-hover:shadow-pink-500/20',
  },
  {
    icon: HeadphonesIcon,
    title: 'Support & Maintenance',
    description:
      'We don\'t disappear after launch. Bug fixes, updates, small improvements — we keep your product healthy and up to date.',
    features: ['Bug fixes', 'Content updates', 'Performance monitoring', 'Regular backups'],
    color: 'from-indigo-500 to-blue-500',
    glow: 'group-hover:shadow-indigo-500/20',
  },
]

export default function Services() {
  return (
    <section id="services" className="section-padding bg-muted/20">
      <div className="container-custom">
        <SectionHeader
          eyebrow="What We Do"
          title="Services Built for"
          titleHighlight="Modern Businesses"
          description="Mobile apps and websites built with care, clean code, and attention to detail. Every project gets my full focus from start to finish."
          className="mb-16"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => {
            const Icon = service.icon
            return (
              <AnimatedSection key={service.title} delay={i * 0.08}>
                <div
                  className={`group relative h-full p-6 rounded-2xl border border-border bg-card hover:border-zinc-600/60 dark:hover:border-zinc-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${service.glow}`}
                >
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-5 shadow-lg`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>

                  <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                    {service.description}
                  </p>

                  <ul className="space-y-1.5">
                    {service.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className={`w-1 h-1 rounded-full bg-gradient-to-r ${service.color}`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            )
          })}
        </div>
      </div>
    </section>
  )
}
