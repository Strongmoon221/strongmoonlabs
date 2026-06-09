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
    year: '2019',
    title: 'The Beginning',
    description:
      'Founded by two developers who were frustrated with low-quality offshore outsourcing. Strongmoon Labs started as a two-person boutique studio with one simple promise: deliver what you promise.',
  },
  {
    year: '2020',
    title: 'First 10 Clients',
    description:
      'Grew from 2 to 8 team members. Delivered our first mobile app to 10,000+ users. Learned that great design and great engineering are inseparable.',
  },
  {
    year: '2021',
    title: 'Going Full-Stack',
    description:
      'Expanded into web, SaaS, and business automation. Launched our first multi-tenant SaaS product. Hit $1M in cumulative project revenue.',
  },
  {
    year: '2022',
    title: 'AI-First Pivot',
    description:
      'Early adoption of LLMs and generative AI. Built our first AI-powered products and established an internal AI research practice.',
  },
  {
    year: '2023',
    title: 'Scale & Process',
    description:
      'Formalized our delivery process and QA standards. 12 team members, 35+ completed projects, NPS score of 72. Zero missed deadlines all year.',
  },
  {
    year: '2024+',
    title: 'What\'s Next',
    description:
      'Expanding into enterprise clients and launching two internal SaaS products. Building the team to 20+ while maintaining our senior-only hiring bar.',
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
                Strongmoon Labs is a software development company built on the belief that
                exceptional engineering and great design are not a luxury — they&apos;re a
                competitive necessity. We partner with ambitious teams to turn complex ideas into
                products that users love and businesses depend on.
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
            title="From Two Devs to a"
            titleHighlight="Full Studio"
            description="Five years of growth, learning, and building things we're genuinely proud of."
            className="mb-16"
          />

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/50 via-violet-500/50 to-transparent" />

            <div className="space-y-10">
              {timeline.map((item, i) => (
                <AnimatedSection key={item.year} delay={i * 0.08}>
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
