import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [items, setItems] = useState([]);
    const [users, setUsers] = useState([]);
    const [claims, setClaims] = useState([]);
    const [analytics, setAnalytics] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (activeTab === 'items') fetchItems();
        if (activeTab === 'users') fetchUsers();
        if (activeTab === 'claims') fetchClaims();
        if (activeTab === 'analytics' || activeTab === 'dashboard') fetchAnalytics();
        // eslint-disable-next-line
    }, [activeTab]);

    const fetchItems = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('http://localhost:5000/api/admin/items');
            const data = await res.json();
            setItems(data);
        } catch (err) {
            setError('Failed to fetch items');
        }
        setLoading(false);
    };

    const fetchUsers = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('http://localhost:5000/api/admin/users');
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            setError('Failed to fetch users');
        }
        setLoading(false);
    };

    const fetchClaims = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('http://localhost:5000/api/admin/claims');
            const data = await res.json();
            setClaims(data);
        } catch (err) {
            setError('Failed to fetch claims');
        }
        setLoading(false);
    };

    const fetchAnalytics = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('http://localhost:5000/api/admin/analytics');
            const data = await res.json();
            setAnalytics(data);
        } catch (err) {
            setError('Failed to fetch analytics');
        }
        setLoading(false);
    };

    const handleDeleteItem = async (itemId) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;
        try {
            const res = await fetch(`http://localhost:5000/api/admin/items/${itemId}`, {
                method: 'DELETE'
            });
            if (!res.ok) throw new Error('Failed to delete item');
            setItems(items.filter(item => item._id !== itemId));
        } catch (err) {
            setError('Failed to delete item');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            const res = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
                method: 'DELETE'
            });
            if (!res.ok) throw new Error('Failed to delete user');
            setUsers(users.filter(user => user._id !== userId));
        } catch (err) {
            setError('Failed to delete user');
        }
    };

    return (
        <div className="admin-dashboard">
            <header className="admin-header">
                <h1>Admin Dashboard</h1>
            </header>
            <nav className="admin-nav">
                <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>Dashboard</button>
                <button className={activeTab === 'items' ? 'active' : ''} onClick={() => setActiveTab('items')}>Items</button>
                <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>Users</button>
                <button className={activeTab === 'claims' ? 'active' : ''} onClick={() => setActiveTab('claims')}>Claims</button>
                <button className={activeTab === 'analytics' ? 'active' : ''} onClick={() => setActiveTab('analytics')}>Analytics</button>
            </nav>
            <div className="admin-content">
                {loading && <div className="loading">Loading...</div>}
                {error && <div className="error">{error}</div>}

                {activeTab === 'dashboard' && (
                    <div>
                        <h2>Dashboard Overview</h2>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <h3>Total Users</h3>
                                <p>{analytics.totalUsers || 0}</p>
                            </div>
                            <div className="stat-card">
                                <h3>Lost Items</h3>
                                <p>{analytics.totalLostItems || 0}</p>
                            </div>
                            <div className="stat-card">
                                <h3>Found Items</h3>
                                <p>{analytics.totalFoundItems || 0}</p>
                            </div>
                            <div className="stat-card">
                                <h3>Active Claims</h3>
                                <p>{analytics.activeClaims || 0}</p>
                            </div>
                            <div className="stat-card">
                                <h3>Pending Items</h3>
                                <p>{analytics.pendingItems || 0}</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'items' && (
                    <div>
                        <h2>All Items</h2>
                        <div className="items-list">
                            {items.map(item => (
                                <div key={item._id} className="item-card">
                                    <h3>{item.ItemName}</h3>
                                    <p>Type: {item.type}</p>
                                    <p>Status: {item.Status}</p>
                                    <p>Date: {new Date(item.DateLost || item.DateFound || item.CreatedAt).toLocaleDateString()}</p>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => handleDeleteItem(item._id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div>
                        <h2>All Users</h2>
                        <div className="users-list">
                            {users.map(user => (
                                <div key={user._id} className="user-card">
                                    <h3>{user.FirstName} {user.SecondName}</h3>
                                    <p>Email: {user.Email}</p>
                                    <p>Status: {user.Status}</p>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => handleDeleteUser(user._id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'claims' && (
                    <div>
                        <h2>All Claims</h2>
                        <div className="claims-list">
                            {claims.map(claim => (
                                <div key={claim._id} className="claim-card">
                                    <h3>Claim #{claim._id}</h3>
                                    <p>Item: {claim.itemId?.ItemName || 'N/A'}</p>
                                    <p>Claimant: {claim.claimantId?.FirstName || 'N/A'}</p>
                                    <p>Status: {claim.status}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'analytics' && (
                    <div>
                        <h2>Analytics</h2>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <h3>Total Users</h3>
                                <p>{analytics.totalUsers || 0}</p>
                            </div>
                            <div className="stat-card">
                                <h3>Lost Items</h3>
                                <p>{analytics.totalLostItems || 0}</p>
                            </div>
                            <div className="stat-card">
                                <h3>Found Items</h3>
                                <p>{analytics.totalFoundItems || 0}</p>
                            </div>
                            <div className="stat-card">
                                <h3>Active Claims</h3>
                                <p>{analytics.activeClaims || 0}</p>
                            </div>
                            <div className="stat-card">
                                <h3>Pending Items</h3>
                                <p>{analytics.pendingItems || 0}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;