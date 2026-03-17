# 🎬 YouTube Backend API

A scalable and production-ready backend for a YouTube-like platform built using **Node.js, Express, and MongoDB**.  
This project provides RESTful APIs for handling users, videos, playlists, subscriptions, comments, likes, and more.

---

## 🚀 Features

- 🔐 Authentication & Authorization (JWT-based)
- 👤 User Management (Register, Login, Profile)
- 🎥 Video Upload & Management
- 📂 Playlist Creation & Management
- ❤️ Like / Unlike Videos
- 💬 Comment System
- 🔔 Subscription System
- ☁️ Cloudinary Integration for Media Uploads
- 📊 Dashboard APIs
- ⚡ Rate Limiting & Security Middleware
- 📄 API Documentation with Swagger

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **File Uploads:** Multer + Cloudinary
- **API Docs:** Swagger UI
- **Security:** CORS, Rate Limiting
- **Others:** dotenv, bcrypt

---

## 📁 Project Structure
youtube_backend/
│── public/
│── src/
│ ├── controllers/
│ ├── db/
│ ├── middleware/
│ ├── models/
│ ├── routes/
│ ├── utils/
│ ├── app.js
│ └── index.js
│── .gitignore
│── package.json
│── README.md
