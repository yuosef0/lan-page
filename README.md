# Apex & Base Construction Portfolio Website

A full-stack portfolio website with an admin panel (CMS) for a construction company. Built with **Next.js**, **Express**, **MongoDB**, and **Tailwind CSS**.

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
- ✅ Secure authentication with JWT
- ✅ Dashboard with statistics
- ✅ Manage all page content:
  - Home page hero & feature cards
  - About page sections
  - Services (add/edit/delete)
  - Team members (add/edit/delete)
  - Contact information & submissions
- ✅ Image upload system
- ✅ User-friendly interface

### 🔧 Backend API
- ✅ RESTful API with Express.js
- ✅ MongoDB database with Mongoose
- ✅ JWT authentication
- ✅ File upload with Multer
- ✅ Full CRUD operations
- ✅ Request validation

---

## 📂 Project Structure

```
lan-page/
├── backend/                # Express.js Backend API
│   ├── config/            # Database configuration
│   ├── controllers/       # Request handlers
│   ├── middleware/        # Auth & upload middleware
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── uploads/           # Uploaded images
│   ├── server.js          # Main server file
│   ├── seed.js            # Database seed script
│   └── package.json
│
├── frontend/              # Next.js Frontend
│   ├── src/
│   │   ├── app/          # Pages (Next.js 14 App Router)
│   │   │   ├── page.tsx           # Home page
│   │   │   ├── about/             # About page
│   │   │   ├── services/          # Services page
│   │   │   ├── contact/           # Contact page
│   │   │   └── admin/             # Admin panel
│   │   │       ├── login/         # Admin login
│   │   │       ├── dashboard/     # Admin dashboard
│   │   │       ├── home/          # Manage home page
│   │   │       ├── services/      # Manage services
│   │   │       └── ...            # Other admin pages
│   │   ├── components/    # Reusable components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── ClientLayout.tsx
│   │   │   └── admin/
│   │   │       └── AdminLayout.tsx
│   │   └── lib/           # API client & utilities
│   │       └── api.ts
│   ├── public/            # Static assets
│   └── package.json
│
└── README.md             # This file
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd lan-page
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/apex-base-portfolio
# JWT_SECRET=your-super-secret-jwt-key
# NODE_ENV=development

# Seed the database (creates admin user & sample data)
npm run seed

# Start the backend server
npm run dev
```

**Default Admin Credentials:**
- Email: `admin@apexbase.com`
- Password: `Admin123!`

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local

# Edit .env.local
# NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Start the development server
npm run dev
```

### 4. Access the Application

- **Portfolio Website**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin/login
- **Backend API**: http://localhost:5000/api

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

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **File Upload**: Multer
- **UI Components**: Material Symbols Icons
- **Notifications**: React Toastify

---

## 📝 Scripts

### Backend
```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
npm run seed     # Seed database with initial data
```

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
```

---

**Built with ❤️ for Apex & Base Constructions Company L.L.C**