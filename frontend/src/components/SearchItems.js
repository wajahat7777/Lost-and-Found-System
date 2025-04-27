import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './SearchItems.css';
import ClaimForm from './ClaimForm';

const categories = [
    'Electronics', 'Documents', 'Clothing', 'Accessories', 
    'Books', 'Keys', 'Bags', 'Others'
];

const locations = [
    'Library', 'Cafeteria', 'Academic Block', 'Sports Complex',
    'Parking', 'Hostel', 'Other'
];

const FilterSection = ({ filters, onFilterChange }) => {
    return (
        <div className="filters-section">
            <div className="filter-group">
                <label>Category:</label>
                <select 
                    value={filters.category} 
                    onChange={(e) => onFilterChange('category', e.target.value)}
                >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            <div className="filter-group">
                <label>Location:</label>
                <select 
                    value={filters.location} 
                    onChange={(e) => onFilterChange('location', e.target.value)}
                >
                    <option value="">All Locations</option>
                    {locations.map(loc => (
                        <option key={loc} value={loc}>{loc}</option>
                    ))}
                </select>
            </div>

            <div className="filter-group date-range">
                <label>Date Range:</label>
                <div className="date-inputs">
                    <input 
                        type="date" 
                        value={filters.startDate} 
                        onChange={(e) => onFilterChange('startDate', e.target.value)}
                        placeholder="Start Date"
                    />
                    <span>to</span>
                    <input 
                        type="date" 
                        value={filters.endDate} 
                        onChange={(e) => onFilterChange('endDate', e.target.value)}
                        placeholder="End Date"
                    />
                </div>
            </div>

            <div className="filter-group">
                <label>Sort By:</label>
                <select 
                    value={filters.sortBy} 
                    onChange={(e) => onFilterChange('sortBy', e.target.value)}
                >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                </select>
            </div>

            <button 
                className="clear-filters"
                onClick={() => onFilterChange('clear')}
            >
                Clear Filters
            </button>
        </div>
    );
};

