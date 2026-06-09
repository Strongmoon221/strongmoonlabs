import Link from 'next/link'
import { ArrowLeft, SearchX } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-6">
          <SearchX className="w-10 h-10 text-muted-foreground" />
        </div>
        <h1 className="text-6xl font-bold font-heading gradient-text mb-4">404</h1>
        <h2 className="text-2xl font-heading font-semibold text-foreground mb-3">
          Page Not Found
        </h2>
        <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
          We couldn&apos;t find the page you&apos;re looking for. It may have been moved or deleted.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/25"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </div>
  )
}
