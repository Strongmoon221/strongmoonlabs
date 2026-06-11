'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Sparkles, ChevronDown } from 'lucide-react'

const stats = [
  { label: 'Projects Delivered', value: '2' },
  { label: 'Happy Clients', value: '1' },
  { label: 'Technologies', value: '15+' },
  { label: 'Founded', value: '2026' },
]

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] } },
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background grid */}
      <div
        className="absolute inset-0 bg-grid-pattern bg-grid opacity-30 dark:opacity-20"
        style={{
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 60%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 60%, transparent 100%)',
        }}
      />

      {/* Gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-64 -right-64 w-[700px] h-[700px] rounded-full bg-blue-600/15 dark:bg-blue-600/20 blur-[120px] animate-pulse-slow" />
        <div
          className="absolute -bottom-64 -left-64 w-[700px] h-[700px] rounded-full bg-violet-600/15 dark:bg-violet-600/20 blur-[120px] animate-pulse-slow"
          style={{ animationDelay: '2s' }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-indigo-600/10 blur-[100px]" />
      </div>

      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        className="relative z-10 container-custom text-center"
      >
        {/* Eyebrow badge */}
        <motion.div variants={fadeUp} className="flex justify-center mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            Mobile Apps & Websites — Founded 2026
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          variants={fadeUp}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold font-heading tracking-tight mb-6 leading-[1.05]"
        >
          <span className="text-foreground">Build Beyond</span>
          <br />
          <span className="gradient-text">Limits</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          variants={fadeUp}
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          We build modern mobile apps and websites that look great, work fast,
          and help your business grow — from the first idea to launch.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeUp}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
        >
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/25 hover:shadow-blue-500/40 hover:-translate-y-0.5"
          >
            Start Your Project
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 px-8 py-4 border border-border hover:border-blue-500/50 text-foreground hover:text-blue-400 font-semibold rounded-xl transition-all duration-200 hover:-translate-y-0.5"
          >
            View Our Work
          </Link>
        </motion.div>

        {/* Stats row */}
        <motion.div variants={fadeUp}>
          <div className="relative inline-flex gap-8 sm:gap-16 px-8 sm:px-12 py-6 rounded-2xl border border-border bg-card/50 backdrop-blur-sm">
            {stats.map((stat, i) => (
              <div key={i} className={`text-center ${i < stats.length - 1 ? 'pr-8 sm:pr-16 border-r border-border' : ''}`}>
                <div className="text-2xl sm:text-3xl font-bold font-heading gradient-text">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-0.5 whitespace-nowrap">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-muted-foreground"
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">Scroll</span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </motion.div>
    </section>
  )
}
