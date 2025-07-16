# 212222040043
## 🔗 URL Shortener Application
A full-stack URL shortener built with React, Material UI on the frontend and Node.js, Express, and MongoDb on the backend. It allows users to shorten long URLs, track statistics like click counts, sources, and expiration times.


## 🗂 Project Structure
```
bash
Copy
Edit
url-shortener-app/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── ...
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   └── ...
├── .env
├── README.md
└── package.json
```

---

## 🚀 Features

### ✅ Frontend
- Create up to 5 shortened URLs at a time
- Set custom shortcodes and expiry times (in minutes)
- View statistics: original URL, created time, expiry, total clicks
- Track detailed click info (timestamp, source, location)
- LocalStorage to persist shortened links
- MUI-based design with clear UI

### ✅ Backend
- RESTful API for creating and fetching short URLs
- Automatic shortcode generation (if not provided)
- Expiry time validation and enforcement
- Click tracking with metadata
- Logging

---

## 🛠️ Tech Stack

| Layer      | Technology                  |
|------------|------------------------------|
| Frontend   | React, Vite, Material UI     |
| Backend    | Node.js, Express.js          |
| Database   | MongoDb                      |
| API Client | Axios                        |
| Logging    | Custom Logger (to API)       |

---



## ⚙️ Setup Instructions

### 1. Clone the Repository
bash
Copy
Edit
git clone https://github.com/your-username/url-shortener-app.git
cd url-shortener-app
🧩 Backend Setup (/backend)
📦 Install Dependencies
bash
Copy
Edit
cd backend
npm install

## ⚙️ Environment Variables (.env)

Create a .env file in the backend folder:
env
Copy
Edit
PORT=8000
DATABASE_URL= mongoDbURL
BASE_URL=http://localhost:8000

## 🔄 Run Backend Server
bash
Copy
Edit
npm run dev
Make sure your database is accessible and Prisma is configured.

## 🌐 Frontend Setup (/frontend)
📦 Install Dependencies
bash
Copy
Edit
cd frontend
npm install
⚙️ Environment Variables (.env)
Create a .env file in the frontend folder:

env
Copy
Edit
VITE_API_BASE_URL=http://localhost:8000

▶️ Run Frontend
bash
Copy
Edit
npm run dev
App runs on http://localhost:5173 by default.

📡 API Endpoints
POST /shorturls
Body: { url, validity, shortcode (optional) }

Returns: { shortLink, expiry }

GET /shorturls/:shortcode
Returns: { originalUrl, createdAt, expiresAt, totalClicks, clicks[] }


## 📷 Screenshots

## OutPut:

### Home Page
<img width="1919" height="913" alt="image" src="https://github.com/user-attachments/assets/8bca1d5b-daf3-4557-a291-5a88cbcbbe87" />
<img width="1917" height="402" alt="image" src="https://github.com/user-attachments/assets/f2c0d2c2-440e-42f2-9e58-91435654e706" />


### Statistics Page
<img width="1919" height="912" alt="image" src="https://github.com/user-attachments/assets/55b7394b-55d1-4c6f-9a4f-7b106254ae07" />
<img width="1919" height="744" alt="image" src="https://github.com/user-attachments/assets/a54dc8b0-cd21-43ff-b582-ae1e004176c8" />


### Login Auth
<img width="1919" height="990" alt="image" src="https://github.com/user-attachments/assets/0a5137a4-0752-4b3e-82b3-994e97ef262c" />

### URL Shortening
<img width="1382" height="795" alt="image" src="https://github.com/user-attachments/assets/1c72dffd-5134-44f5-bf1c-fbc2687dedf0" />

### Statistic History 
<img width="1441" height="936" alt="image" src="https://github.com/user-attachments/assets/f59a7925-4dcc-49ad-9e82-a409163c41b3" />

