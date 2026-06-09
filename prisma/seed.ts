import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const projects = [
  {
    title: 'FitTrack Pro',
    slug: 'fittrack-pro',
    description: 'A comprehensive fitness tracking mobile app with AI-powered workout recommendations and real-time health monitoring.',
    longDescription: `FitTrack Pro is a cutting-edge fitness companion designed for athletes and fitness enthusiasts. The app leverages machine learning to analyze workout patterns and deliver personalized training plans. With over 500 exercises, a nutrition tracker, and social features, FitTrack Pro has become an indispensable tool for thousands of users worldwide.\n\nThe app integrates with Apple Health and Google Fit to provide a holistic view of the user's wellness journey. Push notifications with smart reminders help users stay on track, while the gamification system keeps motivation high.`,
    category: 'mobile',
    technologies: JSON.stringify(['React Native', 'TypeScript', 'Node.js', 'PostgreSQL', 'Redis', 'TensorFlow Lite', 'AWS', 'Expo']),
    features: JSON.stringify([
      'AI-powered personalized workout plans',
      'Real-time health metrics via wearable integration',
      '500+ exercise library with video guides',
      'Nutrition tracking with barcode scanner',
      'Social challenges and leaderboards',
      'Offline mode for gym use without connectivity',
      'Apple Health & Google Fit sync',
      'Progress analytics with detailed charts',
    ]),
    challenges: 'The primary challenge was optimizing ML model performance on low-end Android devices while maintaining real-time inference speeds. We solved this with model quantization and progressive loading strategies.',
    results: 'Achieved 50,000+ downloads in the first 3 months, 4.8★ App Store rating, and 68% 30-day retention rate — well above the industry average of 32%.',
    liveUrl: 'https://fittrackpro.example.com',
    coverImage: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80',
    featured: true,
    order: 1,
    published: true,
  },
  {
    title: 'EcoShop',
    slug: 'ecoshop',
    description: 'A sustainable e-commerce platform connecting eco-conscious consumers with verified green brands, built with Next.js and headless commerce.',
    longDescription: `EcoShop is a purpose-driven marketplace that makes sustainable shopping accessible and enjoyable. The platform aggregates products from 200+ verified eco-friendly brands, each vetted for sustainability practices. Our unique "Green Score" algorithm evaluates products on carbon footprint, packaging, and ethical sourcing.\n\nBuilt as a headless commerce solution with Next.js, the platform delivers sub-second page loads and excellent SEO performance. The custom recommendation engine helps users discover products aligned with their values.`,
    category: 'website',
    technologies: JSON.stringify(['Next.js', 'TypeScript', 'Tailwind CSS', 'Shopify Storefront API', 'Node.js', 'PostgreSQL', 'Algolia', 'Stripe', 'Vercel']),
    features: JSON.stringify([
      'Headless Shopify integration',
      'Green Score sustainability rating system',
      'AI-powered product recommendations',
      'Advanced search with Algolia',
      'Multi-currency & international shipping',
      'Subscription boxes feature',
      'Carbon footprint calculator',
      'B2B bulk ordering portal',
    ]),
    challenges: 'Integrating 200+ vendor inventory systems in real-time while maintaining fast page loads required building a sophisticated caching layer and webhook-driven sync architecture.',
    results: 'Platform processed $2.4M in transactions within 6 months of launch, with average page load time of 0.8s and 42% higher conversion rate than the industry benchmark.',
    liveUrl: 'https://ecoshop.example.com',
    coverImage: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80',
    featured: true,
    order: 2,
    published: true,
  },
  {
    title: 'DataSync Analytics',
    slug: 'datasync-analytics',
    description: 'A real-time SaaS analytics platform helping mid-market businesses consolidate data from 50+ sources into actionable insights.',
    longDescription: `DataSync Analytics solves the fragmented data problem for growing businesses. Instead of juggling 10+ dashboards, teams get a single unified view of their business metrics. The platform connects to CRMs, databases, marketing tools, and financial systems through a library of 50+ pre-built connectors.\n\nThe no-code data transformation pipeline lets non-technical users create complex data workflows. White-label options allow agencies to offer DataSync under their own brand to clients.`,
    category: 'saas',
    technologies: JSON.stringify(['React', 'TypeScript', 'Python', 'FastAPI', 'PostgreSQL', 'Redis', 'Apache Kafka', 'Docker', 'Kubernetes', 'AWS', 'D3.js']),
    features: JSON.stringify([
      '50+ pre-built data source connectors',
      'Real-time streaming data pipelines',
      'No-code transformation workflows',
      'Custom dashboard builder with drag-and-drop',
      'Automated anomaly detection with alerts',
      'White-label reseller program',
      'SOC 2 Type II certified infrastructure',
      'API access for enterprise integrations',
    ]),
    challenges: 'Building a reliable real-time data pipeline that handles 10M+ events per day required careful Kafka topic partitioning and back-pressure handling to prevent data loss during traffic spikes.',
    results: 'Scaled to 180 paying customers at $299–$999/month ARR within 12 months, with 95% uptime SLA and NPS score of 67.',
    liveUrl: 'https://datasync.example.com',
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    featured: true,
    order: 3,
    published: true,
  },
  {
    title: 'FlowDesk',
    slug: 'flowdesk',
    description: 'An internal project management and HR operations platform replacing 5 legacy systems for a 1,200-employee manufacturing company.',
    longDescription: `FlowDesk was built to replace a patchwork of legacy systems at a mid-size manufacturing firm. The platform unifies project tracking, employee management, leave requests, expense reports, and document management into one cohesive system.\n\nThe migration from legacy systems was executed without any operational downtime using a parallel-run strategy and data migration scripts. Role-based access control ensures that each department sees only what's relevant to them.`,
    category: 'tool',
    technologies: JSON.stringify(['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'Tailwind CSS', 'Node.js', 'BullMQ', 'Redis', 'AWS S3']),
    features: JSON.stringify([
      'Multi-project tracking with Gantt charts',
      'HR module: onboarding, leave, payroll integration',
      'Expense management with approval workflows',
      'Document management with version control',
      'Role-based access control with 12 permission levels',
      'SSO integration with Active Directory',
      'Mobile-responsive for field workers',
      'Audit trails for compliance reporting',
    ]),
    challenges: 'Migrating 8 years of historical data from 5 different legacy systems with incompatible schemas, while ensuring zero data loss and maintaining business continuity.',
    results: 'Reduced administrative overhead by 40%, eliminated 5 software license costs ($180K/year savings), and improved cross-department collaboration scores from 54 to 81 in employee surveys.',
    coverImage: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&q=80',
    featured: false,
    order: 4,
    published: true,
  },
  {
    title: 'MediConnect',
    slug: 'mediconnect',
    description: 'A HIPAA-compliant telemedicine mobile app connecting patients with licensed physicians for on-demand virtual consultations.',
    longDescription: `MediConnect brings healthcare access to underserved communities through seamless telemedicine. Patients can book appointments with board-certified doctors within minutes, conduct secure video consultations, and receive digital prescriptions — all from their smartphone.\n\nThe app is built with HIPAA compliance at its core, with end-to-end encrypted video calls, secure messaging, and PHI-protected data storage. Integration with pharmacy chains enables same-day prescription fulfillment.`,
    category: 'mobile',
    technologies: JSON.stringify(['React Native', 'TypeScript', 'Node.js', 'WebRTC', 'PostgreSQL', 'AWS HIPAA', 'Twilio', 'Stripe', 'Redux Toolkit']),
    features: JSON.stringify([
      'HIPAA-compliant encrypted video consultations',
      'Smart physician matching algorithm',
      'E-prescriptions with pharmacy integration',
      'Insurance verification & billing',
      'Medical records management',
      'Secure in-app messaging',
      'Appointment reminders and follow-ups',
      'Multi-language support (12 languages)',
    ]),
    challenges: 'Achieving HIPAA compliance while delivering a smooth video calling experience required building custom WebRTC signaling with encrypted media streams and compliant data storage on AWS.',
    results: 'Facilitated 25,000+ consultations in year one, achieving HIPAA certification, 4.9★ App Store rating, and average consultation start time of under 4 minutes.',
    liveUrl: 'https://mediconnect.example.com',
    coverImage: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80',
    featured: false,
    order: 5,
    published: true,
  },
  {
    title: 'CloudBase Dashboard',
    slug: 'cloudbase-dashboard',
    description: 'A multi-cloud infrastructure management SaaS platform that gives DevOps teams a unified view across AWS, GCP, and Azure resources.',
    longDescription: `CloudBase Dashboard eliminates cloud sprawl by providing a single pane of glass across all major cloud providers. DevOps teams can monitor costs, performance metrics, and security compliance across hundreds of resources in real time.\n\nThe AI-powered cost optimization engine identifies waste and rightsizing opportunities automatically, typically saving companies 20-35% on their cloud bills within the first month.`,
    category: 'saas',
    technologies: JSON.stringify(['Next.js', 'TypeScript', 'Go', 'PostgreSQL', 'TimescaleDB', 'Prometheus', 'Grafana', 'Kubernetes', 'AWS SDK', 'GCP SDK', 'Azure SDK']),
    features: JSON.stringify([
      'Unified multi-cloud resource explorer',
      'Real-time cost monitoring and alerts',
      'AI-powered cost optimization recommendations',
      'Security compliance scanning (SOC2, CIS)',
      'Infrastructure-as-Code drift detection',
      'Team collaboration with role-based access',
      'Custom alerting with Slack/PagerDuty integration',
      'Automated rightsizing recommendations',
    ]),
    challenges: 'Normalizing data models across three major cloud providers with different APIs, pricing models, and resource hierarchies while keeping the UI intuitive for non-cloud-specialists.',
    results: 'Beta customers reported average cloud cost savings of 28%, with the dashboard processing 50M+ metrics per day. Achieved $1.2M ARR within 18 months of launch.',
    liveUrl: 'https://cloudbase.example.com',
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
    featured: false,
    order: 6,
    published: true,
  },
]

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const hashedPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || 'admin123!',
    12
  )

  await prisma.adminUser.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@strongmoonlabs.com' },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@strongmoonlabs.com',
      password: hashedPassword,
      name: 'Admin',
    },
  })
  console.log('✅ Admin user created')

  // Create projects
  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: project,
      create: project,
    })
  }
  console.log(`✅ ${projects.length} projects seeded`)

  console.log('✨ Seeding complete!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
