import { Smartphone, Globe, Code2, Layers, Zap, Brain } from 'lucide-react'
import SectionHeader from '@/components/ui/SectionHeader'
import AnimatedSection from '@/components/ui/AnimatedSection'

const services = [
  {
    icon: Smartphone,
    title: 'Mobile App Development',
    description:
      'Native and cross-platform iOS & Android apps built with React Native and Flutter. Performant, polished, and App Store ready.',
    features: ['React Native & Flutter', 'iOS & Android', 'App Store optimization', 'Push notifications'],
    color: 'from-blue-500 to-cyan-500',
    glow: 'group-hover:shadow-blue-500/20',
  },
  {
    icon: Globe,
    title: 'Web Application Development',
    description:
      'Full-stack web applications with modern frameworks. From landing pages to complex multi-tenant platforms, built for scale.',
    features: ['Next.js & React', 'TypeScript', 'REST & GraphQL APIs', 'SEO optimized'],
    color: 'from-violet-500 to-purple-500',
    glow: 'group-hover:shadow-violet-500/20',
  },
  {
    icon: Code2,
    title: 'Custom Software Solutions',
    description:
      'Bespoke software tailored to your exact workflow. We replace legacy systems and build tools your team will actually love using.',
    features: ['Requirements analysis', 'System architecture', 'Legacy migration', 'Training & docs'],
    color: 'from-emerald-500 to-teal-500',
    glow: 'group-hover:shadow-emerald-500/20',
  },
  {
    icon: Layers,
    title: 'SaaS Products',
    description:
      'End-to-end SaaS development from MVP to enterprise-grade platform. Multi-tenancy, billing, onboarding — the full package.',
    features: ['Multi-tenant architecture', 'Subscription billing', 'Admin dashboards', 'User analytics'],
    color: 'from-orange-500 to-amber-500',
    glow: 'group-hover:shadow-orange-500/20',
  },
  {
    icon: Zap,
    title: 'Business Automation',
    description:
      'Eliminate repetitive work with intelligent automation. Connect your tools, automate workflows, and let your team focus on what matters.',
    features: ['Workflow automation', 'API integrations', 'Data pipelines', 'RPA solutions'],
    color: 'from-pink-500 to-rose-500',
    glow: 'group-hover:shadow-pink-500/20',
  },
  {
    icon: Brain,
    title: 'AI-Powered Solutions',
    description:
      'Integrate large language models, computer vision, and ML pipelines into your product. Real AI that delivers measurable value.',
    features: ['LLM integration', 'Custom ML models', 'Computer vision', 'Predictive analytics'],
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
          description="From mobile to AI, we cover the full spectrum of digital product development. Every service is delivered with senior-level expertise and production-ready quality."
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