const SearchItems = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const initialType = queryParams.get('type') || 'all';

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        category: '',
        location: '',
        startDate: '',
        endDate: '',
        sortBy: 'newest'
    });
    const [pagination, setPagination] = useState({
        page: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false
    });
    const [nearbyMode, setNearbyMode] = useState(false);
    const [radius, setRadius] = useState(5); // km
    const [showClaimForm, setShowClaimForm] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);

    // Get logged-in user's email from localStorage
    const loggedInEmail = (localStorage.getItem('userEmail') || localStorage.getItem('Email') || '').toLowerCase();

    const handleFilterChange = (filterName, value) => {
        if (filterName === 'clear') {
            setFilters({
                category: '',
                location: '',
                startDate: '',
                endDate: '',
                sortBy: 'newest'
            });
            setPagination(prev => ({ ...prev, page: 1 }));
        } else {
            setFilters(prev => ({
                ...prev,
                [filterName]: value
            }));
            setPagination(prev => ({ ...prev, page: 1 }));
        }
    };

    const fetchItems = async () => {
        try {
            setLoading(true);
            setError('');
            
            const params = new URLSearchParams({
                type: initialType,
                page: pagination.page.toString(),
                limit: '10',
                ...(filters.category && { category: filters.category }),
                ...(filters.location && { location: filters.location }),
                ...(filters.startDate && { startDate: filters.startDate }),
                ...(filters.endDate && { endDate: filters.endDate }),
                sortBy: filters.sortBy
            });

            const response = await fetch(`http://localhost:5000/api/search?${params}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch items');
            }

            let newItems = [];
            if (initialType === 'lost') {
                newItems = data.lostItems || [];
            } else if (initialType === 'found') {
                newItems = data.foundItems || [];
            } else {
                newItems = [
                    ...(data.lostItems || []).map(item => ({ ...item, sourceType: 'lost' })),
                    ...(data.foundItems || []).map(item => ({ ...item, sourceType: 'found' }))
                ];
            }
            
            setItems(newItems);
            setPagination({
                page: data.pagination.page,
                totalPages: data.pagination.totalPages,
                hasNextPage: data.pagination.hasNextPage,
                hasPrevPage: data.pagination.hasPrevPage
            });
        } catch (err) {
            console.error('Error fetching items:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchNearbyItems = async (lat, lng, rad = 5) => {
        try {
            setLoading(true);
            setError('');
            const params = new URLSearchParams({
                lat: lat.toString(),
                lng: lng.toString(),
                radius: rad.toString(),
                type: initialType
            });
            const response = await fetch(`http://localhost:5000/api/search/nearby?${params}`);
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch nearby items');
            }
            let newItems = [];
            if (initialType === 'lost') {
                newItems = data.lostItems || [];
            } else if (initialType === 'found') {
                newItems = data.foundItems || [];
            } else {
                newItems = [
                    ...(data.lostItems || []).map(item => ({ ...item, sourceType: 'lost' })),
                    ...(data.foundItems || []).map(item => ({ ...item, sourceType: 'found' }))
                ];
            }
            setItems(newItems);
            setNearbyMode(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFindNearby = () => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            return;
        }
        setError('');
        navigator.geolocation.getCurrentPosition(
            (position) => {
                fetchNearbyItems(position.coords.latitude, position.coords.longitude, radius);
            },
            () => setError('Unable to retrieve your location')
        );
    };

    useEffect(() => {
        fetchItems();
    }, [initialType, filters, pagination.page]);

    const handlePageChange = (newPage) => {
        setPagination(prev => ({
            ...prev,
            page: newPage
        }));
    };

    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            return 'Invalid Date';
        }
    };

    // Social Media Share Functions
    const getItemUrl = (item) => {
        // If you have a public item detail page, use that route. Otherwise, use the homepage with a query param.
        return `${window.location.origin}/item/${item._id}`;
    };

    const shareOnFacebook = (item) => {
        const url = encodeURIComponent(getItemUrl(item));
        const text = encodeURIComponent(`Check out this ${item.sourceType || item.Status} item: ${item.ItemName}`);
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank');
    };

    const shareOnTwitter = (item) => {
        const url = encodeURIComponent(getItemUrl(item));
        const text = encodeURIComponent(`Check out this ${item.sourceType || item.Status} item: ${item.ItemName}`);
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
    };

    const shareOnWhatsApp = (item) => {
        const url = encodeURIComponent(getItemUrl(item));
        const text = encodeURIComponent(`Check out this ${item.sourceType || item.Status} item: ${item.ItemName} - ${url}`);
        window.open(`https://wa.me/?text=${text}`, '_blank');
    };

    const shareOnInstagram = (item) => {
        const url = getItemUrl(item);
        navigator.clipboard.writeText(url).then(() => {
            alert('Link copied to clipboard! You can now paste it in your Instagram story or post.');
        });
    };

    return (
        <div className="search-items-container">
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{ flex: 1 }}>
                    <FilterSection filters={filters} onFilterChange={handleFilterChange} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem', marginLeft: '2rem' }}>
                    <button className="btn btn-primary" onClick={handleFindNearby} disabled={loading} style={{ width: '170px' }}>
                        Find items near me
                    </button>
                    <label className="radius-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                        Radius:
                        <select className="radius-dropdown" value={radius} onChange={e => setRadius(Number(e.target.value))}>
                            <option value={1}>1 km</option>
                            <option value={2}>2 km</option>
                            <option value={5}>5 km</option>
                            <option value={10}>10 km</option>
                            <option value={20}>20 km</option>
                        </select>
                    </label>
                    {nearbyMode && (
                        <button className="btn btn-secondary" onClick={() => { setNearbyMode(false); fetchItems(); }} style={{ width: '170px' }}>
                            Show all items
                        </button>
                    )}
                </div>
            </div>
            {error && <div className="error-message">{error}</div>}

            {loading ? (
                <div className="loading">Loading...</div>
            ) : (
                <>
                    <div className="items-grid">
                        {items.map((item) => (
                            <div key={item._id} className="item-card">
                                {item.image && (
                                    <div className="item-image">
                                        <img src={item.image} alt={item.ItemName} />
                                    </div>
                                )}
                                <div className="item-details">
                                    <h3>{item.ItemName}</h3>
                                    <p className="item-description">{item.Description}</p>
                                    <div className="item-meta">
                                        <span className={`item-type ${item.sourceType || item.Status.toLowerCase()}`}>
                                            {item.sourceType || item.Status}
                                        </span>
                                        <span className="item-category">{item.Category}</span>
                                        <span className="item-location">{item.Location}</span>
                                    </div>
                                    <p className="item-date">
                                        {item.sourceType === 'found' || item.Status === 'found' ? (
                                            <>Found on: {formatDate(item.DateFound)}</>
                                        ) : (
                                            <>Lost on: {formatDate(item.DateLost)}</>
                                        )}
                                    </p>
                                    <p className="contact-info">
                                        Contact: {item.ContactInfo}
                                    </p>
                                    <p className="reporter-info">
                                        Posted by: {item.UserName} ({item.Email})
                                    </p>
                                    {showClaimForm && selectedItemId === item._id && (
                                        <ClaimForm 
                                            itemId={item._id} 
                                            onSuccess={() => {
                                                setShowClaimForm(false);
                                                setSelectedItemId(null);
                                            }} 
                                        />
                                    )}
                                    <button 
                                        onClick={() => {
                                            setSelectedItemId(item._id);
                                            setShowClaimForm(true);
                                        }}
                                    >
                                        Claim This Item
                                    </button>
                                    <div className="share-buttons" style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                                        <button onClick={() => shareOnFacebook(item)} style={{ background: '#4267B2', color: 'white', border: 'none', borderRadius: 4, padding: '0.3rem 0.7rem', cursor: 'pointer' }}>Facebook</button>
                                        <button onClick={() => shareOnTwitter(item)} style={{ background: '#1DA1F2', color: 'white', border: 'none', borderRadius: 4, padding: '0.3rem 0.7rem', cursor: 'pointer' }}>Twitter</button>
                                        <button onClick={() => shareOnWhatsApp(item)} style={{ background: '#25D366', color: 'white', border: 'none', borderRadius: 4, padding: '0.3rem 0.7rem', cursor: 'pointer' }}>WhatsApp</button>
                                        <button onClick={() => shareOnInstagram(item)} style={{ background: '#E1306C', color: 'white', border: 'none', borderRadius: 4, padding: '0.3rem 0.7rem', cursor: 'pointer' }}>Instagram</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {!loading && items.length === 0 && (
                        <div className="no-results">
                            No items found matching your criteria
                        </div>
                    )}

                    {items.length > 0 && (
                        <div className="pagination">
                            <button 
                                onClick={() => handlePageChange(pagination.page - 1)}
                                disabled={!pagination.hasPrevPage}
                                className="pagination-button"
                            >
                                Previous
                            </button>
                            <span className="page-info">
                                Page {pagination.page} of {pagination.totalPages}
                            </span>
                            <button 
                                onClick={() => handlePageChange(pagination.page + 1)}
                                disabled={!pagination.hasNextPage}
                                className="pagination-button"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default SearchItems; 