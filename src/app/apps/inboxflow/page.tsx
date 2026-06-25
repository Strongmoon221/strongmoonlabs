import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowLeft, Package, Trash2, Lightbulb, Zap, RotateCcw,
  BarChart2, Bell, Shield, FileText, HeadphonesIcon, ExternalLink,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'InboxFlow — Clean up your email inbox · Strongmoon Labs',
  description: 'InboxFlow is an email management app that connects to your mailbox via IMAP and helps you declutter your inbox — group senders, bulk-delete, mark as read, automate, and stay on top of new mail.',
}

const FEATURES = [
  { icon: Package,    title: 'Bundles',           desc: 'Automatically groups your emails by sender so you can clean up in seconds.' },
  { icon: Trash2,     title: 'Bulk Cleanup',       desc: 'Delete or mark hundreds of emails as read at once.' },
  { icon: Lightbulb,  title: 'Smart Suggestions',  desc: 'Highlights the senders filling up your inbox.' },
  { icon: Zap,        title: 'Automation & Alerts', desc: 'Auto-handle incoming mail and get notified on keywords.' },
  { icon: RotateCcw,  title: 'Trash Control',       desc: 'Move emails to Trash and restore or permanently delete them.' },
  { icon: BarChart2,  title: 'Statistics',          desc: 'See how much mail you receive and from whom.' },
  { icon: Bell,       title: 'Push Notifications',  desc: 'Know when new or important emails arrive.' },
]

const LEGAL = [
  { icon: Shield,          label: 'Privacy Policy',          href: '/apps/inboxflow/privacy-policy',  desc: 'How we collect and use your data' },
  { icon: FileText,        label: 'Terms of Service',        href: '/apps/inboxflow/terms',           desc: 'Rules and conditions for using the app' },
  { icon: Trash2,          label: 'Account & Data Deletion', href: '/apps/inboxflow/delete-account',  desc: 'How to delete your account and data' },
  { icon: HeadphonesIcon,  label: 'Support',                 href: 'mailto:support@inboxflow.cloud',  desc: 'support@inboxflow.cloud', external: true },
]

export default function InboxFlowPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top nav */}
      <div className="border-b border-border/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Strongmoon Labs
          </Link>
          <a
            href="https://play.google.com/store/apps/details?id=com.inboxflow.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-colors"
          >
            Google Play <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">

        {/* Hero */}
        <div className="flex flex-col items-center text-center mb-16">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/apps/inboxflow/icon.png"
            alt="InboxFlow logo"
            width={96}
            height={96}
            className="rounded-[22px] shadow-2xl shadow-blue-500/20 mb-6"
          />
          <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-card border border-border text-muted-foreground mb-3">
            by Strongmoon Labs
          </span>
          <h1 className="text-4xl sm:text-5xl font-heading font-bold tracking-tight mb-4">
            InboxFlow
          </h1>
          <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
            Clean up and take control of your email inbox.
          </p>

          <div className="mt-8 p-4 rounded-2xl bg-blue-500/5 border border-blue-500/15 text-sm text-muted-foreground max-w-xl leading-relaxed">
            InboxFlow connects to your mailbox via IMAP (using a secure app password) and helps you declutter
            your inbox — group senders, bulk-delete, mark as read, automate, and stay on top of new mail.
          </div>

          <a
            href="https://play.google.com/store/apps/details?id=com.inboxflow.app"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors shadow-lg shadow-blue-500/25"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white"><path d="M3.18 23.76c.28.16.6.24.93.24.4 0 .8-.11 1.14-.31l13.5-7.76-3.03-3.03-12.54 10.86zm-1.18-20.4v17.28l9.64-8.64L2 3.36zm19.5 8.4-2.93-1.69L15.45 12l3.12 3.12 2.93-1.69c.84-.48.84-1.68 0-2.16zM4.11.55 16.65 8.3 13.62 11.33 1.08.47C1.43.17 1.85.01 2.28.01c.62 0 1.24.27 1.83.54z"/></svg>
            Download on Google Play
          </a>
        </div>

        {/* Features */}
        <section className="mb-16">
          <h2 className="text-xl font-heading font-bold text-foreground mb-6">What InboxFlow does</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4 p-4 rounded-2xl bg-card border border-border hover:border-blue-500/30 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4.5 h-4.5 w-[18px] h-[18px] text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Screenshots */}
        <section className="mb-16">
          <h2 className="text-xl font-heading font-bold text-foreground mb-6">Screenshots</h2>
          <div className="grid grid-cols-3 gap-3">
            {['bundles', 'inbox', 'stats'].map((name) => (
              <div key={name} className="rounded-2xl overflow-hidden border border-border bg-card aspect-[9/16]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/apps/inboxflow/screenshots/${name}.png`}
                  alt={`${name} screen`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </section>

        {/* How we handle your data */}
        <section className="mb-16">
          <h2 className="text-xl font-heading font-bold text-foreground mb-4">How InboxFlow handles your data</h2>

          <div className="rounded-2xl border border-border bg-card p-5 space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>
              InboxFlow connects to your mailbox over <strong className="text-foreground">IMAP</strong> using an{' '}
              <strong className="text-foreground">app password</strong> you provide. It can{' '}
              <strong className="text-foreground">read</strong> your messages (to display and group them),{' '}
              <strong className="text-foreground">mark them as read</strong>,{' '}
              <strong className="text-foreground">star</strong>, and{' '}
              <strong className="text-foreground">move them to Trash or delete them</strong> on your request.
              It never sends email on your behalf.
            </p>
            <p>
              Your data is used solely to provide these features. Mailbox credentials are encrypted at rest
              (AES-256-GCM), your data is never sold, never used for advertising, and never used to train AI/ML models.
            </p>
            <p>
              When you disconnect a mailbox or delete your account, the stored emails and your encrypted
              credentials are removed, and the app loses all access to your mailbox. See our{' '}
              <Link href="/apps/inboxflow/privacy-policy" className="text-blue-400 hover:underline">Privacy Policy</Link>{' '}
              and{' '}
              <Link href="/apps/inboxflow/delete-account" className="text-blue-400 hover:underline">Account &amp; Data Deletion</Link>{' '}
              pages for details.
            </p>
          </div>
        </section>

        {/* Legal & Support */}
        <section className="mb-16">
          <h2 className="text-xl font-heading font-bold text-foreground mb-6">Legal &amp; Support</h2>
          <div className="space-y-3">
            {LEGAL.map(({ icon: Icon, label, href, desc, external }) => {
              const cls = 'flex items-center gap-4 p-4 rounded-2xl border border-border bg-card hover:border-blue-500/40 hover:bg-blue-500/5 transition-all group'
              const inner = (
                <>
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{label}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0 opacity-50" />
                </>
              )
              return external ? (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
              ) : (
                <Link key={label} href={href} className={cls}>{inner}</Link>
              )
            })}
          </div>
        </section>

        {/* Footer */}
        <p className="text-xs text-muted-foreground text-center border-t border-border pt-8">
          © {new Date().getFullYear()} InboxFlow · Developed by{' '}
          <Link href="/" className="text-blue-400 hover:underline">Strongmoon Labs</Link>
        </p>
      </div>
    </div>
  )
}
