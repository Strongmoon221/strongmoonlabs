import SectionHeader from '@/components/ui/SectionHeader'
import AnimatedSection from '@/components/ui/AnimatedSection'

const techCategories = [
  {
    label: 'Mobile',
    color: 'from-blue-500 to-cyan-500',
    technologies: ['React Native', 'Flutter', 'Expo', 'Swift', 'Kotlin'],
  },
  {
    label: 'Frontend',
    color: 'from-violet-500 to-purple-500',
    technologies: ['Next.js', 'React', 'Vue.js', 'TypeScript', 'Tailwind CSS'],
  },
  {
    label: 'Backend',
    color: 'from-emerald-500 to-teal-500',
    technologies: ['Node.js', 'Python', 'Go', 'PHP', 'FastAPI'],
  },
  {
    label: 'Database',
    color: 'from-orange-500 to-amber-500',
    technologies: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite'],
  },
  {
    label: 'Cloud & DevOps',
    color: 'from-pink-500 to-rose-500',
    technologies: ['AWS', 'GCP', 'Docker', 'Kubernetes', 'CI/CD'],
  },
  {
    label: 'AI & ML',
    color: 'from-indigo-500 to-blue-500',
    technologies: ['OpenAI API', 'LangChain', 'TensorFlow', 'PyTorch', 'Hugging Face'],
  },
]

export default function TechStack() {
  return (
    <section id="technologies" className="section-padding bg-muted/20">
      <div className="container-custom">
        <SectionHeader
          eyebrow="Our Stack"
          title="Technologies We"
          titleHighlight="Master"
          description="We choose the right tool for each job. Our team has deep expertise across the modern technology landscape."
          className="mb-16"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {techCategories.map((cat, i) => (
            <AnimatedSection key={cat.label} delay={i * 0.08}>
              <div className="p-5 rounded-2xl border border-border bg-card hover:bg-muted/20 transition-all duration-200">
                <div className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${cat.color} text-white mb-4`}>
                  {cat.label}
                </div>
                <div className="flex flex-wrap gap-2">
                  {cat.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium bg-muted text-foreground border border-border hover:border-blue-500/30 hover:text-blue-400 transition-colors cursor-default"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
