import Link from 'next/link'
import { ArrowRight, BarChart4, CreditCard, Wallet } from 'lucide-react'
import CTAButtons from './CTAButtons'
import FeatureList from './FeatureList'
import ThemeToggle from './ThemeToggle'

export default function HeroSection() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      <div className="pointer-events-none absolute -top-32 right-0 h-96 w-96 rounded-full bg-blue-600/15 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />

      <header className="sticky top-0 z-20 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100">
            Cheqa
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/auth/signin"
              className="text-sm font-semibold text-gray-600 dark:text-gray-400 transition-colors hover:text-gray-900 dark:text-gray-100"
            >
              Sign In
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-12 px-4 pb-16 pt-16 sm:px-6 lg:grid-cols-[1.3fr_1fr] lg:px-8 lg:pt-24">
        <section className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/70 px-4 py-1 text-xs font-semibold text-gray-600 dark:text-gray-400 shadow-sm">
            Built for South African households
            <ArrowRight className="h-3 w-3" />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl lg:text-6xl">
              Track Every Rand, Reach Every Goal
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 sm:text-xl">
              A beautiful, intuitive expense tracker built for South Africans. Track spending, manage
              budgets, and move toward your financial goals with clarity.
            </p>
          </div>
          <CTAButtons />
          <FeatureList />
        </section>

        <section className="relative">
          <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 p-6 shadow-sm backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                  Cheqa Snapshot
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">Monthly Overview</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                Live updates
              </div>
            </div>

            <div className="mt-6 grid gap-4">
              <div className="rounded-2xl bg-blue-600 p-4 text-white">
                <p className="text-xs uppercase tracking-wider text-white/80">Total spend</p>
                <p className="text-2xl font-semibold">R 12,480.00</p>
                <p className="mt-2 text-xs text-white/80">Down 12% from last month</p>
              </div>

              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-4 shadow-sm">
                  <BarChart4 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <p className="mt-2 font-semibold text-gray-900 dark:text-gray-100">Analytics</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Charts & trends</p>
                </div>
                <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-4 shadow-sm">
                  <Wallet className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <p className="mt-2 font-semibold text-gray-900 dark:text-gray-100">Budgets</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Smart limits</p>
                </div>
                <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-4 shadow-sm">
                  <CreditCard className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <p className="mt-2 font-semibold text-gray-900 dark:text-gray-100">Cards</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Linked methods</p>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-4 shadow-sm">
                <div className="flex items-center justify-between text-sm font-semibold text-gray-900 dark:text-gray-100">
                  <span>Top categories</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Last 30 days</span>
                </div>
                <div className="mt-4 space-y-3 text-sm">
                  {[
                    { label: 'Groceries', value: 'R 3,120', width: 'w-4/5' },
                    { label: 'Transport', value: 'R 1,850', width: 'w-2/3' },
                    { label: 'Utilities', value: 'R 1,420', width: 'w-1/2' }
                  ].map((row) => (
                      <div key={row.label} className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                        <span>{row.label}</span>
                        <span>{row.value}</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                        <div className={`h-2 rounded-full bg-blue-600 ${row.width}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute -right-6 top-6 hidden flex-col gap-3 text-blue-600 dark:text-blue-400/60 sm:flex">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/80 dark:bg-gray-900/80 shadow-md animate-pulse">
              <Wallet className="h-5 w-5" />
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 dark:bg-gray-900/80 shadow-md animate-pulse">
              <CreditCard className="h-4 w-4" />
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/80 dark:bg-gray-900/80 shadow-md animate-pulse">
              <BarChart4 className="h-5 w-5" />
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
