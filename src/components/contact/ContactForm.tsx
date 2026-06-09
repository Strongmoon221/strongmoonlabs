'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { CheckCircle2, AlertCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface FormData {
  name: string
  email: string
  subject?: string
  message: string
}

function InputField({
  label,
  error,
  required,
  children,
}: {
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs text-red-400 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  )
}

const inputClass =
  'w-full px-4 py-3 rounded-xl border border-border bg-muted/30 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60 transition-all'

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || 'Failed to send message')
      }

      setStatus('success')
      reset()
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8 text-emerald-400" />
        </div>
        <h3 className="font-heading font-semibold text-xl text-foreground mb-2">
          Message sent!
        </h3>
        <p className="text-muted-foreground text-sm mb-6">
          Thanks for reaching out. We&apos;ll get back to you within 24 hours.
        </p>
        <Button variant="outline" size="sm" onClick={() => setStatus('idle')}>
          Send another message
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <InputField label="Your Name" error={errors.name?.message} required>
          <input
            type="text"
            placeholder="John Smith"
            className={cn(inputClass, errors.name && 'border-red-500/50 focus:ring-red-500/30')}
            {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Too short' } })}
          />
        </InputField>
        <InputField label="Email Address" error={errors.email?.message} required>
          <input
            type="email"
            placeholder="john@company.com"
            className={cn(inputClass, errors.email && 'border-red-500/50 focus:ring-red-500/30')}
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
            })}
          />
        </InputField>
      </div>

      <InputField label="Subject" error={errors.subject?.message}>
        <input
          type="text"
          placeholder="What's your project about?"
          className={inputClass}
          {...register('subject')}
        />
      </InputField>

      <InputField label="Message" error={errors.message?.message} required>
        <textarea
          rows={5}
          placeholder="Tell us about your project — what you're building, what you need, and any relevant context or timeline..."
          className={cn(
            inputClass,
            'resize-none',
            errors.message && 'border-red-500/50 focus:ring-red-500/30'
          )}
          {...register('message', {
            required: 'Message is required',
            minLength: { value: 20, message: 'Please provide more detail (at least 20 characters)' },
          })}
        />
      </InputField>

      {status === 'error' && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {errorMsg || 'Something went wrong. Please try again or email us directly.'}
        </div>
      )}

      <Button
        type="submit"
        loading={status === 'loading'}
        className="w-full"
        size="lg"
      >
        {status === 'loading' ? 'Sending...' : 'Send Message'}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        By submitting, you agree to our privacy policy. We never share your data.
      </p>
    </form>
  )
}
