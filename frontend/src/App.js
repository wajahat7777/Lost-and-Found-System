import React, { useState, useEffect } from "react";
import "./App.css";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import LostItems from "./components/LostItems/LostItems";
import FoundItems from "./components/FoundItems/FoundItems";
import Navigation from "./components/Navigation/Navigation";
import SearchBar from "./components/SearchBar/SearchBar";
import PostItem from "./components/PostItem/PostItem";
import MyItems from "./components/MyItems/MyItems";
import Messages from "./components/Messages/Messages";

function App() {
  // States for authentication
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState("login"); // 'login' or 'register'

  // States for application views
  const [currentView, setCurrentView] = useState("home"); // 'home', 'lostItems', 'foundItems', 'myItems', 'messages'
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [messages, setMessages] = useState([]);

  // State for message box
  const [showMessageBox, setShowMessageBox] = useState(false);
  const [messageText, setMessageText] = useState("");

  // Form states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilters, setSearchFilters] = useState({
    category: "",
    location: "",
    dateFrom: "",
    dateTo: "",
    type: "all", // 'all', 'lost', 'found'
  });

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
    setFilteredItems(mockItems);

    const mockMessages = [
      {
        id: 1,
        itemId: 2,
        sender: "user1",
        receiver: "user2",
        message:
          "Hi, I think I lost that iPhone. It has my contact info on the lock screen.",
        timestamp: "2025-03-13T14:30:00",
        read: true,
      },
      {
        id: 2,
        itemId: 2,
        sender: "user2",
        receiver: "user1",
        message: "Can you describe any identifying marks or the wallpaper?",
        timestamp: "2025-03-13T14:35:00",
        read: false,
      },
    ];

    setMessages(mockMessages);
  }, []);

  useEffect(() => {
    let results = [...items];

    if (searchFilters.type !== "all") {
      results = results.filter((item) => item.type === searchFilters.type);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
      );
    }

    if (searchFilters.category) {
      results = results.filter(
        (item) =>
          item.category.toLowerCase() === searchFilters.category.toLowerCase()
      );
    }

    if (searchFilters.location) {
      results = results.filter((item) =>
        item.location
          .toLowerCase()
          .includes(searchFilters.location.toLowerCase())
      );
    }

    if (searchFilters.dateFrom) {
      results = results.filter(
        (item) => new Date(item.date) >= new Date(searchFilters.dateFrom)
      );
    }

    if (searchFilters.dateTo) {
      results = results.filter(
        (item) => new Date(item.date) <= new Date(searchFilters.dateTo)
      );
    }

    setFilteredItems(results);
  }, [searchQuery, searchFilters, items]);

  // Authentication handlers
  const handleLogin = (email, password) => {
    setIsLoggedIn(true);
    setCurrentUser({
      id: "user1",
      name: "Test User",
      email: email,
    });
    setCurrentView("home");
  };

  const handleRegister = (name, email, password, phone) => {
    setIsLoggedIn(true);
    setCurrentUser({
      id: "user1",
      name: name,
      email: email,
    });
    setCurrentView("home");
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
    setShowMessageBox(true); // Show the message box
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!selectedItem || !messageText.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      itemId: selectedItem.id,
      sender: currentUser.id,
      receiver: selectedItem.reportedBy,
      message: messageText,
      timestamp: new Date().toISOString(),
      read: false,
    };

    setMessages([...messages, newMessage]);
    alert("Message sent successfully!");
    setMessageText("");
    setShowMessageBox(false); // Hide the message box after sending
  };

  return (
    <div className="App">
      <Navigation
        isLoggedIn={isLoggedIn}
        currentUser={currentUser}
        currentView={currentView}
        setCurrentView={setCurrentView}
        setSearchFilters={setSearchFilters}
        handleLogout={handleLogout}
      />

      {currentView === "auth" ? (
        authMode === "login" ? (
          <Login handleLogin={handleLogin} setAuthMode={setAuthMode} />
        ) : (
          <Signup handleRegister={handleRegister} setAuthMode={setAuthMode} />
        )
      ) : (
        <>
          {currentView !== "messages" && (
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              searchFilters={searchFilters}
              setSearchFilters={setSearchFilters}
            />
          )}
          <div className="content">
            {currentView === "home" && (
              <div className="home-view">
                <h2>Welcome to Lost & Found</h2>
                <p>Find your lost items or report found items here.</p>
                <div className="item-grid">
                  {filteredItems.map((item) => (
                    <div
                      key={item.id}
                      className="item-card"
                      onClick={() => setSelectedItem(item)}
                    >
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                      <span className={`item-type ${item.type}`}>
                        {item.type === "lost" ? "Lost" : "Found"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {currentView === "lostItems" && (
              <LostItems
                filteredItems={filteredItems}
                setSelectedItem={setSelectedItem}
              />
            )}
            {currentView === "foundItems" && (
              <FoundItems
                filteredItems={filteredItems}
                setSelectedItem={setSelectedItem}
              />
            )}
            {currentView === "postItem" && (
              <PostItem
                onPostItem={
                  searchFilters.type === "lost"
                    ? handlePostLostItem
                    : handlePostFoundItem
                }
              />
            )}
            {currentView === "myItems" && (
              <MyItems
                items={items.filter(
                  (item) => item.reportedBy === currentUser?.id
                )}
              />
            )}
            {currentView === "messages" && <Messages messages={messages} />}
          </div>
        </>
      )}

      {selectedItem && (
        <div className="item-modal">
          <div className="modal-content">
            <button
              onClick={() => setSelectedItem(null)}
              className="close-modal"
            >
              &times;
            </button>
            <h3>{selectedItem.title}</h3>
            <p>{selectedItem.description}</p>
            <p>
              <strong>Location:</strong> {selectedItem.location}
            </p>
            <p>
              <strong>Date:</strong> {selectedItem.date}
            </p>
            <p>
              <strong>Reported By:</strong> {selectedItem.reportedBy}
            </p>
            {selectedItem.type === "found" && (
              <button onClick={() => handleClaimItem(selectedItem.id)}>
                Claim Item
              </button>
            )}
          </div>
        </div>
      )}

      {showMessageBox && (
        <div className="message-box-modal">
          <div className="message-box-content">
            <button
              onClick={() => setShowMessageBox(false)}
              className="close-modal"
            >
              &times;
            </button>
            <h3>Send a Message</h3>
            <form onSubmit={handleSendMessage}>
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type your message here..."
                required
              />
              <button type="submit" className="btn-primary">
                Send Message
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
