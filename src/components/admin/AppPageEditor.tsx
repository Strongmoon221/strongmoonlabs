'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, AlertCircle, Eye } from 'lucide-react'
import Button from '@/components/ui/Button'

interface AppPageEditorProps {
  appId: string
  type: 'privacy' | 'terms' | 'support'
  defaultTitle: string
  defaultContent: string
}

const TEMPLATES: Record<string, string> = {
  privacy: `<h2>Privacy Policy</h2>
<p>Last updated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

<h3>Information We Collect</h3>
<p>We collect information you provide directly to us when you use our app, such as when you create an account, make a purchase, or contact us for support.</p>

<h3>How We Use Your Information</h3>
<p>We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.</p>

<h3>Information Sharing</h3>
<p>We do not share your personal information with third parties except as described in this policy.</p>

<h3>Data Security</h3>
<p>We take reasonable measures to help protect your personal information from loss, theft, misuse, and unauthorized access.</p>

<h3>Contact Us</h3>
<p>If you have any questions about this Privacy Policy, please contact us at: hello@strongmoonlabs.com</p>`,

  terms: `<h2>Terms of Service</h2>
<p>Last updated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

<h3>Acceptance of Terms</h3>
<p>By downloading or using this app, you agree to be bound by these Terms of Service.</p>

<h3>Use of the App</h3>
<p>You agree to use the app only for lawful purposes and in accordance with these Terms.</p>

<h3>Intellectual Property</h3>
<p>The app and its original content, features, and functionality are owned by Strongmoon Labs and are protected by international copyright laws.</p>

<h3>Limitation of Liability</h3>
<p>Strongmoon Labs shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the app.</p>

<h3>Contact Us</h3>
<p>If you have any questions about these Terms, please contact us at: hello@strongmoonlabs.com</p>`,

  support: `<h2>Support</h2>
<p>We're here to help! If you're experiencing any issues with the app or have questions, please reach out to us.</p>

<h3>Contact Support</h3>
<p>Email: <a href="mailto:hello@strongmoonlabs.com">hello@strongmoonlabs.com</a></p>
<p>We typically respond within 24–48 hours.</p>

<h3>Frequently Asked Questions</h3>

<h4>How do I reset my password?</h4>
<p>Tap "Forgot Password" on the login screen and follow the instructions sent to your email.</p>

<h4>How do I delete my account?</h4>
<p>Go to Settings → Account → Delete Account. Please note this action is irreversible.</p>

<h4>I found a bug. What should I do?</h4>
<p>Please email us with a description of the issue and your device model. Screenshots are very helpful!</p>`,
}

export default function AppPageEditor({ appId, type, defaultTitle, defaultContent }: AppPageEditorProps) {
  const router = useRouter()
  const [title, setTitle] = useState(defaultTitle)
  const [content, setContent] = useState(defaultContent)
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [preview, setPreview] = useState(false)

  const loadTemplate = () => {
    if (content && !confirm('Replace current content with template?')) return
    setContent(TEMPLATES[type] || '')
  }

  const save = async () => {
    setStatus('saving')
    try {
      const res = await fetch(`/api/admin/apps/${appId}/pages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, title, content }),
      })
      if (!res.ok) throw new Error()
      setStatus('saved')
      router.refresh()
      setTimeout(() => setStatus('idle'), 2500)
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="space-y-4">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Page Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl border border-border bg-muted/30 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60 transition-all"
        />
      </div>

      {/* Content editor */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-sm font-medium text-foreground">
            Content <span className="text-muted-foreground font-normal">(HTML)</span>
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={loadTemplate}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              Load template
            </button>
            <button
              onClick={() => setPreview(!preview)}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              {preview ? 'Edit' : 'Preview'}
            </button>
          </div>
        </div>

        {preview ? (
          <div
            className="min-h-64 p-4 rounded-xl border border-border bg-card prose prose-sm dark:prose-invert max-w-none text-foreground"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          <textarea
            rows={20}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write HTML content here, or click 'Load template' to start with a pre-made template..."
            className="w-full px-3 py-2.5 rounded-xl border border-border bg-muted/30 text-foreground text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60 transition-all resize-none"
          />
        )}
        <p className="text-xs text-muted-foreground mt-1">
          You can use HTML tags: &lt;h2&gt;, &lt;h3&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;a&gt;, &lt;strong&gt;
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button onClick={save} loading={status === 'saving'}>
          {status === 'saving' ? 'Saving...' : 'Save Page'}
        </Button>

        {status === 'saved' && (
          <span className="flex items-center gap-1.5 text-sm text-emerald-400">
            <CheckCircle2 className="w-4 h-4" /> Saved!
          </span>
        )}
        {status === 'error' && (
          <span className="flex items-center gap-1.5 text-sm text-red-400">
            <AlertCircle className="w-4 h-4" /> Failed to save
          </span>
        )}
      </div>
    </div>
  )
}
