# Samruddhi's Dance Academy - Web Application

A full-stack web application for managing a classical Bharatanatyam dance academy, featuring student enrollment, class management, assignment tracking, and administrative controls.

## Features

- **User Authentication**: Secure login/signup for students and administrators
- **Student Dashboard**: View classes, assignments, announcements, and progress
- **Admin Dashboard**: Manage students, classes, assignments, and academy operations
- **Assignment Management**: Create, submit, and grade assignments
- **Responsive Design**: Beautiful UI with temple gold color scheme, optimized for all devices
- **Class Photo Gallery**: Showcase performances and academy moments

## Tech Stack

### Frontend
- React 19.2.0
- React Router DOM 6.30.1
- Custom CSS with temple-themed color palette

### Backend
- Node.js with Express
- MongoDB for database
- JWT authentication
- RESTful API architecture

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd sda-prototype
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd frontend
npm install
```

4. Set up environment variables

Backend `.env`:
```
PORT=5001
MONGODB_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
```

Frontend `.env`:
```
PORT=3002
REACT_APP_API_URL=http://localhost:5001
```

### Running the Application

1. Start the backend server
```bash
cd backend
npm start
```

2. Start the frontend development server
```bash
cd frontend
npm start
```

The application will be available at `http://localhost:3002`

## Demo Credentials

**Student Account:**
- Email: test@sda.com
- Password: password123

**Admin Account:**
- Email: admin@sda.com
- Password: admin123

## Project Structure

```
sda-prototype/
├── frontend/           # React frontend application
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── styles/     # CSS stylesheets
│   │   ├── services/   # API services
│   │   └── constants/  # Image constants
│   └── public/         # Static assets
├── backend/            # Node.js backend
│   ├── models/         # MongoDB models
│   ├── routes/         # API routes
│   └── middleware/     # Authentication middleware
└── README.md
```

## Design Highlights

- **Color Scheme**: Temple gold (#C9A961), bronze (#8B7355), cream (#F5F1E8)
- **Typography**: Clean, modern fonts with excellent readability
- **UX/UI Focus**: Intuitive navigation, clear visual hierarchy
- **Accessibility**: Proper contrast ratios and keyboard navigation


