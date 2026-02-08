# 🏠 Spaces for Rent - Frontend

<div align="center">

![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/CSS3-Styled-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![Context API](https://img.shields.io/badge/State-Context_API-764ABC?style=for-the-badge)

**A modern platform for discovering and booking unique spaces for any activity**

[Live Demo](http://localhost:3000) · [Backend Repo](https://github.com/binabdimalik/space-for-rent-backend) · [Report Bug](https://github.com/binabdimalik/space-for-rent--frontend/issues)

</div>

---

## 📌 Overview

**Spaces for Rent** is an online marketplace that connects space owners with people seeking locations for meetings, events, or activities. Space owners can list their properties for hourly/daily rentals, while clients can easily browse, book, and pay for spaces.

### ✨ Key Features

| Feature                   | Description                               |
| ------------------------- | ----------------------------------------- |
| 🔍 **Browse Spaces**      | Search and filter available rental spaces |
| 📅 **Easy Booking**       | Book spaces with real-time availability   |
| 💳 **Payment Simulation** | Secure billing and invoice generation     |
| 👤 **User Profiles**      | Manage bookings and account settings      |
| 🛡️ **Admin Dashboard**    | Manage spaces, users, and bookings        |
| 💬 **Live Chat**          | Real-time communication with support      |

---

## 🛠️ Tech Stack

| Category             | Technology            |
| -------------------- | --------------------- |
| **Framework**        | React 18.x            |
| **Routing**          | React Router v6       |
| **State Management** | React Context API     |
| **Styling**          | CSS3 / Custom Styles  |
| **Icons**            | React Icons (Feather) |
| **HTTP Client**      | Axios                 |
| **Maps**             | Leaflet               |

---

## 📂 Project Structure

```
space-for-rent-frontend/
├── public/
│   └── images/              # Static images
├── src/
│   ├── components/
│   │   ├── common/          # Navbar, Footer, etc.
│   │   └── chat/            # FloatingChat component
│   ├── context/             # Global state management
│   │   ├── AuthContext.js   # Authentication state
│   │   ├── SpacesContext.js # Spaces data & operations
│   │   ├── BookingsContext.js # Booking management
│   │   ├── AdminsContext.js # Admin management
│   │   ├── ClientsContext.js # Client management
│   │   └── ChatContext.js   # Chat functionality
│   ├── pages/
│   │   ├── HomePage.js      # Landing page
│   │   ├── SpacesPage.js    # Space listings
│   │   ├── SpaceDetailsPage.js # Individual space
│   │   ├── LoginPage.js     # Authentication
│   │   ├── ProfilePage.js   # User profile
│   │   ├── PaymentPage.js   # Payment flow
│   │   └── admin/           # Admin pages
│   ├── services/
│   │   └── api.js           # API configuration
│   ├── App.js               # Main app component
│   └── index.js             # Entry point
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- Backend server running on `http://localhost:5555`

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/binabdimalik/space-for-rent--frontend.git
   cd space-for-rent--frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm start
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

---

## 🔗 Available Routes

| Route             | Description             | Access     |
| ----------------- | ----------------------- | ---------- |
| `/`               | Home page               | Public     |
| `/spaces`         | Browse all spaces       | Public     |
| `/spaces/:id`     | Space details           | Public     |
| `/login`          | Login/Register          | Public     |
| `/profile`        | User profile & bookings | Protected  |
| `/payment`        | Payment processing      | Protected  |
| `/list-space`     | Submit a space listing  | Protected  |
| `/admin`          | Admin dashboard         | Admin only |
| `/admin/spaces`   | Manage spaces           | Admin only |
| `/admin/users`    | Manage users            | Admin only |
| `/admin/bookings` | Manage bookings         | Admin only |
| `/admin/chat`     | Live chat support       | Admin only |

---

## 🎨 Design System

### Color Palette

| Color            | Hex       | Usage            |
| ---------------- | --------- | ---------------- |
| 🔵 Primary Blue  | `#2563EB` | Buttons, Links   |
| 🟢 Success Green | `#10B981` | Success states   |
| 🟠 Action Orange | `#F97316` | CTAs, Highlights |
| 🔷 Deep Navy     | `#1E3A8A` | Headers, Text    |
| ⬜ Light Beige   | `#F5F5F4` | Backgrounds      |

### Typography

- **Headings:** Inter, 700 weight
- **Body:** Open Sans, 400 weight

---

## 🔐 Demo Credentials

| Role            | Email                          | Password      |
| --------------- | ------------------------------ | ------------- |
| **Super Admin** | `superadmin@spacesforrent.com` | `admin123`    |
| **Client**      | `john@example.com`             | `password123` |

---

## 📡 API Integration

The frontend connects to the Flask backend API:

```javascript
// Base URL Configuration
const API_BASE_URL = 'http://localhost:5555';

// Available Endpoints
GET    /api/spaces      // Get all spaces
GET    /api/spaces/:id  // Get single space
POST   /api/spaces      // Create space
PUT    /api/spaces/:id  // Update space
DELETE /api/spaces/:id  // Delete space
GET    /api/bookings    // Get bookings
POST   /api/bookings    // Create booking
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feat/your-name/feature`)
3. Commit your changes (`git commit -m 'feat: add new feature'`)
4. Push to the branch (`git push origin feat/your-name/feature`)
5. Open a Pull Request

---

## 👤 Authors

- **Abdimalik Kulow**
- **Peter Emu**
- **Elly Owuor**
- **Yvonne Kajuju**
- **Ephraihim Anyanje**

---

## 📄 License

This project is licensed under the **MIT License**.

---

<div align="center">

Made with ❤️ by the Spaces for Rent Team

</div>
