# FitCoach - Fitness & Nutrition Coaching Platform

Production-ready, mobile-first fitness coaching SaaS application built with Next.js, TypeScript, Supabase, and TailwindCSS.

## Features

### For Students
- ✅ Calorie and macro tracking
- ✅ Meal logging with nutrition analysis
- ✅ Fitness log and workout tracking
- ✅ Body measurements and progress charts
- ✅ Community forum with real-time chat
- ✅ Privacy settings and coach requests
- ✅ Mobile-first responsive design

### For Coaches
- ✅ Professional dashboard
- ✅ Student management and requests
- ✅ Nutrition plan creation and management
- ✅ Fitness program design
- ✅ Student notes and progress tracking
- ✅ Role-based access control

## Technology Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS
- **Backend**: Supabase (PostgreSQL, Auth, Realtime, Storage)
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod
- **PWA**: next-pwa
- **Icons**: Lucide React
- **Toast**: React Hot Toast

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account and project

## Quick Start

### 1. Clone and Install

```bash
cd fitness-coach-app
npm install
```

### 2. Environment Variables

Create `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Setup

1. Go to your Supabase project SQL Editor
2. Copy and paste the entire content of `supabase_schema.sql`
3. Run the script to create all tables, policies, and functions

### 4. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Project Structure

```
fitness-coach-app/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── dashboard/         # Student dashboard
│   ├── nutrition/         # Meal tracking
│   ├── fitness/           # Workout tracking
│   ├── measurements/      # Body measurements
│   ├── forum/             # Community chat
│   ├── settings/          # User settings
│   └── coach/             # Coach dashboard
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── layout/           # Layout components
├── lib/                   # Utilities and configurations
│   ├── hooks/            # Custom React hooks
│   ├── providers/        # Context providers
│   ├── supabase/         # Supabase clients
│   ├── types/            # TypeScript types
│   └── utils/            # Utility functions
├── public/               # Static assets
│   ├── icons/            # PWA icons
│   └── manifest.json     # PWA manifest
├── supabase_schema.sql   # Database schema
├── package.json
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── vercel.json
```

## Deployment

### Vercel Deployment

1. **Connect Repository**
   - Go to [Vercel](https://vercel.com)
   - Import your Git repository

2. **Configure Environment Variables**
   - Add `NEXT_PUBLIC_SUPABASE_URL`
   - Add `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. **Deploy**
   - Vercel will automatically build and deploy
   - Your app will be live at `https://your-app.vercel.app`

### Manual Build

```bash
npm run build
npm start
```

## Supabase Configuration

### Authentication Settings

1. Go to Authentication > Settings
2. Enable Email confirmations if needed
3. Configure SMTP settings for email delivery

### Storage Settings

1. Create a bucket named `avatars`
2. Set public access policies
3. Configure file size limits

### Realtime Settings

All tables have RLS enabled with appropriate policies for:
- User authentication
- Role-based access
- Data privacy

## Demo Accounts

After database setup, you can use these demo accounts:

### Student Account
- Email: `student@demo.com`
- Password: `demo123`

### Coach Account  
- Email: `coach@demo.com`
- Password: `demo123`

## Mobile App Conversion (Median.co)

This PWA is ready for APK conversion:

1. Build the project: `npm run build`
2. Go to [Median.co](https://median.co)
3. Enter your deployed URL
4. Configure app settings
5. Generate APK

### PWA Features
- ✅ Offline support
- ✅ App-like interface
- ✅ Push notifications ready
- ✅ Home screen installation
- ✅ Native app feel

## API Routes

The app includes these API endpoints:

- `POST /api/coach-requests` - Send coach requests
- `GET /api/health` - Health check
- Add more as needed...

## Customization

### Theme Colors
Update colors in `tailwind.config.js`:

```js
colors: {
  primary: {
    50: '#eff6ff',
    600: '#3b82f6',
    // ... more shades
  }
}
```

### Components
All UI components are in `/components/ui/` and use TailwindCSS classes.

### Database Schema
Modify `supabase_schema.sql` and run in Supabase SQL Editor.

## Security Features

- ✅ Row Level Security (RLS) on all tables
- ✅ Role-based access control
- ✅ Input validation with Zod
- ✅ XSS protection
- ✅ CSRF protection
- ✅ Rate limiting ready

## Performance Optimizations

- ✅ Code splitting with Next.js
- ✅ Image optimization
- ✅ Lazy loading
- ✅ Service worker caching
- ✅ Bundle optimization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Check the documentation
- Create an issue on GitHub
- Contact support@fitcoach.com

---

**Built with ❤️ by FitCoach Team**# Koc
