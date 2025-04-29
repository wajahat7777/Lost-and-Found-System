# Lost and Found Management System (LFMS)

A comprehensive web application designed to help users report, track, and manage lost and found items efficiently. The system provides a user-friendly interface for both reporting lost items and claiming found items, with features like image upload, location tracking, and real-time notifications.

## Features

### User Features
- **User Authentication**
  - Secure registration and login system
  - Email verification
  - Password recovery
  - Google OAuth integration

- **Item Management**
  - Report lost items with detailed descriptions
  - Upload item images
  - Add location information using maps
  - Track item status
  - Claim found items

- **Search & Filter**
  - Advanced search functionality
  - Category-based filtering
  - Location-based search
  - Date-based filtering

### Admin Features
- **Dashboard**
  - Overview of system statistics
  - User management
  - Item management
  - Report generation

- **Moderation**
  - Content moderation
  - User verification
  - Item verification
  - Dispute resolution

##  Technology Stack

### Frontend
- **React.js** - Frontend framework
- **React Router** - Navigation and routing
- **Material-UI** - UI components and styling
- **Leaflet** - Interactive maps
- **Cloudinary** - Image storage and management
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Nodemailer** - Email services
- **Multer** - File upload handling
- **Cloudinary** - Cloud storage integration

### Testing
- **Jest** - Testing framework
- **Supertest** - API testing
- **React Testing Library** - Component testing

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/Lost-and-Found-System.git
cd Lost-and-Found-System
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Create a `.env` file in the backend directory with the following variables:
```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

##  Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev:server
```

2. Start the frontend development server:
```bash
cd frontend
npm start
```

The application will be available at `http://localhost:3000`

##  Testing

Run backend tests:
```bash
cd backend
npm test
```

Run frontend tests:
```bash
cd frontend
npm test
```

##  Project Structure

```
Lost-and-Found-System/
├── backend/
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Custom middleware
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── tests/          # Test files
│   ├── app.js          # Express application
│   └── server.js       # Server entry point
│
├── frontend/
│   ├── public/         # Static files
│   └── src/
│       ├── components/ # React components
│       ├── contexts/   # React contexts
│       ├── pages/      # Page components
│       ├── services/   # API services
│       ├── App.js      # Main application
│       └── index.js    # Entry point
│
└── images/             # Project images and diagrams
```

##  Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

##  Authors

- Ahmad Aqeel (github.com/AhamdAqeel1134)
- WajahatUllah (github.com/Wajahat7777)
- Talha Khurram 

## Acknowledgments

- Thanks to all contributors who have helped with this project
- Special thanks to the open-source community for their tools and libraries 
