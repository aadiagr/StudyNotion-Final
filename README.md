# StudyNotion - Educational Technology Platform

<div align="center">
  <img src="public/index.html" alt="StudyNotion Logo" width="200"/>
  <p><strong>A modern, feature-rich EdTech platform designed to revolutionize online learning</strong></p>
  
  ![React](https://img.shields.io/badge/react-%23323330.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
  ![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
  ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
  ![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white)
  ![Tailwind CSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Database Models](#database-models)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

**StudyNotion** is a comprehensive educational technology platform that connects instructors and learners in a seamless, interactive environment. The platform enables:

- **Students** to discover, enroll in, and complete courses with progress tracking
- **Instructors** to create and manage courses with multimedia content
- **Administrators** to oversee the platform and manage categories
- **Secure payments** through Razorpay integration
- **Interactive learning** with ratings, reviews, and course progress tracking

---

## ✨ Features

### For Students
- 🔐 **User Authentication** - Secure signup/login with email verification
- 📚 **Course Catalog** - Browse and search courses by category
- 🛒 **Shopping Cart** - Add/remove courses before checkout
- 💳 **Secure Payments** - Razorpay integration for course enrollment
- 📊 **Progress Tracking** - Track course completion and subsection progress
- ⭐ **Ratings & Reviews** - Rate courses and view instructor feedback
- 👤 **User Profile** - Manage profile information and enrolled courses
- 👤 **User Profile** - Manage profile information and enrolled courses
- 🎓 **Course Dashboard** - View all enrolled and completed courses
- 📝 **Lecture Notes** - Download course notes uploaded by instructors

### For Instructors
- 📖 **Course Management** - Create, update, and delete courses
- 🏗️ **Course Structure** - Organize content into sections and subsections
- 📹 **Media Upload** - Upload course videos and resources to Cloudinary
- 📊 **Student Analytics** - Track student progress and engagement
- 💰 **Revenue Dashboard** - Monitor course sales and earnings
- 💰 **Revenue Dashboard** - Monitor course sales and earnings
- 📝 **Lecture Notes** - Upload and manage notes for course sections
- ⚙️ **Course Settings** - Configure course details, pricing, and visibility

### Admin Features
- 🏷️ **Category Management** - Organize courses by categories
- 📈 **Platform Analytics** - Overall platform statistics and insights
- 👥 **User Management** - Monitor and manage user accounts

### General Features
- 📧 **Email Notifications** - Course enrollment, payment success, password reset confirmations
- 🔄 **OTP Verification** - Secure email verification process
- 🎨 **Responsive UI** - Mobile-friendly design with Tailwind CSS
- 🌙 **Modern UX** - Smooth animations and interactive components

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Redux Toolkit** - State management
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **React Hook Form** - Form management
- **React Hot Toast** - Notifications
- **Chart.js** - Data visualization
- **React Hot Toast** - Notifications
- **React Dropzone** - File uploads
- **React OTP Input** - OTP entry
- **Video React** - Video player
- **Chart.js** - Data visualization
- **Swiper** - Carousel/slider component

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Nodemailer** - Email service
- **Cloudinary** - Image/video hosting
- **Cloudinary** - Image/video hosting
- **Razorpay** - Payment gateway
- **Node Schedule** - Scheduled tasks
- **OTP Generator** - OTP generation

### Tools & Utilities
- **Prettier** - Code formatting
- **Nodemon** - Development server auto-reload
- **CORS** - Cross-origin resource sharing
- **Cookie Parser** - HTTP cookie parsing

---

## 📁 Project Structure

```
studynotion-edtech-project/
├── public/                          # Static assets
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
│
├── src/                             # Frontend React application
│   ├── components/
│   │   ├── Common/                  # Reusable components (Navbar, Footer, etc.)
│   │   └── core/                    # Page-specific components
│   │       ├── Auth/                # Login & Signup forms
│   │       ├── HomePage/            # Home page components
│   │       ├── Catalog/             # Course catalog
│   │       ├── Dashboard/           # Student/Instructor dashboard
│   │       ├── Course/              # Course details
│   │       └── ViewCourse/          # Course playback view
│   ├── pages/                       # Page components
│   ├── services/                    # API integration layer
│   │   ├── apis.js                  # API endpoints
│   │   ├── apiConnector.js          # Axios configuration
│   │   └── operations/              # API call operations
│   ├── slices/                      # Redux slices
│   ├── reducer/                     # Redux reducer configuration
│   ├── hooks/                       # Custom React hooks
│   ├── utils/                       # Utility functions
│   ├── data/                        # Static data (countries, links, etc.)
│   ├── assets/                      # Images, logos, icons
│   ├── App.jsx
│   └── index.js
│
├── server/                          # Backend Node.js application
│   ├── config/                      # Database & service configurations
│   │   ├── database.js              # MongoDB connection
│   │   ├── cloudinary.js            # Cloudinary setup
│   │   └── razorpay.js              # Razorpay setup
│   ├── controllers/                 # Business logic
│   │   ├── Auth.js                  # Authentication logic
│   │   ├── Course.js                # Course management
│   │   ├── Profile.js               # User profiles
│   │   ├── payments.js              # Payment processing
│   │   ├── RatingandReview.js       # Reviews
│   │   └── ...
│   ├── models/                      # Mongoose schemas
│   │   ├── User.js
│   │   ├── Course.js
│   │   ├── Section.js
│   │   ├── Subsection.js
│   │   ├── Category.js
│   │   ├── OTP.js
│   │   ├── Profile.js
│   │   └── ...
│   ├── routes/                      # API endpoints
│   │   ├── user.js
│   │   ├── Course.js
│   │   ├── Payments.js
│   │   ├── Contact.js
│   │   └── profile.js
│   ├── middleware/                  # Custom middleware
│   │   └── auth.js                  # JWT authentication
│   ├── mail/                        # Email templates
│   │   └── templates/
│   ├── utils/                       # Utility functions
│   │   ├── imageUploader.js
│   │   ├── mailSender.js
│   │   └── secToDuration.js
│   ├── index.js                     # Server entry point
│   ├── package.json
│   └── .env                         # Environment variables
│
├── .gitignore
├── package.json                     # Root package (monorepo)
├── tailwind.config.js               # Tailwind CSS configuration
├── prettier.config.js               # Code formatting rules
└── README.md                        # This file
```

---

## 🚀 Installation

### Prerequisites
- **Node.js** (v14 or higher)
- **MongoDB** (local or cloud instance via MongoDB Atlas)
- **npm** or **yarn** package manager
- **Cloudinary Account** (for image/video hosting)
- **Razorpay Account** (for payment processing)
- **Email Service** (e.g., Gmail SMTP)

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/studynotion-edtech-project.git
   cd studynotion-edtech-project
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

---

## ⚙️ Configuration

### Frontend Environment Variables
Create a `.env` file in the root directory (if needed for API base URL configuration).

### Backend Environment Variables
Create a `.env` file in the `server/` directory with the following variables:

```env
# Database
MONGODB_URL=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d

# Cloudinary
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email Configuration (NodeMailer)
MAIL_HOST=smtp.gmail.com
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_app_password

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Server
PORT=4000
NODE_ENV=development
```

---

## 🎮 Running the Application

### Development Mode (Recommended)
Run both frontend and backend concurrently:
```bash
npm run dev
```

This will start:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:4000

### Run Frontend Only
```bash
npm start
```

### Run Backend Only
```bash
npm run server
# or
cd server && npm run dev
```

### Production Build
```bash
npm run build
cd server && npm start
```

---

## 🔌 API Documentation

### Base URL
```
http://localhost:4000/api/v1
```

### Authentication Endpoints
- `POST /auth/signup` - User registration
- `POST /auth/login` - User login
- `POST /auth/sendotp` - Send OTP to email
- `POST /auth/changepassword` - Change password
- `POST /auth/reset-password-token` - Request password reset
- `POST /auth/reset-password` - Reset password

### Course Endpoints
- `GET /courses` - Get all courses
- `GET /courses/:id` - Get course details
- `POST /courses/create` - Create new course (Instructor)
- `PUT /courses/:id` - Update course (Instructor)
- `DELETE /courses/:id` - Delete course (Instructor)
- `GET /courses/:id/progress` - Get course progress

### Payment Endpoints
- `POST /payments/capturePayment` - Initiate payment
- `POST /payments/verifyPayment` - Verify payment
- `GET /payments/getEnrolledCourses` - Get enrolled courses

### Profile Endpoints
- `GET /profile/getUserDetails` - Get user profile
- `PUT /profile/updateProfile` - Update profile
- `DELETE /profile/deleteProfile` - Delete account

### Category Endpoints
- `GET /categories` - Get all categories
- `POST /categories/create` - Create category (Admin)

### Note Endpoints (Instructor)
- `POST /course/uploadNote` - Upload a note
- `GET /course/getNotesBySubsection/:subsectionId` - Get notes for a subsection
- `GET /course/getNotesByCourse/:courseId` - Get notes for a course
- `DELETE /course/deleteNote/:noteId` - Delete a note

---

## 🗄️ Database Models

### User
```javascript
{
  firstName, lastName, email, password, accountType (Student/Instructor/Admin),
  additionalDetails (ProfileID), courses, courseProgress
}
```

### Course
```javascript
{
  courseName, courseDescription, instructor, whatYouWillLearn,
  courseContent (SectionIDs), ratingAndReviews, price, thumbnail,
  category, createdAt
}
```

### Section
```javascript
{
  sectionName, course, subSection (SubsectionIDs)
}
```

### Subsection
```javascript
{
  title, timeDuration, description, videoUrl, section
}
```

### OTP
```javascript
{
  email, otp, createdAt
}
```

### RatingAndReview
```javascript
{
  user, course, rating, review
}
```

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

---

## 📧 Contact & Support

For questions or support, please reach out through:
- Issues: GitHub Issues
- Email: aadityaagr16@gmail.com

---

<div align="center">
  <p>Made with ❤️ by Aaditya Agrawal</p>
</div>
