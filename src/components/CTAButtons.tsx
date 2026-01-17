import Link from 'next/link'

export default function CTAButtons() {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Link
        href="/auth/signup"
        className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Get Started Free
      </Link>
      <Link
        href="/auth/signin"
        className="inline-flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-6 py-3 text-sm font-semibold text-gray-900 dark:text-gray-100 shadow-sm transition-all duration-200 hover:bg-gray-50 dark:bg-gray-950 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Sign In
      </Link>
    </div>
  )
}
