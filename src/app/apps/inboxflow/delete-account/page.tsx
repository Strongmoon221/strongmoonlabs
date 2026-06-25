import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Trash2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Account & Data Deletion — InboxFlow',
  description: 'How to delete your InboxFlow account and associated data.',
  robots: { index: true, follow: false },
}

const SUPPORT = 'support@inboxflow.cloud'

export default function DeleteAccountPage() {
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
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">InboxFlow · Strongmoon Labs</p>
            <div className="flex items-center gap-1.5">
              <Trash2 className="w-4 h-4 text-blue-400" />
              <h1 className="text-xl font-heading font-bold text-foreground">Account &amp; Data Deletion</h1>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mb-8">Last updated: June 22, 2026</p>

        <hr className="border-border mb-8" />

        <div
          className="prose prose-neutral dark:prose-invert max-w-none
            prose-h3:text-base prose-h3:font-heading prose-h3:font-semibold prose-h3:text-foreground prose-h3:mt-8 prose-h3:mb-2
            prose-p:text-sm prose-p:text-muted-foreground prose-p:leading-relaxed
            prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-foreground
            prose-li:text-sm prose-li:text-muted-foreground
            prose-ol:text-sm prose-ol:text-muted-foreground
            prose-hr:border-border"
        >
          <p>
            This page explains how to delete your <strong>InboxFlow</strong> account
            (developer: Strongmoon Labs) and the data associated with it. You can delete your
            account yourself inside the app, or request deletion by email.
          </p>

          <h3>Option 1 — Delete in the app (instant)</h3>
          <ol>
            <li>Open the InboxFlow app.</li>
            <li>Go to the <strong>Settings</strong> tab.</li>
            <li>Scroll to the bottom and tap <strong>Delete Account</strong>.</li>
            <li>Confirm. Your account and all synced data are permanently removed, and your
              connected mailbox (IMAP) credentials are deleted immediately.</li>
          </ol>

          <h3>Option 2 — Request by email</h3>
          <p>
            If you can no longer access the app, send an email from your account address to{' '}
            <a href={`mailto:${SUPPORT}?subject=Delete my account`}>{SUPPORT}</a> with the subject{' '}
            <strong>&quot;Delete my account&quot;</strong>. We will verify and process the request, and
            acknowledge it within <strong>7 business days</strong>.
          </p>

          <h3>What data is deleted</h3>
          <ul>
            <li>Your account (email address, name, and preferences).</li>
            <li>All synced emails, sender groups (Bundles), and statistics stored on our servers.</li>
            <li>Your encrypted mailbox (IMAP) credentials — the app loses all access to your mailbox.</li>
            <li>Automation rules, alerts, and support tickets associated with your account.</li>
            <li>Your push notification token.</li>
          </ul>
          <p>
            Deleting your InboxFlow account does <strong>not</strong> delete any emails inside your
            actual mailbox — it only removes the data InboxFlow stored and revokes our access to your mailbox.
          </p>

          <h3>Deleting data without deleting your account</h3>
          <p>
            You can also remove data without closing your account:
          </p>
          <ul>
            <li><strong>Disconnect a mailbox</strong> — in <strong>Settings</strong>, remove a connected mailbox.
              This deletes that mailbox&rsquo;s stored emails and its encrypted IMAP credentials from our servers,
              while keeping your InboxFlow account.</li>
            <li><strong>Empty the Trash</strong> — permanently removes the emails you deleted.</li>
            <li><strong>Request specific data deletion</strong> — email{' '}
              <a href={`mailto:${SUPPORT}?subject=Delete my data`}>{SUPPORT}</a> with the subject
              &quot;Delete my data&quot; describing what you&rsquo;d like removed.</li>
          </ul>

          <h3>Data retention</h3>
          <p>
            When you delete your account in the app, your data is removed immediately. For email
            requests, all associated data is permanently deleted from our servers within{' '}
            <strong>30 days</strong>. Backups that contain the data are purged on a rolling
            30-day cycle. We do not retain any account data required only to provide the service
            after deletion.
          </p>

          <h3>Questions</h3>
          <p>
            Contact us at <a href={`mailto:${SUPPORT}`}>{SUPPORT}</a>. See also our{' '}
            <Link href="/apps/inboxflow/privacy-policy">Privacy Policy</Link>.
          </p>
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
