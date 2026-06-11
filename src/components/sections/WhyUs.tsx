import { Shield, Clock, Award, HeadphonesIcon, Eye, TrendingUp } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'

const reasons = [
  {
    icon: Award,
    title: 'Direct Communication',
    description:
      'You work directly with the developer — no account managers, no middlemen. Fast answers, clear updates, real conversations.',
  },
  {
    icon: Clock,
    title: 'Realistic Timelines',
    description:
      'Honest deadlines from the start. I set timelines I can actually hit and keep you updated every step of the way.',
  },
  {
    icon: Shield,
    title: 'Security by Default',
    description:
      'Security is built in from day one — input validation, encrypted data, and safe coding practices on every project.',
  },
  {
    icon: Eye,
    title: 'Full Transparency',
    description:
      'No surprises. You always know where your project stands — what\'s done, what\'s next, and what might shift.',
  },
  {
    icon: HeadphonesIcon,
    title: 'Post-Launch Support',
    description:
      'Every project includes support after launch. I stand behind my work and make sure everything runs smoothly.',
  },
  {
    icon: TrendingUp,
    title: 'Clean, Maintainable Code',
    description:
      'Code that\'s easy to read, extend, and hand off. Built to grow with your product, not to lock you in.',
  },
]

export default function WhyUs() {
  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: header + big claim */}
          <div>
            <AnimatedSection>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-4">
                Why Strongmoon Labs
              </span>
            </AnimatedSection>
            <AnimatedSection delay={0.05}>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading tracking-tight mb-6 leading-tight">
                We don&apos;t just build —{' '}
                <span className="gradient-text">we partner</span>
              </h2>
            </AnimatedSection>
            <AnimatedSection delay={0.1}>
              <p className="text-muted-foreground leading-relaxed text-base sm:text-lg mb-8">
                I&apos;m not an agency with dozens of clients. Every project gets my full focus —
                because my reputation is built one project at a time. When you win, I win.
              </p>
            </AnimatedSection>
            <AnimatedSection delay={0.15}>
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="text-center sm:text-left">
                  <div className="text-4xl font-bold gradient-text font-heading">100%</div>
                  <div className="text-sm text-muted-foreground mt-1">Personal involvement</div>
                </div>
                <div className="hidden sm:block w-px bg-border" />
                <div className="text-center sm:text-left">
                  <div className="text-4xl font-bold gradient-text font-heading">24h</div>
                  <div className="text-sm text-muted-foreground mt-1">Response time</div>
                </div>
                <div className="hidden sm:block w-px bg-border" />
                <div className="text-center sm:text-left">
                  <div className="text-4xl font-bold gradient-text font-heading">0</div>
                  <div className="text-sm text-muted-foreground mt-1">Hidden fees</div>
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Right: feature grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {reasons.map((reason, i) => {
              const Icon = reason.icon
              return (
                <AnimatedSection key={reason.title} delay={i * 0.07}>
                  <div className="p-5 rounded-xl border border-border bg-card hover:bg-muted/30 transition-all duration-200 group">
                    <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-3 group-hover:bg-blue-500/20 transition-colors">
                      <Icon className="w-4 h-4 text-blue-400" />
                    </div>
                    <h3 className="font-heading font-semibold text-sm text-foreground mb-1.5">
                      {reason.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {reason.description}
                    </p>
                  </div>
                </AnimatedSection>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
