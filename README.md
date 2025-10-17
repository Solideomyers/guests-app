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
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **TanStack Query** - Data fetching & caching
- **Zustand** - State management
- **Axios** - HTTP client
- **Sonner** - Toast notifications

### Backend
- **NestJS 11** - Framework
- **Prisma 6** - ORM
- **Neon PostgreSQL** - Database (serverless)
- **Redis 7** - Cache layer
- **TypeScript** - Type safety

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

### ✅ Implemented
- ✅ Complete CRUD for guests
- ✅ Advanced filtering & search
- ✅ Pagination & sorting
- ✅ Bulk operations (status update, delete)
- ✅ Guest statistics dashboard
- ✅ Audit history tracking
- ✅ Export to CSV/PDF
- ✅ Redis caching for performance
- ✅ Real-time updates
- ✅ Responsive design

### 🚧 In Progress
- 🔄 Custom hooks with TanStack Query
- 🔄 Zustand state management
- 🔄 Component refactoring
- 🔄 Optimistic updates

### 📋 Planned
- Performance optimizations
- Testing (unit + e2e)
- Documentation
- Deployment (Vercel + Railway)

## 📚 API Documentation

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

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines first.

## 📝 License

MIT License - see LICENSE file for details

## 👨‍💻 Author

**Solideomyers**
- GitHub: [@Solideomyers](https://github.com/Solideomyers)

---

Made with ❤️ using NestJS + React
