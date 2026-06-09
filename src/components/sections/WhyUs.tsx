import { Shield, Clock, Award, HeadphonesIcon, Eye, TrendingUp } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'

const reasons = [
  {
    icon: Award,
    title: 'Senior-Only Team',
    description:
      'Every project is handled by senior developers with 5+ years of experience. No juniors learning on your dime.',
  },
  {
    icon: Clock,
    title: 'On-Time, Every Time',
    description:
      'We have a 94% on-time delivery rate. Realistic timelines, proactive communication, zero surprises at launch.',
  },
  {
    icon: Shield,
    title: 'Security by Default',
    description:
      'Security is built in from day one — OWASP compliance, input validation, encrypted data, and regular audits.',
  },
  {
    icon: Eye,
    title: 'Full Transparency',
    description:
      'Daily updates, public project boards, and honest conversations. You always know exactly where your project stands.',
  },
  {
    icon: HeadphonesIcon,
    title: '90-Day Post-Launch Support',
    description:
      'Every project includes 90 days of free support after launch. We stand behind our work.',
  },
  {
    icon: TrendingUp,
    title: 'Scale-Ready Architecture',
    description:
      "We build for tomorrow, not just today. Our architecture handles 10x growth without costly rewrites.",
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
                Most agencies ship code and disappear. We stay invested in your success because our
                reputation depends on it. When you win, we win.
              </p>
            </AnimatedSection>
            <AnimatedSection delay={0.15}>
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="text-center sm:text-left">
                  <div className="text-4xl font-bold gradient-text font-heading">94%</div>
                  <div className="text-sm text-muted-foreground mt-1">On-time delivery rate</div>
                </div>
                <div className="hidden sm:block w-px bg-border" />
                <div className="text-center sm:text-left">
                  <div className="text-4xl font-bold gradient-text font-heading">4.9★</div>
                  <div className="text-sm text-muted-foreground mt-1">Average client rating</div>
                </div>
                <div className="hidden sm:block w-px bg-border" />
                <div className="text-center sm:text-left">
                  <div className="text-4xl font-bold gradient-text font-heading">85%</div>
                  <div className="text-sm text-muted-foreground mt-1">Clients return for more</div>
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
