# Roamify 🌍
> Transform your travel memories into an interactive visual journey.

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-Build_Tool-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-Backend-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Material UI](https://img.shields.io/badge/Material_UI-Components-007FFF?style=for-the-badge&logo=mui&logoColor=white)](https://mui.com/)
[![MapLibre](https://img.shields.io/badge/MapLibre_GL-Maps-396B94?style=for-the-badge&logo=maplibre&logoColor=white)](https://maplibre.org/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Media_CDN-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)](https://cloudinary.com/)

**Roamify** is a full-stack MERN application that reimagines travel documentation. Instead of traditional travel blogs, it enables users to pin their journeys on an interactive world map, attach detailed stories with photos, and visually relive their adventures. Whether you're documenting a weekend getaway or a multi-country expedition, Roamify turns your travels into a stunning, navigable experience.

![Roamify Preview](screenshot/Roamify.png)

---

## ✨ Key Features

- 🗺️ **Interactive World Map** — Built with MapLibre GL JS for seamless map interactions with smooth zoom, pan, and rotation.
- 🔍 **Smart Location Search** — Powered by Nominatim geocoding API to quickly find and navigate to any location worldwide.
- ✍️ **Full CRUD for Travel Entries** — Create, read, update, and delete travel logs with rich metadata, ratings, descriptions, and timestamps.
- 🖼️ **Photo Integration** — Upload and attach travel photography via Cloudinary CDN with responsive transformations.
- 🔐 **Secure Authentication** — JWT-based authentication with HTTP-only cookies for secure, stateless user sessions.
- 📱 **Responsive Design** — Optimized UI for desktop, tablet, and mobile devices with adaptive layouts and interactive modals.
- 🧭 **Advanced Map Controls** — Geolocation support, smooth animations, and intuitive marker clustering for large datasets.
- ⚡ **Performance Optimized** — Built with React 19 + Vite for ultra-fast load times and optimized production builds.

---

## 🛠️ Tech Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Frontend** | React 19, Vite, Material-UI (MUI), MapLibre GL JS, react-map-gl, react-hook-form | Fast HMR, responsive cards, interactive map tiles, and validated form controls |
| **Backend** | Node.js, Express.js, CORS, Cookie Parser, Helmet, Morgan | Clean REST MVC architecture with centralized error handling |
| **Database** | MongoDB & Mongoose ODM | Document persistence with schema validation and indexing |
| **Authentication** | JWT (`jsonwebtoken`), bcrypt | Secure password hashing and HTTP-only cookie session protection |
| **Media Delivery** | Cloudinary CDN | High-performance cloud image delivery and storage |
| **Geocoding** | Nominatim OpenStreetMap API | Forward and reverse geocoding with bounding box scoring |
| **Deployment** | Netlify (Frontend), Render (Backend) | Independent CI/CD build and host pipelines |

---

## 📁 Project Directory Structure

```text
roamify/
├── client/                          # React frontend application
│   ├── src/
│   │   ├── components/              # Reusable React components
│   │   │   ├── Modal.jsx            # Custom modal dialog component
│   │   │   ├── GeocoderControl.jsx  # Location search with Nominatim integration
│   │   │   ├── LoginForm.jsx        # User login form
│   │   │   ├── SignupForm.jsx       # User registration form
│   │   │   ├── LogEntryForm.jsx     # Create new travel entry
│   │   │   ├── LogEditForm.jsx      # Edit existing travel entry
│   │   │   └── StyledPopup.jsx      # Map marker popup display
│   │   ├── api/
│   │   │   └── api.js               # API client and utility functions
│   │   ├── App.jsx                  # Main application component
│   │   ├── main.jsx                 # React DOM rendering
│   │   ├── index.css                # Global styles with responsive breakpoints
│   │   └── styles/                  # Additional style modules
│   ├── index.html                   # HTML entry point
│   ├── package.json
│   └── vite.config.js
├── server/                          # Node.js Express backend
│   ├── src/
│   │   ├── api/
│   │   │   ├── auth.js              # Authentication routes (login, signup, session check)
│   │   │   └── logs.js              # Travel log CRUD routes
│   │   ├── models/
│   │   │   ├── LogEntry.js          # Travel log Mongoose schema
│   │   │   └── User.js              # User Mongoose schema
│   │   ├── middlewares.js           # Error handling and 404 middlewares
│   │   └── index.js                 # Express server configuration and startup
│   ├── .env.example
│   └── package.json
├── screenshot/
│   └── Roamify.png                  # Application preview screenshot
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **MongoDB**: Local MongoDB instance or MongoDB Atlas cluster
- **Cloudinary Account**: For travel photo hosting

### 1. Installation
Clone the repository:
```bash
git clone https://github.com/gitApurv/roamify.git
cd roamify
```

Install root and workspace dependencies:
```bash
npm run install:all
```

*(Alternatively, run `npm install` inside both `client/` and `server/` directories).*

### 2. Environment Configuration

#### Backend (`server/.env`)
Create `server/.env` based on `server/.env.example`:
```env
PORT=1337
DATABASE_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/roamify?retryWrites=true&w=majority
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=your_super_secret_jwt_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### Frontend (`client/.env`)
Create `client/.env`:
```env
VITE_API_BASE_URL=http://localhost:1337
VITE_CLOUDINARY_UPLOAD_PRESET=Roamify
```

### 3. Running Locally
Run both frontend and backend concurrently from the root:
```bash
npm run dev
```

- **Frontend**: Accessible at [http://localhost:5173](http://localhost:5173)
- **Backend**: API server listening at [http://localhost:1337](http://localhost:1337)

---

## 🔌 API Endpoints Reference

### Authentication (`/api/auth`)
| Method | Route | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Register new user account with hashed password |
| `POST` | `/api/auth/login` | Authenticate user and issue HTTP-only JWT cookie |
| `GET` | `/api/check` | Verify active session cookie and return user profile |

### Travel Logs (`/api/logs`)
| Method | Route | Description |
| :--- | :--- | :--- |
| `GET` | `/api/logs` | Fetch all travel logs for authenticated user |
| `POST` | `/api/logs` | Create a new pinned travel log entry |
| `PUT` | `/api/logs/:id` | Update description, rating, or photos of an entry |
| `DELETE` | `/api/logs/:id` | Remove a log entry from the map |

---

## 👨‍💻 Author

**Apurv**
- GitHub: [@gitApurv](https://github.com/gitApurv)

---

*Made with ❤️ for travelers and storytellers worldwide.*
