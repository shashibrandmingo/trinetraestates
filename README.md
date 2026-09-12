# Office Space Noida - Full-Stack Architecture

A production-grade, high-performance, and SEO-optimized full-stack project with separated `frontend` and `backend` directories.

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express (ESM)
- **Database**: MongoDB (Mongoose ODM)
- **Media & Storage**: Cloudinary SDK (Direct upload / delete utilities)
- **Performance & SEO**: Native Next.js metadata, dynamic sitemap & robots, Google Ads script optimization strategy (`afterInteractive` + preconnect hints).

---

## Project Structure

```text
Office Space Noida/
├── backend/
│   ├── .env.example
│   ├── package.json
│   └── src/
│       ├── config/
│       │   ├── env.js                # Strict environment variable validation
│       │   ├── db.js                 # MongoDB connection & pool management
│       │   └── cloudinary.js         # Cloudinary SDK configuration
│       ├── controllers/
│       │   └── health.controller.js  # Sample health check controller
│       ├── middleware/
│       │   └── errorHandler.js       # Centralized 404 & error handlers
│       ├── models/
│       │   └── OfficeSpace.js        # Mongoose schema example
│       ├── routes/
│       │   ├── health.routes.js      # Health endpoints
│       │   └── index.js              # Centralized route mount
│       ├── services/
│       │   └── cloudinary.service.js # Cloudinary upload & delete helpers
│       └── server.js                 # Express entry point
│
└── frontend/
    ├── .env.example
    ├── next.config.mjs               # Performance & image optimizations
    ├── package.json
    ├── tailwind.config.ts            # Tailwind CSS configuration
    ├── tsconfig.json
    └── src/
        ├── app/
        │   ├── globals.css           # Tailwind base styles
        │   ├── layout.tsx            # SEO metadata, font config, Ads script strategy
        │   ├── page.tsx              # Minimal clean starter page
        │   ├── robots.ts             # Dynamic robots.txt
        │   └── sitemap.ts            # Dynamic sitemap.xml
        ├── config/
        │   └── env.ts                # Strict env validation (no localhost fallbacks)
        ├── lib/
        │   └── apiClient.ts          # Centralized Axios client with interceptors
        └── services/
            └── api/
                ├── endpoints.ts      # Centralized API endpoints registry
                └── healthService.ts  # Health check service example
```

---

## Environment Setup Rules

1. **Strict Environment Enforcement**: There are **zero** hardcoded localhost fallback strings (like `|| 'http://localhost'`). All configurations are read strictly from `.env` files.
2. If any required environment variable is missing, the application will immediately raise a descriptive configuration error.

### Backend `.env`
Copy `backend/.env.example` to `backend/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_ORIGIN=http://localhost:3000
```

### Frontend `.env.local`
Copy `frontend/.env.example` to `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_ADS_CLIENT_ID=ca-pub-0000000000000000
```

---

## Running Locally

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```
