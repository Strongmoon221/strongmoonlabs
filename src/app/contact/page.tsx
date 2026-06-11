import type { Metadata } from 'next'
import { Mail, Clock } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import ContactForm from '@/components/contact/ContactForm'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with Strongmoon Labs. Tell us about your project and we\'ll respond within 24 hours.',
}

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'hello@strongmoonlabs.com',
    href: 'mailto:hello@strongmoonlabs.com',
  },
  {
    icon: Clock,
    label: 'Response Time',
    value: 'Within 24 hours',
    href: null,
  },
]


export default function ContactPage() {
  return (
    <section className="min-h-screen pt-32 pb-20">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left: info */}
          <div>
            <AnimatedSection>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-4">
                Contact Us
              </span>
            </AnimatedSection>
            <AnimatedSection delay={0.05}>
              <h1 className="text-4xl sm:text-5xl font-bold font-heading tracking-tight mb-4">
                Let&apos;s build something{' '}
                <span className="gradient-text">great</span>
              </h1>
            </AnimatedSection>
            <AnimatedSection delay={0.1}>
              <p className="text-lg text-muted-foreground leading-relaxed mb-10">
                Have a project in mind? We&apos;d love to hear about it. Fill out the form and
                we&apos;ll get back to you within 24 hours with honest thoughts and a clear path
                forward.
              </p>
            </AnimatedSection>

            {/* Contact info */}
            <div className="space-y-4 mb-10">
              {contactInfo.map((item, i) => {
                const Icon = item.icon
                return (
                  <AnimatedSection key={item.label} delay={0.15 + i * 0.07}>
                    <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-0.5">
                          {item.label}
                        </div>
                        {item.href ? (
                          <a
                            href={item.href}
                            className="text-foreground font-medium hover:text-blue-400 transition-colors"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <div className="text-foreground font-medium">{item.value}</div>
                        )}
                      </div>
                    </div>
                  </AnimatedSection>
                )
              })}
            </div>

          </div>

          {/* Right: form */}
          <AnimatedSection delay={0.1} direction="left">
            <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card">
              <h2 className="font-heading font-semibold text-xl text-foreground mb-6">
                Tell us about your project
              </h2>
              <ContactForm />
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}
