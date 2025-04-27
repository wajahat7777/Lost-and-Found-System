import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
    const navigate = useNavigate();
    const isLoggedIn = localStorage.getItem('token') !== null;

    const handlePostItem = (type) => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }
        navigate('/post', { state: { type } });
    };

    const handleAction = (path) => {
        navigate(path);
    };

    return (
        <div className="home-container">
            {!isLoggedIn ? (
                <>
                    {/* Hero Section - Only shown when not logged in */}
                    <section className="hero">
                        <div className="container">
                            <div className="hero-content">
                                <h1 className="hero-title">Welcome to Lost and Found Management System</h1>
                                <p className="hero-subtitle">Find your lost items or help others find theirs</p>
                                <div className="hero-buttons">
                                    <Link to="/lost-items" className="btn btn-primary">Browse Lost Items</Link>
                                    <Link to="/found-items" className="btn btn-outline">Browse Found Items</Link>
                                </div>
                            </div>
                        </div>
                    </section>
                </>
            ) : null}

            {/* Quick Actions Section */}
            <section className="quick-actions-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Quick Actions</h2>
                    </div>
                    <div className="features-grid">
                        {isLoggedIn ? (
                            <>
                                <div className="feature-card" onClick={() => handlePostItem('lost')}>
                                    <div className="feature-content">
                                        <div className="feature-icon">
                                            <i className="fas fa-search"></i>
                                        </div>
                                        <h3 className="feature-title">Post Lost Item</h3>
                                        <p className="feature-description">Report an item you've lost with detailed information and photos</p>
                                        <button className="btn btn-primary">Post Now</button>
                                    </div>
                                </div>
                                <div className="feature-card" onClick={() => handlePostItem('found')}>
                                    <div className="feature-content">
                                        <div className="feature-icon">
                                            <i className="fas fa-hand-holding"></i>
                                        </div>
                                        <h3 className="feature-title">Post Found Item</h3>
                                        <p className="feature-description">Report an item you've found to help reunite it with its owner</p>
                                        <button className="btn btn-primary">Post Now</button>
                                    </div>
                                </div>
                                <div className="feature-card" onClick={() => handleAction('/my-items')}>
                                    <div className="feature-content">
                                        <div className="feature-icon">
                                            <i className="fas fa-list"></i>
                                        </div>
                                        <h3 className="feature-title">My Items</h3>
                                        <p className="feature-description">View and manage all your posted items in one place</p>
                                        <button className="btn btn-primary">View Items</button>
                                    </div>
                                </div>
                                <div className="feature-card" onClick={() => handleAction('/search?type=lost')}>
                                    <div className="feature-content">
                                        <div className="feature-icon">
                                            <i className="fas fa-search"></i>
                                        </div>
                                        <h3 className="feature-title">Search Lost Items</h3>
                                        <p className="feature-description">Browse through reported lost items to help find what you're looking for</p>
                                        <button className="btn btn-primary">Search Now</button>
                                    </div>
                                </div>
                                <div className="feature-card" onClick={() => handleAction('/search?type=found')}>
                                    <div className="feature-content">
                                        <div className="feature-icon">
                                            <i className="fas fa-search"></i>
                                        </div>
                                        <h3 className="feature-title">Search Found Items</h3>
                                        <p className="feature-description">Look through items that others have found to locate your lost belongings</p>
                                        <button className="btn btn-primary">Search Now</button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="feature-card" onClick={() => handleAction('/lost-items')}>
                                    <div className="feature-content">
                                        <div className="feature-icon">
                                            <i className="fas fa-search"></i>
                                        </div>
                                        <h3 className="feature-title">Browse Lost Items</h3>
                                        <p className="feature-description">View all reported lost items in our system</p>
                                        <button className="btn btn-primary">Browse Now</button>
                                    </div>
                                </div>
                                <div className="feature-card" onClick={() => handleAction('/found-items')}>
                                    <div className="feature-content">
                                        <div className="feature-icon">
                                            <i className="fas fa-search"></i>
                                        </div>
                                        <h3 className="feature-title">Browse Found Items</h3>
                                        <p className="feature-description">View all reported found items in our system</p>
                                        <button className="btn btn-primary">Browse Now</button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {!isLoggedIn ? (
                <>
                    {/* Call to Action Section - Only shown when not logged in */}
                    <section className="cta">
                        <div className="container">
                            <div className="cta-container">
                                <h2 className="cta-title">Ready to Find Your Lost Items?</h2>
                                <p className="cta-subtitle">Join our community and help others find their belongings</p>
                                <div className="cta-buttons">
                                    <Link to="/register" className="btn btn-light">Get Started</Link>
                                    <Link to="/lost-items" className="btn btn-outline">Browse Items</Link>
                                </div>
                            </div>
                        </div>
                    </section>
                </>
            ) : null}
        </div>
    );
};

export default Home; 