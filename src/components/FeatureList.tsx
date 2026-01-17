import { BarChart3, CheckCircle2, CreditCard, Smartphone } from 'lucide-react'

const features = [
  {
    icon: CheckCircle2,
    title: 'Real-time expense tracking',
    description: 'Log spending the moment it happens and stay in control.'
  },
  {
    icon: BarChart3,
    title: 'Visual analytics & insights',
    description: 'Spot trends fast with crisp charts and summaries.'
  },
  {
    icon: CreditCard,
    title: 'Category & payment methods',
    description: 'Organize spending your way for cleaner reporting.'
  },
  {
    icon: Smartphone,
    title: 'Mobile-first experience',
    description: 'Built for quick entry on the go with touch-friendly layouts.'
  }
]

export default function FeatureList() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {features.map((feature) => (
        <div key={feature.title} className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm">
            <feature.icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{feature.title}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
