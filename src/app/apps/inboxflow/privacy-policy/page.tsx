import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Shield } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy — InboxFlow',
  description: 'Privacy Policy for InboxFlow',
  robots: { index: true, follow: false },
}

const SUPPORT = 'support@inboxflow.cloud'

export default function PrivacyPolicyPage() {
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
              <Shield className="w-4 h-4 text-blue-400" />
              <h1 className="text-xl font-heading font-bold text-foreground">Privacy Policy</h1>
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
          <h3>1. Introduction</h3>
          <p>InboxFlow (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is an email management application that helps you organize, read, and delete emails connected to your mailbox. This Privacy Policy explains what data we collect, why we collect it, and how we protect it.</p>
          <p>By using InboxFlow, you agree to the practices described in this policy.</p>

          <h3>2. Data We Collect</h3>
          <ul>
            <li>Personal Information — email address, name — for account creation and authentication.</li>
            <li>Messages — email content, subject, sender, recipients — to display and manage your emails inside the app.</li>
            <li>Credentials — your mailbox (IMAP) app password, stored encrypted — to connect to your mailbox on your behalf.</li>
            <li>App Activity — search queries, filter usage, actions on emails — to provide app functionality.</li>
            <li>Device / Other IDs — advertising ID (via Google AdMob) — to show ads to free-tier users (no mailbox data used).</li>
            <li>App Performance — crash logs, error diagnostics — to improve app stability.</li>
          </ul>

          <h3>3. How We Use Your Data</h3>
          <ul>
            <li>Email management: we access your mailbox to display, organize, mark as read, and delete (move to Trash) on your behalf.</li>
            <li>Sync: emails are temporarily stored on our secure servers to allow fast loading and offline access.</li>
            <li>Delete limits: we track the number of emails you delete per day to enforce free-tier and premium usage limits.</li>
            <li>Advertising: free-tier users may see ads served by Google AdMob, based only on non-mailbox signals; we never use your email content or metadata for ads.</li>
            <li>Push notifications: we use your device token to send notifications about new emails.</li>
          </ul>

          <h3>4. Data Sharing</h3>
          <p>We do not sell your personal data. We share data only with:</p>
          <ul>
            <li>Mailbox providers: we connect to your mailbox via IMAP using the credentials you provide, only to perform actions you initiate.</li>
            <li>Google AdMob: used to display ads in the free tier; no mailbox data is shared with AdMob.</li>
            <li>Google Firebase Cloud Messaging: used to deliver push notifications.</li>
            <li>Payment processors: premium subscriptions are handled by Google Play Billing. We do not store credit card information.</li>
          </ul>

          <h3>5. Data Storage and Security</h3>
          <ul>
            <li>All data transmitted between your device and our servers is encrypted in transit using HTTPS / TLS.</li>
            <li>Your emails are stored on our server only as long as needed to provide the service.</li>
            <li>Mailbox credentials are encrypted at rest using AES-256-GCM, and encryption keys are stored separately from the data.</li>
            <li>API access is authenticated, and you can only access your own mailboxes and messages.</li>
          </ul>

          <h3>6. Data Retention</h3>
          <p>We retain your data for as long as your account is active. If you delete your account, all your data is permanently removed from our servers within 30 days.</p>

          <h3>7. Your Rights and Data Deletion</h3>
          <ul>
            <li>Access the personal data we hold about you.</li>
            <li>Request correction of inaccurate data.</li>
            <li>Request deletion of your account and all associated data.</li>
            <li>Disconnect a mailbox at any time in the app.</li>
          </ul>
          <p>When you disconnect a mailbox or delete your account, we delete the stored data and credentials, so the app no longer has access to your mailbox.</p>
          <p>
            You can delete your account directly in the app, or email us at{' '}
            <a href={`mailto:${SUPPORT}`}>{SUPPORT}</a> with the subject &quot;Delete my account&quot;. We will acknowledge your
            request within 7 business days, and all associated data will be permanently removed within 30 days. See our{' '}
            <Link href="/apps/inboxflow/delete-account">Account &amp; Data Deletion</Link> page for full instructions.
          </p>

          <h3>8. Children&rsquo;s Privacy</h3>
          <p>InboxFlow is not intended for users under the age of 13. We do not knowingly collect personal information from children under 13.</p>

          <h3>9. Third-Party SDKs</h3>
          <ul>
            <li>Google AdMob — advertising.</li>
            <li>Google Firebase (Cloud Messaging) — push notifications.</li>
            <li>Expo / React Native — app framework.</li>
            <li>Google Play Billing — in-app purchases.</li>
          </ul>

          <h3>10. Changes to This Policy</h3>
          <p>We may update this Privacy Policy from time to time. When we do, we will update the &quot;Last updated&quot; date at the top.</p>

          <h3>11. Contact Us</h3>
          <p>If you have any questions about this Privacy Policy, please contact us at: <a href={`mailto:${SUPPORT}`}>{SUPPORT}</a></p>
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
