import { Search, Palette, Code2, TestTube, Rocket, LifeBuoy } from 'lucide-react'
import SectionHeader from '@/components/ui/SectionHeader'
import AnimatedSection from '@/components/ui/AnimatedSection'

const steps = [
  {
    icon: Search,
    number: '01',
    title: 'Discovery & Strategy',
    description:
      'We deep-dive into your business goals, user needs, and technical requirements. We leave this phase with a shared vision and a clear roadmap.',
    duration: '1–2 weeks',
  },
  {
    icon: Palette,
    number: '02',
    title: 'Design & Prototyping',
    description:
      'High-fidelity UI designs and interactive prototypes, iterated with your feedback. You see the product before we write a line of code.',
    duration: '2–3 weeks',
  },
  {
    icon: Code2,
    number: '03',
    title: 'Development',
    description:
      'Agile sprints with weekly demos. Clean, documented code with continuous integration. You stay in the loop every step of the way.',
    duration: '4–12 weeks',
  },
  {
    icon: TestTube,
    number: '04',
    title: 'Testing & QA',
    description:
      'Comprehensive testing across devices and browsers. Performance audits, security scans, and accessibility checks before launch.',
    duration: '1–2 weeks',
  },
  {
    icon: Rocket,
    number: '05',
    title: 'Launch & Deploy',
    description:
      'Zero-downtime deployments with automated rollback capabilities. We handle the full launch checklist so nothing falls through the cracks.',
    duration: '1 week',
  },
  {
    icon: LifeBuoy,
    number: '06',
    title: 'Support & Growth',
    description:
      '90 days of free post-launch support. After that, optional retainer packages for ongoing development, monitoring, and optimization.',
    duration: 'Ongoing',
  },
]

export default function Process() {
  return (
    <section id="process" className="section-padding">
      <div className="container-custom">
        <SectionHeader
          eyebrow="How We Work"
          title="Our Development"
          titleHighlight="Process"
          description="A proven process refined across 50+ projects. Transparent at every stage, with no surprises."
          className="mb-16"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <AnimatedSection key={step.number} delay={i * 0.08}>
                <div className="relative p-6 rounded-2xl border border-border bg-card hover:bg-muted/20 transition-all duration-200 group h-full">
                  {/* Step number (decorative) */}
                  <div className="absolute top-4 right-4 text-5xl font-bold font-heading text-muted/30 select-none leading-none">
                    {step.number}
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                    <Icon className="w-5 h-5 text-blue-400" />
                  </div>

                  <h3 className="font-heading font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {step.description}
                  </p>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
                    {step.duration}
                  </span>
                </div>
              </AnimatedSection>
            )
          })}
        </div>
      </div>
    </section>
  )
}
