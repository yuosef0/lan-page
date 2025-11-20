# Apex & Base Construction Portfolio Website

A full-stack portfolio website with an admin panel (CMS) for a construction company. Built with **Next.js**, **Supabase (PostgreSQL)**, and **Tailwind CSS**.

## 🎯 Features

### 🌐 Frontend (Portfolio Website)
- ✅ **Home Page** - Hero section with customizable feature cards
- ✅ **About Page** - Mission, values, principles, and team members
- ✅ **Services Page** - Dynamic service sections with alternating layouts
- ✅ **Contact Page** - Two forms (General & Vendor) with Google Maps integration
- ✅ Fully responsive design
- ✅ Dark mode support
- ✅ SEO-friendly

### 🔐 Admin Panel (CMS)
- ✅ Secure authentication with Supabase Auth
- ✅ Dashboard with statistics
- ✅ Manage all page content:
  - Home page hero & feature cards
  - About page sections
  - Services (add/edit/delete)
  - Team members (add/edit/delete)
  - Contact information & submissions
- ✅ Image storage with Supabase Storage
- ✅ User-friendly interface

### 🔧 Backend (Supabase)
- ✅ PostgreSQL database (Supabase)
- ✅ Row Level Security (RLS) policies
- ✅ Real-time subscriptions
- ✅ Supabase Auth for authentication
- ✅ Supabase Storage for images
- ✅ RESTful API auto-generated

---

## 📂 Project Structure

```
lan-page/
├── src/
│   ├── app/              # Pages (Next.js 14 App Router)
│   │   ├── page.tsx           # Home page
│   │   ├── about/             # About page
│   │   ├── services/          # Services page
│   │   ├── contact/           # Contact page
│   │   ├── admin/             # Admin panel
│   │   │   ├── login/         # Admin login
│   │   │   └── dashboard/     # Admin dashboard
│   │   ├── globals.css        # Global styles
│   │   └── layout.tsx         # Root layout
│   ├── components/        # Reusable components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── ClientLayout.tsx
│   │   └── admin/
│   ├── lib/               # Utilities & helpers
│   │   └── supabase.ts    # Supabase client
│   └── types/             # TypeScript types
│       └── database.ts    # Database types
│
├── supabase/
│   └── schema.sql         # Database schema
│
├── public/                # Static assets
├── package.json
└── README.md
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- Supabase Account (free tier available at https://supabase.com)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd lan-page
```

### 2. Setup Supabase

1. Create a new project on https://supabase.com
2. Go to **SQL Editor** and run the schema:
   - Copy contents of `supabase/schema.sql`
   - Paste and execute in SQL Editor
3. Go to **Settings > API** to get your credentials

### 3. Install Dependencies

```bash
npm install
```

### 4. Environment Setup

```bash
# Create .env.local file
cp .env.example .env.local

# Edit .env.local with your Supabase credentials
# NEXT_PUBLIC_SUPABASE_URL=your-project-url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
# SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 5. Create Admin User

Go to Supabase Dashboard → **Authentication** → **Add User**:
- Email: `admin@apexbase.com`
- Password: `Admin123!` (or your choice)

### 6. Run the Application

```bash
npm run dev
```

### 7. Access the Application

- **Portfolio Website**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin/login
- **Supabase Dashboard**: Your Supabase project URL

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@apexbase.com",
  "password": "Admin123!"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Home Page Endpoints

#### Get Home Page
```http
GET /api/home
```

#### Update Hero Section
```http
PUT /api/home/hero
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Beyond Construction",
  "subtitle": "Your subtitle here"
}
```

#### Add Feature Card
```http
POST /api/home/cards
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Card Title",
  "description": "Card description",
  "image": "https://example.com/image.jpg",
  "order": 1
}
```

### Services Endpoints

#### Get All Services (Public)
```http
GET /api/services
```

#### Create Service
```http
POST /api/services
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Service Title",
  "description": "Service description",
  "image": "https://example.com/image.jpg",
  "imagePosition": "left",
  "order": 1,
  "isActive": true
}
```

#### Update Service
```http
PUT /api/services/:id
Authorization: Bearer <token>
```

#### Delete Service
```http
DELETE /api/services/:id
Authorization: Bearer <token>
```

### Upload Endpoints

#### Upload Single Image
```http
POST /api/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- image: <file>

Response:
{
  "filePath": "/uploads/image-1234567890.jpg",
  "fileName": "image-1234567890.jpg"
}
```

For complete API documentation, see the API endpoints in the backend routes.

---

## 🎨 Customization

### Colors
Edit `frontend/tailwind.config.js`:
```javascript
colors: {
  primary: '#A52A2A',  // Change this to your brand color
}
```

### Logo
Replace the "AB" logo in:
- `frontend/src/components/Header.tsx`
- `frontend/src/components/admin/AdminLayout.tsx`

### Content
All content is managed through:
1. **Admin Panel** (recommended) - Login at `/admin/login` and edit through UI
2. **Database directly** - Use MongoDB commands
3. **Seed file** - Modify `backend/seed.js` and re-run `npm run seed`

---

## 🔒 Security Notes

1. **Change default credentials** immediately after first login
2. **Update JWT_SECRET** in `.env` to a strong random string
3. **Enable HTTPS** in production
4. **Set proper CORS origins** in `backend/server.js`
5. **Never commit `.env` files** to version control

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Real-time**: Supabase Realtime
- **UI Icons**: Material Symbols

---

## 📝 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

**Note**: Database seeding is done via SQL (see `supabase/schema.sql`)

---

**Built with ❤️ for Apex & Base Constructions Company L.L.C**