# 🎯 Event Guest Management Application

Full-stack application for managing event guests with real-time statistics, advanced filtering, and export capabilities.

## 🏗️ Project Structure

```
guests-app/
├── frontend/          # React + Vite + TailwindCSS
│   ├── api/          # API services
│   ├── lib/          # Configurations (Query Client, Axios)
│   ├── components/   # React components
│   ├── hooks/        # Custom hooks
│   ├── stores/       # Zustand stores
│   └── utils/        # Utility functions
│
├── backend/          # NestJS + Prisma + PostgreSQL + Redis
│   ├── src/
│   │   ├── guests/   # Guests module
│   │   ├── exports/  # Export module (CSV/PDF)
│   │   ├── cache/    # Redis cache module
│   │   └── prisma/   # Prisma service
│   └── prisma/       # Database schema & migrations
│
└── docs/             # Documentation
```

## 🚀 Tech Stack

### Frontend
- **React 19** - UI library
- **TypeScript 5.8** - Type safety
- **Vite 6** - Build tool & dev server
- **TailwindCSS 4** - Utility-first CSS (OKLCH color space)
- **shadcn/ui** - Accessible component library (13 components)
- **TanStack Query v5** - Data fetching, caching & synchronization
- **Zustand 5** - Lightweight state management
- **react-hook-form** - Form validation & management
- **Zod** - TypeScript-first schema validation
- **Axios** - HTTP client
- **Sonner** - Toast notifications
- **Lucide React** - Icon library

### Backend
- **NestJS 11** - Progressive Node.js framework
- **Prisma 6** - Next-generation ORM
- **Neon PostgreSQL** - Serverless database
- **Redis 7** - In-memory cache layer
- **TypeScript** - Type safety
- **class-validator** - DTO validation
- **class-transformer** - Object transformation

## 📋 Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Docker** (for Redis)
- **PostgreSQL** (Neon account or local)

## 🛠️ Installation

### 1. Clone the repository
```bash
git clone https://github.com/Solideomyers/guests-app.git
cd guests-app
```

### 2. Install all dependencies
```bash
npm run install:all
```

### 3. Setup Backend Environment
```bash
cd backend
cp .env.example .env
```

Edit `.env` with your credentials:
```env
DATABASE_URL="postgresql://..."
REDIS_HOST=localhost
REDIS_PORT=6379
PORT=3000
```

### 4. Setup Frontend Environment
```bash
cd frontend
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:3000/api/v1
```

### 5. Start Redis (Docker)
```bash
cd backend
docker-compose up -d
```

### 6. Run Database Migrations
```bash
cd backend
npx prisma migrate dev
npx prisma db seed  # Optional: seed with sample data
```

## 🏃 Running the Application

### Development Mode (All services)
```bash
npm run dev
```

This starts:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Redis: localhost:6379

### Individual Services

**Frontend only:**
```bash
npm run dev:frontend
```

**Backend only:**
```bash
npm run dev:backend
```

## 📦 Build for Production

```bash
npm run build
```

Or individually:
```bash
npm run build:frontend
npm run build:backend
```

## 🎯 Features

### ✅ Implemented (Production Ready)

#### Data Management
- ✅ Complete CRUD for guests
- ✅ **Combined Filters** (v1.1.2) - Multi-criteria filtering with AND logic
  - Filter by Search, Status, Pastor, Church, and City simultaneously
  - Visual badges showing active filters with individual removal
  - "Limpiar todos" button for quick reset
- ✅ Advanced filtering & search
- ✅ Pagination & sorting
- ✅ Bulk operations (status update, delete)
- ✅ Soft delete with audit trail
- ✅ Guest statistics dashboard
- ✅ Audit history tracking
- ✅ Export to CSV/PDF with dropdown menu (mobile-optimized)

#### Performance & Caching
- ✅ Redis caching for performance
- ✅ TanStack Query client-side caching
- ✅ Optimistic updates
- ✅ Cache invalidation strategies
- ✅ Bundle optimization (6 chunks, ~206KB largest)

