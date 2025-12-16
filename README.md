# Cheqa React - Expense Tracker

A modern React/Next.js expense tracking application built with TypeScript, Tailwind CSS, and Prisma.

## Features

- **Dashboard**: Overview of total expenses, monthly expenses, and analytics
- **Expense Management**: Full CRUD operations for expenses with filtering
- **Category Management**: Organize expenses into categories
- **Payment Method Management**: Track different payment methods
- **Search & Filter**: Search expenses and filter by date ranges
- **Responsive Design**: Tailwind CSS responsive interface
- **TypeScript**: Full type safety throughout the application

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite with Prisma ORM
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation

## Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url> cheqa-react
cd cheqa-react
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed the database (optional)
npx prisma db seed
```

### 4. Start Development Server

```bash
npm run dev
```

Access the application at: http://localhost:3000

## Project Structure

```
cheqa-react/
├── src/
│   ├── app/
│   │   ├── expenses/
│   │   │   ├── create/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── categories/
│   │   ├── payment-methods/
│   │   └── page.tsx (Dashboard)
│   ├── lib/
│   │   └── prisma.ts
│   └── components/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
└── prisma.config.ts
```

## Database Schema

### Users Table
- `id` (String, Primary Key)
- `email` (String, Unique)
- `name` (String, Optional)
- `createdAt`, `updatedAt` (DateTime)

### Categories Table
- `id` (String, Primary Key)
- `name` (String)
- `createdAt`, `updatedAt` (DateTime)

### Payment Methods Table
- `id` (String, Primary Key)
- `name` (String)
- `createdAt`, `updatedAt` (DateTime)

### Expenses Table
- `id` (String, Primary Key)
- `description` (String)
- `amount` (Float)
- `expenseDate` (DateTime)
- `userId` (String, Foreign Key)
- `categoryId` (String, Foreign Key)
- `paymentMethodId` (String, Foreign Key)
- `createdAt`, `updatedAt` (DateTime)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio (database GUI)
- `npx prisma migrate dev` - Run database migrations

## Deployment

The application can be deployed to:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **Railway**
- **AWS Amplify**

## License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).