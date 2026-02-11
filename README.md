# Guardian - Women Safety Admin Portal

A comprehensive MERN stack admin portal for managing women's safety systems with real-time SOS alerts, user management, and emergency response coordination.

## 🚀 Features

### Admin Dashboard
- **Real-time Statistics**: Monitor total users, active alerts, resolved alerts, and help centers
- **Live SOS Alerts**: View and manage emergency alerts with detailed user information
- **User Management**: Search, view, and manage all registered users
- **Help Centers**: Manage police stations, hospitals, NGOs, and fire stations
- **Analytics**: System insights and performance metrics

### Technical Features
- **Magic Login**: Auto-create users on first login attempt
- **Real-time Updates**: Socket.IO for live alert notifications
- **Glassmorphism UI**: Modern, premium design with smooth animations
- **Responsive Design**: Works seamlessly across all devices
- **Secure Authentication**: JWT-based authentication system

## 🛠️ Tech Stack

### Frontend
- **React** with Vite
- **React Router** for navigation
- **Framer Motion** for animations
- **React Leaflet** for maps
- **Socket.IO Client** for real-time updates
- **React Hot Toast** for notifications
- **React Icons** for UI icons

### Backend
- **Node.js** with Express
- **MongoDB Atlas** for database
- **Socket.IO** for real-time communication
- **JWT** for authentication
- **Bcrypt** for password hashing

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Git

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/guardian-admin-portal.git
   cd guardian-admin-portal
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install

   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Configure Environment Variables**
   
   Create a `.env` file in the `server` directory:
   ```env
   MONGO_URI=your_mongodb_connection_string
   PORT=5000
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

4. **Run the application**
   ```bash
   # From the root directory
   npm run dev
   ```

   This will start:
   - Backend server on `http://localhost:5000`
   - Frontend on `http://localhost:3000`

## 🎯 Usage

1. **Access the Portal**: Navigate to `http://localhost:3000`
2. **Login**: Use any email and password (Magic Login will auto-create your account)
3. **Dashboard**: Access all admin features from the sidebar navigation

## 📁 Project Structure

```
guardian-admin-portal/
├── client/                 # React frontend
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   │   └── admin/      # Admin pages
│   │   ├── context/        # React context
│   │   ├── services/       # API services
│   │   └── index.css       # Global styles
│   └── package.json
├── server/                 # Express backend
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── server.js           # Entry point
│   └── package.json
└── package.json            # Root package.json
```

## 🔐 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected API routes
- Environment variable configuration
- Secure MongoDB connection

## 🎨 Design Features

- **Glassmorphism UI**: Modern translucent design
- **Smooth Animations**: Framer Motion powered transitions
- **Gradient Backgrounds**: Dynamic animated gradients
- **Custom Scrollbar**: Styled scrollbars matching the theme
- **Responsive Layout**: Mobile-first design approach

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/update-profile` - Update profile
- `PUT /api/auth/update-location` - Update location

### Admin
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/alerts` - Get all alerts
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/alerts/:id/status` - Update alert status

### Help Centers
- `GET /api/help-centers` - Get all help centers
- `GET /api/help-centers/nearby` - Get nearby centers
- `POST /api/help-centers` - Add new center (admin)

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the client: `cd client && npm run build`
2. Deploy the `dist` folder

### Backend (Heroku/Railway)
1. Set environment variables
2. Deploy the `server` directory

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Rakesh Kumar**
- GitHub: [@YOUR_USERNAME](https://github.com/YOUR_USERNAME)

## 🙏 Acknowledgments

- React team for the amazing framework
- MongoDB for the database solution
- All contributors and supporters

---

**Note**: This is an admin portal for managing women's safety systems. Handle all data with care and ensure proper security measures in production.
