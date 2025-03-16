import React from 'react';
import './Navigation.css';

const Navigation = ({
  isLoggedIn,
  currentUser,
  currentView,
  setCurrentView,
  setSearchFilters,
  handleLogout,
}) => {
  return (
    <nav className="app-nav">
      <div className="logo" onClick={() => setCurrentView('home')}>
        Lost & Found
      </div>

      <div className="nav-links">
        <button
          className={`nav-link ${currentView === 'home' ? 'active' : ''}`}
          onClick={() => setCurrentView('home')}
        >
          Home
        </button>
        <button
          className={`nav-link ${currentView === 'lostItems' ? 'active' : ''}`}
          onClick={() => {
            setCurrentView('lostItems');
            setSearchFilters((prev) => ({ ...prev, type: 'lost' }));
          }}
        >
          Lost Items
        </button>
        <button
          className={`nav-link ${currentView === 'foundItems' ? 'active' : ''}`}
          onClick={() => {
            setCurrentView('foundItems');
            setSearchFilters((prev) => ({ ...prev, type: 'found' }));
          }}
        >
          Found Items
        </button>

        {isLoggedIn && (
          <>
            <button
              className={`nav-link ${currentView === 'postItem' ? 'active' : ''}`}
              onClick={() => setCurrentView('postItem')}
            >
              Post Item
            </button>
            <button
              className={`nav-link ${currentView === 'myItems' ? 'active' : ''}`}
              onClick={() => setCurrentView('myItems')}
            >
              My Items
            </button>
            <button
              className={`nav-link ${currentView === 'messages' ? 'active' : ''}`}
              onClick={() => setCurrentView('messages')}
            >
              Messages
            </button>
          </>
        )}
      </div>

      <div className="auth-section">
        {isLoggedIn ? (
          <div className="user-menu">
            <img src={currentUser.avatar} alt="Avatar" className="user-avatar" />
            <span>{currentUser.name}</span>
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          </div>
        ) : (
          <button onClick={() => setCurrentView('auth')} className="btn-login">
            Login / Register
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navigation;