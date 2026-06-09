import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://strongmoonlabs.com'),
  title: {
    default: 'Strongmoon Labs | Software Development Company',
    template: '%s | Strongmoon Labs',
  },
  description:
    'Strongmoon Labs builds exceptional mobile apps, web applications, SaaS products, and AI-powered solutions. Transform your business with senior-level software development.',
  keywords: [
    'software development company',
    'mobile app development',
    'web application development',
    'SaaS development',
    'AI solutions',
    'React Native',
    'Next.js',
    'custom software',
  ],
  authors: [{ name: 'Strongmoon Labs', url: 'https://strongmoonlabs.com' }],
  creator: 'Strongmoon Labs',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://strongmoonlabs.com',
    siteName: 'Strongmoon Labs',
    title: 'Strongmoon Labs | Software Development Company',
    description:
      'We build exceptional mobile apps, web platforms, and SaaS products that transform businesses.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Strongmoon Labs',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Strongmoon Labs | Software Development Company',
    description: 'We build exceptional digital products that transform businesses.',
    images: ['/og-image.png'],
    creator: '@strongmoonlabs',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable}`}
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
