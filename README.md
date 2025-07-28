# Uber Web Frontend

A modern React-based frontend application for an Uber-like ride-sharing platform built with Vite, featuring real-time communication, interactive maps, and seamless user experience.

## 🚀 Features

- **Modern React Architecture**: Built with React 18 and functional components
- **Real-time Updates**: Socket.io integration for live ride tracking
- **Interactive Maps**: Dynamic map interface for location selection and ride tracking
- **Responsive Design**: Mobile-first design that works across all devices
- **User Authentication**: Secure login/signup for both users and captains
- **Live Location Tracking**: Real-time captain location updates
- **Ride Management**: Complete ride booking and tracking system
- **Fast Development**: Vite for lightning-fast development and building

## 🛠️ Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: CSS3 with modern features
- **Maps**: Interactive map integration
- **Real-time**: Socket.io Client
- **HTTP Client**: Axios for API communication
- **Routing**: React Router DOM
- **State Management**: React Context API / useState hooks
- **Icons**: React Icons
- **Development**: ESLint for code quality

## 📁 Project Structure

```
Uber-Web/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Header.jsx           # Navigation header
│   │   ├── LocationPanel.jsx    # Location input component
│   │   ├── VehiclePanel.jsx     # Vehicle selection
│   │   ├── ConfirmRide.jsx      # Ride confirmation
│   │   ├── LookingForCaptain.jsx # Captain search
│   │   ├── WaitingForCaptain.jsx # Captain arrival
│   │   └── RidePopup.jsx        # Ride status popup
│   ├── context/
│   │   ├── UserContext.jsx      # User state management
│   │   └── CaptainContext.jsx   # Captain state management
│   ├── pages/
│   │   ├── Home.jsx             # Landing page
│   │   ├── UserLogin.jsx        # User authentication
│   │   ├── UserSignup.jsx       # User registration
│   │   ├── CaptainLogin.jsx     # Captain authentication
│   │   ├── CaptainSignup.jsx    # Captain registration
│   │   ├── UserProtectedRoute.jsx # Route protection
│   │   ├── CaptainProtectedRoute.jsx # Captain route protection
│   │   ├── UserLogout.jsx       # User logout
│   │   ├── CaptainLogout.jsx    # Captain logout
│   │   ├── Start.jsx            # Initial page
│   │   ├── UserHome.jsx         # User dashboard
│   │   ├── CaptainHome.jsx      # Captain dashboard
│   │   └── Riding.jsx           # Active ride page
│   ├── hooks/
│   │   └── useSocket.js         # Socket.io custom hook
│   ├── services/
│   │   └── api.js               # API service functions
│   ├── utils/
│   │   └── constants.js         # App constants
│   ├── App.jsx                  # Main app component
│   ├── main.jsx                 # App entry point
│   └── index.css                # Global styles
├── package.json
├── vite.config.js               # Vite configuration
└── .env                         # Environment variables
```

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Running Uber Backend Server

## ⚙️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Uber-Web
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:

   ```env
   VITE_API_URL=http://localhost:3000
   VITE_SOCKET_URL=http://localhost:3000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

The application will start on `http://localhost:5173`

## 🎯 User Journey

### For Passengers (Users)

1. **Landing Page** → Choose to login as User or Captain
2. **Authentication** → Login or Register
3. **Home Dashboard** → Enter pickup and destination
4. **Vehicle Selection** → Choose vehicle type and see fare estimate
5. **Ride Confirmation** → Confirm ride details
6. **Captain Search** → Wait for captain acceptance
7. **Captain Arrival** → Track captain location and get ride details
8. **Active Ride** → Real-time ride tracking
9. **Ride Completion** → Payment and rating

### For Drivers (Captains)

1. **Captain Login** → Authenticate as captain
2. **Dashboard** → Toggle online/offline status
3. **Ride Requests** → Receive and accept ride notifications
4. **Pickup Navigation** → Navigate to passenger location
5. **Ride Execution** → Start ride with OTP verification
6. **Ride Completion** → End ride and collect payment

## 🗺️ Key Components

### LocationPanel

- Address input with autocomplete
- Current location detection
- Destination selection

### VehiclePanel

- Vehicle type selection (Car, Auto, Moto)
- Fare calculation display
- Ride confirmation

### Map Integration

- Interactive map for location selection
- Real-time captain tracking
- Route visualization

### Real-time Features

- Live captain location updates
- Ride status notifications
- Instant messaging between user and captain

## 🔌 Socket Events

### User Events

- `join` - Join user room
- `new-ride` - Receive ride notifications
- `ride-confirmed` - Captain accepted ride
- `ride-started` - Ride began
- `ride-ended` - Ride completed

### Captain Events

- `join` - Join captain room
- `new-ride` - New ride request
- `update-location-captain` - Send location updates

## 🎨 Styling

- **Mobile-First Design**: Responsive layouts for all screen sizes
- **Modern CSS**: Flexbox and Grid layouts
- **Smooth Animations**: CSS transitions and transforms
- **Component-Based Styling**: Modular CSS approach

## 🔒 Route Protection

- **UserProtectedRoute**: Protects user-only pages
- **CaptainProtectedRoute**: Protects captain-only pages
- **Authentication Guards**: Automatic redirects for unauthorized access

## 📱 Responsive Design

- **Mobile (320px+)**: Optimized touch interface
- **Tablet (768px+)**: Enhanced layout utilization
- **Desktop (1024px+)**: Full-featured experience

## 🚦 Getting Started

1. Ensure backend server is running
2. Install dependencies
3. Configure environment variables
4. Run `npm run dev`
5. Navigate to `http://localhost:5173`

## 📦 Build for Production

```bash
npm run build
```

Built files will be in the `dist/` directory.

## 🧪 Development Tools

- **Vite**: Fast development server and building
- **ESLint**: Code quality and consistency
- **Hot Module Replacement**: Instant code updates
- **React DevTools**: Component debugging

## 📝 Scripts

```json
{
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0"
}
```

## 🔧 Vite Configuration

Currently using official plugins:

- **@vitejs/plugin-react**: Uses Babel for Fast Refresh
- **@vitejs/plugin-react-swc**: Uses SWC for Fast Refresh (alternative)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -am 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Create Pull Request

## 📄 License

This project is licensed under the MIT License.

---

**Note**: This frontend application requires the Uber Backend Server to be running for full functionality. Make sure to configure the correct API endpoints in your environment variables.

## 🔗 Related

- [Uber Backend Server](../Uber-server/README.md) - Backend API