#### User Experience
- ✅ **Dark Matter OKLCH Theme** - Modern, vibrant color palette
- ✅ **3-Mode Theme System** (v1.1.0) - Light/Dark/System with smooth transitions
- ✅ **Mobile-First Design** (v1.1.0)
  - Card-based layout for mobile viewports
  - Touch-optimized interactions (≥44px targets)
  - Responsive breakpoints with adaptive UI
- ✅ **Combined Filters** (v1.1.2)
  - Multi-criteria filtering (Pastor, Church, City)
  - ActiveFiltersBadges component with visual feedback
  - AdditionalFilters component with 3 dropdowns
- ✅ **Mobile UX Refinements** (v1.1.1)
  - Responsive BulkActionsToolbar with stacked layout
  - Theme toggle tooltip with visual feedback
  - DeleteConfirmDialog on mobile guest cards
  - ScrollToTopButton with 48px sizing and animations
  - Smooth theme transitions (0.3s ease)
- ✅ **Form Validations** - Real-time with react-hook-form + Zod
- ✅ **Preview Confirmation** - 2-step process before saving
- ✅ **Avatar System** - Initials-based with 12 themed colors
- ✅ **Keyboard Shortcuts** - Ctrl+N (add), Escape (close)
- ✅ **Custom Scrollbar** - Themed for consistency
- ✅ **CTA Banner** - Conditional smart prompts
- ✅ **Toast Notifications** - User feedback with Sonner
- ✅ **Empty States** - Helpful prompts when no data
- ✅ **Loading Skeletons** - Smooth loading experience
- ✅ **Error Boundaries** - Graceful error handling

#### Design System
- ✅ **shadcn/ui Components** - 13 accessible components
- ✅ **Visual Hierarchy** - Opacity, bold, scale, grouping
- ✅ **Confirmation Dialogs** - Safe destructive actions
- ✅ **WCAG AA Compliance** - Accessible to all users
- ✅ **Touch-Friendly** - Minimum 44px touch targets

### 📋 Roadmap

#### Testing (High Priority)
- [ ] Backend unit tests (Jest)
- [ ] Backend E2E tests (Supertest)
- [ ] Frontend component tests (Vitest)
- [ ] Coverage > 70%

#### Security (Critical for Production)
- [ ] HTTPS configuration (see HTTPS_SECURITY.md)
- [ ] Security headers
- [ ] Environment variables audit
- [ ] Penetration testing

#### Deployment
## 📖 Documentation

### 📦 Release History

