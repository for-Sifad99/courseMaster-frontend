# CourseMaster

CourseMaster is a full-featured EdTech platform built with the MERN stack (MongoDB, Express.js, React.js, Node.js). It provides a comprehensive solution for online course management, student enrollment, learning content delivery, assignments, quizzes, and administrative oversight.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development Guidelines](#development-guidelines)
- [Contributing](#contributing)
- [License](#license)

## Overview

CourseMaster is designed to provide an intuitive and engaging learning experience for students while offering powerful administrative tools for educators and platform managers. The platform supports course creation, student enrollment, content delivery, assessment, and progress tracking.

## Features

### Public Access
- Homepage with featured courses
- Course catalog with search, filtering, and sorting capabilities
- Detailed course information pages
- User registration and authentication

### Student Portal
- Personalized dashboard
- Course enrollment management
- Video lecture viewing
- Assignment submission
- Quiz participation
- Progress tracking and certificates

### Administrative Panel
- Course management (CRUD operations)
- Batch scheduling and management
- Student enrollment tracking
- Assignment and quiz review
- Analytics and reporting
- User management

## Architecture

The platform follows a client-server architecture with a clear separation between frontend and backend:

```
┌─────────────────┐    HTTP/API    ┌─────────────────┐
│   Frontend      │◄──────────────►│   Backend       │
│  (React.js)     │                │ (Node.js/       │
│                 │                │  Express.js)    │
└─────────────────┘                └─────────────────┘
                                             │
                                      MongoDB│
                                             ▼
                                   ┌─────────────────┐
                                   │    Database     │
                                   │   (MongoDB)     │
                                   └─────────────────┘
```

### Frontend
- Built with React.js for a responsive, component-based UI
- Uses React Router for client-side navigation
- Styled with Tailwind CSS for rapid UI development
- Communicates with backend via RESTful API

### Backend
- RESTful API built with Node.js and Express.js
- MongoDB for data storage with Mongoose ODM
- JWT-based authentication and authorization
- Modular structure with controllers, models, and routes

## Technology Stack

### Frontend
- **React.js** - JavaScript library for building user interfaces
- **React Router** - Declarative routing for React applications
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - Promise-based HTTP client

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling tool
- **JSON Web Tokens (JWT)** - Token-based authentication

### Development Tools
- **Git** - Version control
- **npm** - Package manager
- **VS Code** - Code editor
- **Postman** - API testing

## Project Structure

```
coursemaster/
├── backend/                # Backend API (Node.js/Express)
│   ├── controllers/        # Request handlers
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── config/             # Configuration files
│   ├── utils/              # Utility functions
│   ├── server.js           # Entry point
│   └── README.md           # Backend documentation
├── frontend/               # Frontend application (React)
│   ├── public/             # Static assets
│   ├── src/                # Source code
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── utils/          # Utility functions
│   │   ├── styles/         # Global styles
│   │   ├── App.jsx         # Main application component
│   │   └── index.jsx       # Entry point
│   └── README.md           # Frontend documentation
└── README.md               # Main project documentation
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or cloud instance)
- npm or yarn package manager

### Setup Instructions

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd coursemaster
   ```

2. Set up the backend:
   ```bash
   cd backend
   npm install
   # Create .env file with required variables
   npm run seed  # Seed database with initial data
   npm run dev   # Start backend server
   ```

3. Set up the frontend:
   ```bash
   cd ../frontend
   npm install
   # Create .env file with required variables
   npm start     # Start frontend development server
   ```

4. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Environment Variables

Each component requires specific environment variables:
- **Backend**: PORT, MONGODB_URI, JWT_SECRET
- **Frontend**: REACT_APP_API_URL

Refer to each component's README for detailed setup instructions.

## Development Guidelines

### Code Quality
- Follow consistent coding standards across both frontend and backend
- Use meaningful variable and function names
- Write modular, reusable code
- Implement proper error handling

### Git Workflow
- Create feature branches for new functionality
- Write descriptive commit messages
- Submit pull requests for code review
- Keep commits focused and atomic

### Testing
- Test API endpoints with tools like Postman
- Verify UI functionality across different browsers
- Check responsiveness on various device sizes
- Validate form inputs and error states

## Contributing

We welcome contributions to improve CourseMaster! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

Ensure your code follows our development guidelines and passes all tests.

## License

This project is proprietary and confidential. All rights reserved.