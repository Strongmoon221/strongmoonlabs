import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, FileText } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms of Service — InboxFlow',
  description: 'Terms of Service for InboxFlow',
  robots: { index: true, follow: false },
}

const SUPPORT = 'support@inboxflow.cloud'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <Link
          href="/apps/inboxflow"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          InboxFlow
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold text-lg">
            I
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">InboxFlow</p>
            <div className="flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-blue-400" />
              <h1 className="text-xl font-heading font-bold text-foreground">Terms of Service</h1>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mb-8">Last updated: June 19, 2026</p>

        <hr className="border-border mb-8" />

        <div
          className="prose prose-neutral dark:prose-invert max-w-none
            prose-h3:text-base prose-h3:font-heading prose-h3:font-semibold prose-h3:text-foreground prose-h3:mt-8 prose-h3:mb-2
            prose-p:text-sm prose-p:text-muted-foreground prose-p:leading-relaxed
            prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-foreground
            prose-li:text-sm prose-li:text-muted-foreground
            prose-hr:border-border"
        >
          <p>Please read these Terms carefully before using InboxFlow. By downloading or using the app, you agree to be bound by these Terms.</p>

          <h3>1. Acceptance of Terms</h3>
          <p>These Terms of Service (&quot;Terms&quot;) govern your use of the InboxFlow mobile application (&quot;App&quot;). By accessing or using the App, you confirm that you are at least 13 years old and agree to these Terms in full.</p>

          <h3>2. Description of Service</h3>
          <p>InboxFlow is an email management application that connects to your mailbox via the IMAP protocol. The App allows you to:</p>
          <ul>
            <li>View, search, and organize your emails</li>
            <li>Delete emails individually or in bulk</li>
            <li>Group emails by sender (Bundles)</li>
            <li>Set snooze reminders on emails</li>
            <li>Move emails to Trash and restore or permanently delete them</li>
            <li>View email statistics and manage automation rules</li>
          </ul>

          <h3>3. Account and Authentication</h3>
          <p>To use InboxFlow, you connect your mailbox using your email address and an app password via IMAP. You are responsible for maintaining the confidentiality of your credentials. You can disconnect your mailbox at any time within the App.</p>

          <h3>4. Free Tier and Premium Subscription</h3>
          <ul>
            <li>Free tier: limited to a set number of email deletions per day. Ads may be shown.</li>
            <li>Premium: unlimited deletions, no ads, and access to all advanced features. Billed through Google Play as a recurring subscription.</li>
          </ul>
          <p>Subscriptions automatically renew unless cancelled at least 24 hours before the end of the current period. We do not offer refunds for partially used subscription periods, except where required by applicable law.</p>

          <h3>5. Acceptable Use</h3>
          <p>You agree not to: use the App for any unlawful purpose; reverse engineer or disassemble the App; use bots or automated scripts; disrupt our servers; or use the App to send spam.</p>

          <h3>6. Data and Privacy</h3>
          <p>Your use of the App is also governed by our <Link href="/apps/inboxflow/privacy-policy">Privacy Policy</Link>, which is incorporated into these Terms by reference.</p>

          <h3>7. Disclaimer of Warranties</h3>
          <p>The App is provided on an &quot;as is&quot; and &quot;as available&quot; basis without warranties of any kind. Email deletion actions (including bulk deletions) may be irreversible — you are solely responsible for any emails deleted using the App.</p>

          <h3>8. Limitation of Liability</h3>
          <p>To the maximum extent permitted by law, InboxFlow shall not be liable for any indirect, incidental, special, or consequential damages, including loss of data or emails, arising from your use of the App.</p>

          <h3>9. Intellectual Property</h3>
          <p>The App and its content are owned by InboxFlow and protected by intellectual property laws. You are granted a limited, non-exclusive, non-transferable license for personal use.</p>

          <h3>10. Termination</h3>
          <p>We may suspend or terminate your access for conduct that violates these Terms. You may stop using the App at any time and delete your account in-app or by contacting <a href={`mailto:${SUPPORT}`}>{SUPPORT}</a>.</p>

          <h3>11. Changes to Terms</h3>
          <p>We may update these Terms at any time. Continued use of the App after changes constitutes acceptance of the revised Terms.</p>

          <h3>12. Governing Law</h3>
          <p>These Terms are governed by applicable laws, and disputes are subject to the jurisdiction of the competent courts.</p>

          <h3>13. Contact</h3>
          <p>Questions about these Terms? Contact us at: <a href={`mailto:${SUPPORT}`}>{SUPPORT}</a></p>
        </div>

        <hr className="border-border mt-12 mb-6" />
        <p className="text-xs text-muted-foreground text-center">
          © {new Date().getFullYear()} InboxFlow · Developed by{' '}
          <Link href="/" className="text-blue-400 hover:underline">Strongmoon Labs</Link>
        </p>
      </div>
    </div>
  )
}
