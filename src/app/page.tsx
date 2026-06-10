import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'
import { serializeProject } from '@/lib/utils'
import Hero from '@/components/sections/Hero'
import Services from '@/components/sections/Services'
import WhyUs from '@/components/sections/WhyUs'
import FeaturedProjects from '@/components/sections/FeaturedProjects'
import CTA from '@/components/sections/CTA'

async function getFeaturedProjects() {
  try {
    const projects = await prisma.project.findMany({
      where: { featured: true, published: true },
      include: { screenshots: true },
      orderBy: { order: 'asc' },
      take: 3,
    })
    return projects.map(serializeProject)
  } catch {
    return []
  }
}

export default async function Home() {
  const featuredProjects = await getFeaturedProjects()

  return (
    <>
      <Hero />
      <Services />
      <WhyUs />
      <FeaturedProjects projects={featuredProjects} />
      <CTA />
    </>
  )
}
