import { cn } from '@/lib/utils'
import AnimatedSection from './AnimatedSection'

interface SectionHeaderProps {
  eyebrow?: string
  title: string
  titleHighlight?: string
  description?: string
  align?: 'left' | 'center'
  className?: string
}

export default function SectionHeader({
  eyebrow,
  title,
  titleHighlight,
  description,
  align = 'center',
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn(align === 'center' ? 'text-center' : 'text-left', className)}>
      {eyebrow && (
        <AnimatedSection>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-4">
            {eyebrow}
          </span>
        </AnimatedSection>
      )}
      <AnimatedSection delay={0.05}>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading tracking-tight mb-4">
          {title}{' '}
          {titleHighlight && <span className="gradient-text">{titleHighlight}</span>}
        </h2>
      </AnimatedSection>
      {description && (
        <AnimatedSection delay={0.1}>
          <p
            className={cn(
              'text-base sm:text-lg text-muted-foreground leading-relaxed',
              align === 'center' && 'max-w-2xl mx-auto'
            )}
          >
            {description}
          </p>
        </AnimatedSection>
      )}
    </div>
  )
}