#### v1.1.2 - Combined Filters (October 23, 2025) ⭐ **LATEST**
- **Combined Filters System** - Multi-criteria filtering with AND logic
- **ActiveFiltersBadges** - Visual badges showing active filters with removal
- **Enhanced AdditionalFilters** - 3 filter dropdowns (Pastor, Church, City)
- **Hotfix**: Fixed Radix UI SelectItem empty value error
- [Full Release Notes](RELEASE_NOTES_v1.1.2.md) | [GitHub Release](https://github.com/Solideomyers/guests-app/releases/tag/v1.1.2)

#### v1.1.1 - Mobile UX Refinements (October 23, 2025)
- Responsive BulkActionsToolbar with stacked layout on mobile
- Theme toggle tooltip with visual feedback (UX principle #6)
- DeleteConfirmDialog integration in mobile guest cards
- ScrollToTopButton mobile styling (48px, rounded, 16px positioning)
- Smooth theme transitions (0.3s ease animations)
- [GitHub Release](https://github.com/Solideomyers/guests-app/releases/tag/v1.1.1)

#### v1.1.0 - Mobile UX Improvements (October 23, 2025)
- GuestCard component for mobile-optimized guest view
- ExportMenu dropdown for unified CSV/PDF export
- useMediaQuery hook for responsive detection
- 3-mode theme system (light/dark/system)
- Better touch targets and mobile spacing
- [GitHub Release](https://github.com/Solideomyers/guests-app/releases/tag/v1.1.0)

#### v1.0.0 - Initial Production Release (October 2025)
- Full-stack deployment (Vercel + Render)
- PostgreSQL (Neon) + Redis (Upstash)
- Complete CRUD, caching, exports
- Dark Matter OKLCH theme
- [GitHub Release](https://github.com/Solideomyers/guests-app/releases/tag/v1.0.0)

### Comprehensive Guides
- [Frontend README](frontend/README.md) - Frontend architecture & components
- [Backend Cache](backend/src/cache/README.md) - Redis caching strategies
- [Backend Exports](backend/src/exports/README.md) - Export module (CSV/PDF)
- [Backend Guests](backend/src/guests/README.md) - Guests API documentation

### Implementation Summaries
- [Plan de Mejoras](PLAN_IMPROVE.md) - Complete implementation roadmap
- [Phase 2.5 Summary](PHASE_2.5_SUMMARY.md) - shadcn/ui migration
- [Phase 2.6 Summary](PHASE_2.6_SUMMARY.md) - UX improvements & validations
- [TypeScript Fixes](TYPESCRIPT_FIXES.md) - TS migration details
- [Best Practices](BEST_PRACTICES.md) - Code standards

### Configuration & Security
- [HTTPS Security](HTTPS_SECURITY.md) - Production HTTPS setup (REQUIRED)
- [Dashboard Design System](frontend/dashboard_design_system.md) - Design tokens
- [Forms UI Guide](frontend/forms_ui_guide.md) - Form patterns
- [**UI/UX Principles**](UI_UX_PRINCIPLES.md) - Complete 12 principles guide with implementation examples

### UX Principles Implemented
Based on uidesign.tips methodology - **[See full documentation →](UI_UX_PRINCIPLES.md)**

12 core principles with 95%+ coverage:
- **#1-2:** Confirmation before destructive actions ✅
- **#3:** Empty states with clear CTAs ✅
- **#4:** Specific button labels ✅
- **#5:** Preventive validation (onChange) ✅
- **#6:** Immediate visual feedback ✅
- **#7:** Progressive disclosure ✅
- **#8:** Touch optimization (≥44px) ✅
- **#9:** Visual preview confirmation ✅
- **#10:** Contextual CTAs ✅
- **#11:** Keyboard shortcuts ✅
- **#12:** Visual hierarchy ✅
Backend exposes a REST API at `/api/v1`:

### Guests Endpoints
- `GET /guests` - List guests (with filters & pagination)
- `GET /guests/:id` - Get guest details
- `POST /guests` - Create guest
- `PATCH /guests/:id` - Update guest
- `DELETE /guests/:id` - Delete guest (soft)
- `GET /guests/stats` - Get statistics
- `GET /guests/history` - Audit history
- `POST /guests/bulk/status` - Bulk status update
- `POST /guests/bulk/delete` - Bulk delete

### Export Endpoints
- `POST /exports/csv` - Export to CSV
- `POST /exports/pdf` - Export to PDF

## 🧪 Testing

```bash
# Backend tests
cd backend
npm run test
npm run test:e2e

# Frontend tests (coming soon)
cd frontend
npm run test
```

## 📖 Documentation

- [Frontend README](frontend/README.md) - Frontend architecture
- [Backend Cache](backend/src/cache/README.md) - Redis caching
- [Backend Exports](backend/src/exports/README.md) - Export module
- [Backend Guests](backend/src/guests/README.md) - Guests API
- [Plan de Mejoras](PLAN_IMPROVE.md) - Implementation roadmap
- [HTTPS Security](HTTPS_SECURITY.md) - Security configuration for production

## ⚠️ Known Development Warnings

### HTTPS Warning on Exports

During local development, you may see this warning in the browser console when exporting PDFs:

```
The file at 'blob:http://...' was loaded over an insecure connection. 
This file should be served over HTTPS.
```

**This is expected behavior in development and can be safely ignored.** The warning appears because:
- The app runs on `http://` (not `https://`) in local development
- Blob URLs used for downloads trigger browser security warnings
- No data is exposed or at risk in your local environment

**For production deployment**, HTTPS **MUST** be configured. See [HTTPS_SECURITY.md](HTTPS_SECURITY.md) for complete setup instructions.

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines first.

## 📝 License

MIT License - see LICENSE file for details

## 👨‍💻 Author

**Solideomyers**
- GitHub: [@Solideomyers](https://github.com/Solideomyers)

---

Made with ❤️ using NestJS + React
