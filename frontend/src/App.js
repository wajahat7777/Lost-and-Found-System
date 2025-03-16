import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import LostItems from './components/LostItems/LostItems';
import FoundItems from './components/FoundItems/FoundItems';
import Navigation from './components/Navigation/Navigation';
import SearchBar from './components/SearchBar/SearchBar';

function App() {
  // States for authentication
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'

  // States for application views
  const [currentView, setCurrentView] = useState('home'); // 'home', 'lostItems', 'foundItems', 'myItems', 'messages'
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [messages, setMessages] = useState([]);

  // Form states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState({
    category: '',
    location: '',
    dateFrom: '',
    dateTo: '',
    type: 'all', // 'all', 'lost', 'found'
  });

  // Mock data for development
  useEffect(() => {
    const mockItems = [
      {
        id: 1,
        type: 'lost',
        title: 'Black Wallet',
        description: 'Leather wallet with ID and credit cards',
        category: 'Personal Accessories',
        location: 'University Library',
        date: '2025-03-10',
        imageUrl: 'https://via.placeholder.com/150',
        reportedBy: 'user1',
        status: 'active',
      },
      {
        id: 2,
        type: 'found',
        title: 'iPhone 14',
        description: 'Black iPhone 14 with red case',
        category: 'Electronics',
        location: 'Student Center',
        date: '2025-03-12',
        imageUrl: 'https://via.placeholder.com/150',
        reportedBy: 'user2',
        status: 'active',
      },
      {
        id: 3,
        type: 'lost',
        title: 'Blue Backpack',
        description: 'Nike backpack with textbooks inside',
        category: 'Bags',
        location: 'Cafeteria',
        date: '2025-03-08',
        imageUrl: 'https://via.placeholder.com/150',
        reportedBy: 'user3',
        status: 'active',
      },
    ];

    setItems(mockItems);
    setFilteredItems(mockItems);

    const mockMessages = [
      {
        id: 1,
        itemId: 2,
        sender: 'user1',
        receiver: 'user2',
        message: 'Hi, I think I lost that iPhone. It has my contact info on the lock screen.',
        timestamp: '2025-03-13T14:30:00',
        read: true,
      },
      {
        id: 2,
        itemId: 2,
        sender: 'user2',
        receiver: 'user1',
        message: 'Can you describe any identifying marks or the wallpaper?',
        timestamp: '2025-03-13T14:35:00',
        read: false,
      },
    ];

    setMessages(mockMessages);
  }, []);

  // Filter items based on search query and filters
  useEffect(() => {
    let results = [...items];

    if (searchFilters.type !== 'all') {
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
        item.location.toLowerCase().includes(searchFilters.location.toLowerCase())
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
      id: 'user1',
      name: 'Test User',
      email: email,
      avatar: 'https://via.placeholder.com/50',
    });
    setCurrentView('home');
  };

  const handleRegister = (name, email, password, phone) => {
    setIsLoggedIn(true);
    setCurrentUser({
      id: 'user1',
      name: name,
      email: email,
      avatar: 'https://via.placeholder.com/50',
    });
    setCurrentView('home');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCurrentView('home');
  };

  const handleGoogleAuth = () => {
    setIsLoggedIn(true);
    setCurrentUser({
      id: 'user1',
      name: 'Google User',
      email: 'googleuser@example.com',
      avatar: 'https://via.placeholder.com/50',
    });
    setCurrentView('home');
  };

  // Item handlers
  const handlePostLostItem = (itemData) => {
    const newItem = {
      id: items.length + 1,
      type: 'lost',
      ...itemData,
      reportedBy: currentUser.id,
      status: 'active',
    };

    setItems([...items, newItem]);
    setCurrentView('myItems');
  };

  const handlePostFoundItem = (itemData) => {
    const newItem = {
      id: items.length + 1,
      type: 'found',
      ...itemData,
      reportedBy: currentUser.id,
      status: 'active',
    };

    setItems([...items, newItem]);
    setCurrentView('myItems');
  };

  const handleClaimItem = (itemId, claimData) => {
    alert('Your claim has been submitted. The finder will be notified.');
  };

  const handleSendMessage = (receiverId, itemId, messageText) => {
    const newMessage = {
      id: messages.length + 1,
      itemId: itemId,
      sender: currentUser.id,
      receiver: receiverId,
      message: messageText,
      timestamp: new Date().toISOString(),
      read: false,
    };

    setMessages([...messages, newMessage]);
    alert('Message sent successfully!');
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

      {currentView === 'auth' ? (
        authMode === 'login' ? (
          <Login handleLogin={handleLogin} setAuthMode={setAuthMode} />
        ) : (
          <Signup handleRegister={handleRegister} setAuthMode={setAuthMode} />
        )
      ) : (
        <>
          {currentView !== 'messages' && (
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              searchFilters={searchFilters}
              setSearchFilters={setSearchFilters}
            />
          )}
          <div className="content">
            {currentView === 'home' && (
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
                      <img src={item.imageUrl} alt={item.title} />
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                      <span className={`item-type ${item.type}`}>
                        {item.type === 'lost' ? 'Lost' : 'Found'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {currentView === 'lostItems' && (
              <LostItems filteredItems={filteredItems} setSelectedItem={setSelectedItem} />
            )}
            {currentView === 'foundItems' && (
              <FoundItems filteredItems={filteredItems} setSelectedItem={setSelectedItem} />
            )}
            {/* Add other views here */}
          </div>
        </>
      )}

      {selectedItem && (
        <div className="item-modal">
          <div className="modal-content">
            <button onClick={() => setSelectedItem(null)} className="close-modal">
              &times;
            </button>
            <img src={selectedItem.imageUrl} alt={selectedItem.title} />
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
            {selectedItem.type === 'found' && (
              <button
                onClick={() =>
                  handleClaimItem(selectedItem.id, { message: 'I think this is mine!' })
                }
              >
                Claim Item
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;