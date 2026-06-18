import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

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
    'Strongmoon Labs builds modern websites and mobile apps. Clean design, fast performance, and real results for your business.',
  keywords: [
    'website development',
    'mobile app development',
    'React Native',
    'Next.js',
    'web design',
    'landing page',
    'iOS Android app',
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
          {children}
        </Providers>
      </body>
    </html>
  )
}
