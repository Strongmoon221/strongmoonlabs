import Link from 'next/link'
import { ArrowRight, MessageSquare } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'

export default function CTA() {
  return (
    <section className="section-padding">
      <div className="container-custom">
        <AnimatedSection>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 px-8 py-16 md:px-16 md:py-20 text-center">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/5 blur-3xl" />
            </div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/10 text-white/80 text-xs font-semibold uppercase tracking-wider mb-6">
                <MessageSquare className="w-3 h-3" />
                Let&apos;s Talk
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading text-white mb-6 tracking-tight">
                Ready to build something
                <br />
                <span className="text-blue-200">extraordinary?</span>
              </h2>

              <p className="text-white/70 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
                Tell us about your project. We&apos;ll get back to you within 24 hours with a clear
                plan and honest timeline.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-700 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-200 shadow-xl hover:-translate-y-0.5"
                >
                  Start Your Project
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="mailto:hello@strongmoonlabs.com"
                  className="inline-flex items-center gap-2 px-8 py-4 border border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-200"
                >
                  hello@strongmoonlabs.com
                </a>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
