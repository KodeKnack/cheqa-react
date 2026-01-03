# Cheqa React - Expense Tracker

A modern, mobile-responsive React/Next.js expense tracking application built with TypeScript, Tailwind CSS, and PostgreSQL.

## 🚀 Live Demo

**Production App**: [https://cheqa-react.vercel.app](https://cheqa-react.vercel.app)

## ✨ Features

- **📊 Dashboard**: Overview of total expenses, monthly expenses, and analytics
- **💰 Expense Management**: Full CRUD operations for expenses with filtering
- **🏷️ Category Management**: Organize expenses into categories
- **💳 Payment Method Management**: Track different payment methods
- **🔍 Search & Filter**: Search expenses and filter by date ranges
- **📱 Mobile Responsive**: Optimized for all device sizes with bottom navigation
- **🎨 Modern UI**: Clean, intuitive interface with Tailwind CSS
- **🔒 Authentication**: Secure JWT-based user authentication
- **📈 Analytics**: Visual charts and spending insights
- **⚡ Real-time Updates**: Instant UI updates with optimistic rendering

## 🛠️ Tech Stack

### **Frontend**
- **Next.js 16.0.10** - React framework with App Router
- **React 19.2.1** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Recharts** - Data visualization
- **Zustand** - State management
- **React Hook Form + Zod** - Form handling and validation

### **Backend**
- **Next.js API Routes** - Serverless API endpoints
- **Prisma ORM 5.20.0** - Database ORM
- **PostgreSQL** - Production database (Neon)
- **JWT Authentication** - Secure user sessions
- **bcryptjs** - Password hashing

### **Deployment & Infrastructure**
- **Vercel** - Hosting and deployment
- **Neon Database** - Serverless PostgreSQL
- **GitHub** - Version control

## 📱 Mobile Features

- **Bottom Navigation**: Easy thumb navigation on mobile
- **Responsive Design**: Adapts to all screen sizes
- **Touch Optimized**: 44px minimum touch targets
- **Mobile Forms**: Single-column layouts for better UX
- **Swipe Gestures**: Natural mobile interactions

## 🏗️ Project Structure

```
cheqa-react/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── categories/    # Category CRUD
│   │   │   ├── expenses/      # Expense CRUD
│   │   │   └── payment-methods/ # Payment method CRUD
│   │   ├── auth/              # Auth pages
│   │   ├── categories/        # Category management
│   │   ├── expenses/          # Expense management
│   │   ├── payment-methods/   # Payment method management
│   │   └── globals.css        # Global styles
│   ├── components/            # Reusable components
│   │   ├── Footer.tsx         # App footer
│   │   ├── MobileNav.tsx      # Mobile navigation
│   │   └── ...                # Other components
│   └── lib/                   # Utilities
│       ├── auth.ts            # Authentication logic
│       ├── prisma.ts          # Database client
│       └── store.ts           # Zustand store
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Database seeding
└── ...
```

## 🗄️ Database Schema

### Users
- `id` (String, Primary Key)
- `email` (String, Unique)
- `password` (String, Hashed)
- `name` (String, Optional)
- `createdAt`, `updatedAt` (DateTime)

### Categories
- `id` (String, Primary Key)
- `name` (String)
- `createdAt`, `updatedAt` (DateTime)

### Payment Methods
- `id` (String, Primary Key)
- `name` (String)
- `createdAt`, `updatedAt` (DateTime)

### Expenses
- `id` (String, Primary Key)
- `description` (String)
- `amount` (Float)
- `expenseDate` (DateTime)
- `userId` (String, Foreign Key)
- `categoryId` (String, Foreign Key)
- `paymentMethodId` (String, Foreign Key)
- `createdAt`, `updatedAt` (DateTime)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL database (or use Neon)

### 1. Clone the Repository

```bash
git clone https://github.com/KodeKnack/cheqa-react.git
cd cheqa-react
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create `.env` file:

```env
# Database
DATABASE_URL="your-postgresql-connection-string"

# Authentication
JWT_SECRET="your-super-secret-jwt-key"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-random-secret"
```

### 4. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# Seed database (optional)
npx prisma db seed
```

### 5. Start Development Server

```bash
npm run dev
```

Access the application at: [http://localhost:3000](http://localhost:3000)

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio (database GUI)
- `npx prisma db push` - Push schema changes to database

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Expenses
- `GET /api/expenses` - List all expenses
- `POST /api/expenses` - Create expense
- `PUT /api/expenses/[id]` - Update expense
- `DELETE /api/expenses/[id]` - Delete expense

### Categories
- `GET /api/categories` - List all categories
- `POST /api/categories` - Create category
- `PUT /api/categories/[id]` - Update category
- `DELETE /api/categories/[id]` - Delete category

### Payment Methods
- `GET /api/payment-methods` - List all payment methods
- `POST /api/payment-methods` - Create payment method
- `PUT /api/payment-methods/[id]` - Update payment method
- `DELETE /api/payment-methods/[id]` - Delete payment method

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect to Vercel**:
   ```bash
   npm i -g vercel
   vercel login
   vercel link
   ```

2. **Set up Neon Database**:
   - Create database in Vercel dashboard
   - Environment variables are auto-configured

3. **Deploy**:
   ```bash
   vercel --prod
   ```

4. **Run Database Migration**:
   ```bash
   npx prisma db push
   ```

### Other Platforms
- **Netlify** - Static site deployment
- **Railway** - Full-stack deployment
- **AWS Amplify** - AWS deployment

## 🔒 Security Features

- **JWT Authentication** - Secure user sessions
- **Password Hashing** - bcryptjs encryption
- **Input Validation** - Zod schema validation
- **CSRF Protection** - Built-in Next.js protection
- **Environment Variables** - Secure configuration

## 📊 Performance

- **Server-Side Rendering** - Fast initial page loads
- **Static Generation** - Optimized static pages
- **Image Optimization** - Next.js automatic optimization
- **Code Splitting** - Automatic bundle optimization
- **Caching** - Efficient data caching strategies

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**KodeKnack** - *Full Stack Development*

- Website: [KodeKnack](https://kodeknack.com)
- GitHub: [@KodeKnack](https://github.com/KodeKnack)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for seamless deployment
- Tailwind CSS for beautiful styling
- Prisma for excellent database tooling

---

© 2025 KodeKnack. All rights reserved.