import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create categories
  const categories = [
    'Food & Dining',
    'Transportation',
    'Bills & Utilities',
    'Entertainment',
    'Shopping',
    'Healthcare',
    'Education',
    'Travel'
  ]

  for (const name of categories) {
    try {
      await prisma.category.create({ data: { name } })
    } catch {}
  }

  // Create payment methods
  const paymentMethods = [
    'Cash',
    'Credit Card',
    'Debit Card',
    'Bank Transfer',
    'Mobile Payment',
    'Cheque'
  ]

  for (const name of paymentMethods) {
    try {
      await prisma.paymentMethod.create({ data: { name } })
    } catch {}
  }



  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })