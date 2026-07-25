# 👤 Full-Stack Developer Portfolio Project

A premium, production-ready full-stack portfolio application featuring dynamic project CRUD APIs, experience journals, credential verifications, and custom profile photo management.

* **Frontend:** React, Vite, Tailwind CSS, Framer Motion, Lucide React.
* **Backend:** Node.js, Express.js, PostgreSQL (Neon), JWT Auth, Multer, Cloudinary.
* **Security & Optimization:** Helmet, Compression, Express Rate Limit, Morgan, CORS.

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/RajaEditz/DeveloperPortfolio.git
cd DeveloperPortfolio
```

### 2. Install Dependencies

#### Frontend (Root Folder)
```bash
npm install
```

#### Backend Folder
```bash
cd backend
npm install
cd ..
```

---

## ⚙️ Environment Variables

Create `.env` files in both the Root folder (for the Frontend) and the `backend/` folder. Use [`.env.example`](file:///c:/Users/HP/Desktop/rajanew/.env.example) as a guide.

### Frontend (.env)
```env
VITE_API_URL=https://developer-portfolio-backend.onrender.com/api
```

### Backend (backend/.env)
```env
PORT=5000
NODE_ENV=production
CLIENT_URL=https://your-portfolio-app.vercel.app

# Database
DATABASE_URL=postgresql://user:password@ep-host-name.neon.tech/dbname?sslmode=require

# JWT
JWT_SECRET=your_jwt_secret_key

# Admin Login Credentials
ADMIN_USERNAME=admin@example.com
ADMIN_PASSWORD=your_secure_password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 🗄️ Neon PostgreSQL Setup

1. Sign up/Log in to [Neon Console](https://neon.tech/).
2. Create a new PostgreSQL database project.
3. Retrieve your project connection string (URL) from the Neon Dashboard. Ensure it includes `?sslmode=require` for secure SSL connections.
4. Copy the connection string into the `DATABASE_URL` field in `backend/.env`.
5. On the first startup of the backend server, the SQL migration query automatically runs to ensure the necessary tables and columns (including `profile_photo`) are created and ready.

---

## ☁️ Cloudinary Configuration

1. Log in to your [Cloudinary Console](https://cloudinary.com/).
2. Copy your Cloud Name, API Key, and API Secret from the dashboard.
3. Paste them into the corresponding variables in your `backend/.env`.
4. Uploaded files (resumes, project images, certificates, profile photos) are automatically streamed directly from Multer's memory storage to Cloudinary.

---

## 🛠️ Build & Run Locally

### Run Development Servers

#### Run Backend
```bash
cd backend
npm run dev
```

#### Run Frontend (from Root Folder)
```bash
npm run dev
```

### Build Commands (Root Folder)
To compile and optimize the frontend for production distribution:
```bash
npm run build
```

---

## 🌐 Production Deployment

### 1. Backend Deployment (Render)
1. Go to [Render Dashboard](https://dashboard.render.com/) and click **New > Web Service** or import from your GitHub repository using the [`render.yaml`](file:///c:/Users/HP/Desktop/rajanew/backend/render.yaml) blueprint.
2. If setting up manually, configure the following:
   * **Build Command:** `npm install`
   * **Start Command:** `npm start`
   * **Environment:** Node
3. Add all variables listed under the Backend Environment section in the **Environment** tab on Render.

### 2. Frontend Deployment (Vercel)
1. Go to the [Vercel Dashboard](https://vercel.com/) and click **Add New > Project**.
2. Select your repository and select the **Root Directory** as the deployment root.
3. In **Environment Variables**, add:
   * `VITE_API_URL` pointing to your live Render API endpoint (e.g. `https://developer-portfolio-backend.onrender.com/api`).
4. Click **Deploy**. Vercel will build your Vite assets and serve them. The routing rules inside [`vercel.json`](file:///c:/Users/HP/Desktop/rajanew/vercel.json) ensure clean URLs and correct SPA routing back to `index.html`.
