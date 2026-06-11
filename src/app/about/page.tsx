import type { Metadata } from 'next'
import { Target, Eye, Heart } from 'lucide-react'
import SectionHeader from '@/components/ui/SectionHeader'
import AnimatedSection from '@/components/ui/AnimatedSection'
import TechStack from '@/components/sections/TechStack'
import Process from '@/components/sections/Process'
import CTA from '@/components/sections/CTA'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about Strongmoon Labs — our story, mission, values, and the team behind the code.',
}

const values = [
  {
    icon: Target,
    title: 'Our Mission',
    description:
      'To empower businesses of all sizes with world-class software that drives growth, efficiency, and competitive advantage. We believe great software should be accessible — not just to enterprise giants, but to every ambitious team.',
    gradient: 'from-blue-500 to-indigo-500',
  },
  {
    icon: Eye,
    title: 'Our Vision',
    description:
      'A world where every great idea gets the technical execution it deserves. We envision becoming the trusted technology partner that grows alongside our clients — from startup MVP to global-scale platform.',
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    icon: Heart,
    title: 'Our Values',
    description:
      'Transparency over theatrics. Quality over quantity. Long-term partnerships over one-off transactions. We care deeply about the impact our work has on real people — users, clients, and the communities they serve.',
    gradient: 'from-emerald-500 to-teal-500',
  },
]

const timeline = [
  {
    year: '2026',
    title: 'The Beginning',
    description:
      'Strongmoon Labs was founded with one clear goal: build high-quality digital products that actually deliver results. Started as a small but focused team with a passion for clean code and great design.',
  },
  {
    year: '2026',
    title: 'First Projects',
    description:
      'Took on our first client projects — mobile apps and web platforms. Learned fast, shipped clean, and built a reputation for reliability and attention to detail.',
  },
  {
    year: '2026+',
    title: 'Growing Forward',
    description:
      'Expanding our services into SaaS, AI-powered solutions, and business automation. Every project is a chance to raise the bar. The journey is just getting started.',
  },
]

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 section-padding">
        <div className="container-custom">
          <div className="max-w-3xl">
            <AnimatedSection>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-4">
                About Us
              </span>
            </AnimatedSection>
            <AnimatedSection delay={0.05}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-heading tracking-tight mb-6">
                We build software that <span className="gradient-text">matters</span>
              </h1>
            </AnimatedSection>
            <AnimatedSection delay={0.1}>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                Strongmoon Labs is a young software development studio focused on building
                modern websites and mobile apps. We care about clean code, great design,
                and delivering products that actually work — on time and on budget.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="section-padding bg-muted/20">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((item, i) => {
              const Icon = item.icon
              return (
                <AnimatedSection key={item.title} delay={i * 0.1}>
                  <div className="p-6 rounded-2xl border border-border bg-card h-full">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-4 shadow-lg`}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="font-heading font-semibold text-xl text-foreground mb-3">
                      {item.title}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      {item.description}
                    </p>
                  </div>
                </AnimatedSection>
              )
            })}
          </div>
        </div>
      </section>

      {/* Company story timeline */}
      <section className="section-padding">
        <div className="container-custom">
          <SectionHeader
            eyebrow="Our Story"
            title="Just Getting"
            titleHighlight="Started"
            description="Founded in 2026 with a clear mission: build exceptional digital products and grow with our clients."
            className="mb-16"
          />

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/50 via-violet-500/50 to-transparent" />

            <div className="space-y-10">
              {timeline.map((item, i) => (
                <AnimatedSection key={i} delay={i * 0.08}>
                  <div
                    className={`relative flex gap-6 md:gap-0 ${
                      i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                  >
                    {/* Dot */}
                    <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-blue-500 border-2 border-background -translate-x-1 md:-translate-x-1.5 top-1.5 z-10" />

                    {/* Content */}
                    <div
                      className={`ml-10 md:ml-0 md:w-[45%] p-5 rounded-2xl border border-border bg-card ${
                        i % 2 === 0 ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'
                      }`}
                    >
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-2">
                        {item.year}
                      </span>
                      <h3 className="font-heading font-semibold text-foreground mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      <TechStack />
      <Process />
      <CTA />
    </>
  )
}
