import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// User Components
import Login from "./components/Login/Login";
import LostItems from "./components/LostItems/LostItems";
import FoundItems from "./components/FoundItems/FoundItems";
import Navigation from "./components/Navigation/Navigation";
import PostItem from "./components/PostItem";
import MyItems from "./components/MyItems/MyItems";
import SearchItems from "./components/SearchItems";
import Navbar from './components/Navbar';
import Home from './components/Home';
import Register from './components/Register';
import Verify from './components/Verify';
import FinderClaims from './components/FinderClaims';

// Admin Components
import AdminLogin from './components/Admin/AdminLogin';
import AdminDashboard from './components/Admin/AdminDashboard';

function App() {
  // States for authentication
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [registrationEmail, setRegistrationEmail] = useState("");
  const [authStep, setAuthStep] = useState("login"); // 'login', 'register', 'verify'

  // States for application views
  const [currentView, setCurrentView] = useState("home");
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  // Mock data for development
  useEffect(() => {
    const mockItems = [
      {
        id: 1,
        type: "lost",
        title: "Black Wallet",
        description: "Leather wallet with ID and credit cards",
        category: "Personal Accessories",
        location: "University Library",
        date: "2025-03-10",
        reportedBy: "user1",
        status: "active",
      },
      {
        id: 2,
        type: "found",
        title: "iPhone 14",
        description: "Black iPhone 14 with red case",
        category: "Electronics",
        location: "Student Center",
        date: "2025-03-12",
        reportedBy: "user2",
        status: "active",
      },
      {
        id: 3,
        type: "lost",
        title: "Blue Backpack",
        description: "Nike backpack with textbooks inside",
        category: "Bags",
        location: "Cafeteria",
        date: "2025-03-08",
        reportedBy: "user3",
        status: "active",
      },
    ];

    setItems(mockItems);
  }, []);

  // Authentication handlers
  const handleLogin = async (Email, Password) => {
    try {
      const response = await fetch('http://localhost:5000/api/users/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Email, Password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('token', data.token);

      setIsLoggedIn(true);
      setCurrentUser({
        id: data.id,
        Email: data.Email,
      });
      setCurrentView("home");
    } catch (error) {
      throw error;
    }
  };

  const handleRegister = async (formData) => {
    try {
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setRegistrationEmail(formData.Email);
      setAuthStep('verify');
    } catch (error) {
      throw error;
    }
  };

  const handleVerification = async (email, secNum) => {
    try {
      const response = await fetch('http://localhost:5000/api/users/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, secNum }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Verification failed');
      }

      setAuthStep("login");
      return { success: true, message: "Account verified successfully! Please login." };
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCurrentView("home");
  };

  const handleGoogleAuth = () => {
    setIsLoggedIn(true);
    setCurrentUser({
      id: "user1",
      name: "Google User",
      email: "googleuser@example.com",
    });
    setCurrentView("home");
  };

  // Item handlers
  const handlePostLostItem = (itemData) => {
    const newItem = {
      id: items.length + 1,
      type: "lost",
      ...itemData,
      reportedBy: currentUser.id,
      status: "active",
    };

    setItems([...items, newItem]);
    setCurrentView("myItems");
  };

  const handlePostFoundItem = (itemData) => {
    const newItem = {
      id: items.length + 1,
      type: "found",
      ...itemData,
      reportedBy: currentUser.id,
      status: "active",
    };

    setItems([...items, newItem]);
    setCurrentView("myItems");
  };

  const handleClaimItem = (itemId) => {
    // Implementation needed
  };

  const handleSendMessage = (e) => {
    // Implementation needed
  };

  return (
    <Router>
      <div className="App">
        <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        <Routes>
          {/* User Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register onRegister={handleRegister} />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/post" element={<PostItem />} />
          <Route path="/my-items" element={<MyItems />} />
          <Route path="/search" element={<SearchItems />} />
          <Route path="/lost-items" element={<LostItems />} />
          <Route path="/found-items" element={<FoundItems />} />
          <Route path="/finder-claims" element={<FinderClaims />} />

          {/* Admin Routes (No protection) */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
