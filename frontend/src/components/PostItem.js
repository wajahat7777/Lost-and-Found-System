import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './PostItem.css';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const DEFAULT_CENTER = [33.6844, 73.0479]; // Islamabad fallback

const LocationPicker = ({ setLatLng, initialCenter }) => {
  const [marker, setMarker] = useState(initialCenter ? { lat: initialCenter[0], lng: initialCenter[1] } : null);
  useMapEvents({
    click(e) {
      setMarker(e.latlng);
      setLatLng(e.latlng);
    },
  });
  return marker ? <Marker position={marker} /> : null;
};

const PostItem = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const defaultType = location.state?.type || 'lost';
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [latLng, setLatLng] = useState({ latitude: '', longitude: '' });
    const [showMap, setShowMap] = useState(false);
    const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
    const [geoError, setGeoError] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const [formData, setFormData] = useState({
        type: defaultType,
        UserName: '',
        Email: '',
        ItemName: '',
        Description: '',
        Category: '',
        Location: '',
        DateLost: new Date().toISOString().split('T')[0],
        DateFound: new Date().toISOString().split('T')[0],
        ContactInfo: '',
        Status: 'Open'
    });

    const categories = [
        'Electronics',
        'Clothing',
        'Accessories',
        'Documents',
        'Keys',
        'Bags',
        'Others'
    ];

    useEffect(() => {
        const userEmail = localStorage.getItem('userEmail');
        const userName = localStorage.getItem('userName');
        if (userEmail) {
            setFormData(prev => ({ 
                ...prev, 
                Email: userEmail,
                UserName: userName || 'Anonymous',
                ContactInfo: userEmail // Using email as default contact info
            }));
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUseMyLocation = () => {
        setGeoError('');
        if (!navigator.geolocation) {
            setGeoError('Geolocation is not supported by your browser');
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLatLng({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
            },
            (err) => setGeoError('Unable to retrieve your location. Please allow location access in your browser.'),
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    const handleShowMap = () => {
        setGeoError('');
        if (latLng.latitude && latLng.longitude) {
            setMapCenter([parseFloat(latLng.latitude), parseFloat(latLng.longitude)]);
            setShowMap(true);
            return;
        }
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setMapCenter([position.coords.latitude, position.coords.longitude]);
                    setShowMap(true);
                },
                () => {
                    setMapCenter(DEFAULT_CENTER);
                    setShowMap(true);
                },
                { enableHighAccuracy: true, timeout: 10000 }
            );
        } else {
            setMapCenter(DEFAULT_CENTER);
            setShowMap(true);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Please login to post an item');
            }

            let requestData;
            let headers = {
                'Authorization': `Bearer ${token}`
            };

            if (selectedImage) {
                // If there's an image, use FormData
                requestData = new FormData();
                requestData.append('email', formData.Email);
                requestData.append('itemName', formData.ItemName);
                requestData.append('description', formData.Description);
                requestData.append('category', formData.Category);
                requestData.append('location', formData.Location);
                requestData.append('contactInfo', formData.ContactInfo);
                requestData.append('image', selectedImage);
                
                if (formData.type === 'lost') {
                    requestData.append('dateLost', formData.DateLost);
                } else {
                    requestData.append('dateFound', formData.DateFound);
                }

                if (latLng.latitude) requestData.append('latitude', latLng.latitude);
                if (latLng.longitude) requestData.append('longitude', latLng.longitude);
            } else {
                // If no image, use JSON
                requestData = {
                email: formData.Email,
                itemName: formData.ItemName,
                description: formData.Description,
                category: formData.Category,
                location: formData.Location,
                contactInfo: formData.ContactInfo,
                    ...(formData.type === 'lost' ? { dateLost: formData.DateLost } : { dateFound: formData.DateFound }),
                    ...(latLng.latitude && { latitude: latLng.latitude }),
                    ...(latLng.longitude && { longitude: latLng.longitude })
                };
                headers['Content-Type'] = 'application/json';
            }

            // Debug: Log request data
            console.log('Request data:', requestData);
            if (selectedImage) {
                console.log('FormData entries:');
                for (let pair of requestData.entries()) {
                    console.log(pair[0] + ': ' + pair[1]);
                }
            }

            // Use the correct endpoint based on item type
            const endpoint = formData.type === 'lost' ? 'post/lost' : 'post/found';
            console.log('Sending request to:', `http://localhost:5000/api/lfms/${endpoint}`);
            
            const response = await fetch(`http://localhost:5000/api/lfms/${endpoint}`, {
                method: 'POST',
                headers: headers,
                body: selectedImage ? requestData : JSON.stringify(requestData)
            });

            const data = await response.json();
            console.log('Response from server:', data);

            if (!response.ok) {
                throw new Error(data.message || 'Failed to post item');
            }

            setSuccess('Item posted successfully!');
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (err) {
            console.error('Error submitting form:', err);
            setError(err.message || 'An error occurred while posting the item');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="post-item-container">
            <div className="post-item-card">
                <h1 className="form-title">Post {formData.type === 'lost' ? 'Lost' : 'Found'} Item</h1>
                
                {error && <div className="alert alert-error">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}
                {geoError && <div className="alert alert-error">{geoError}</div>}
                
                <form onSubmit={handleSubmit} className="post-item-form" autoComplete="off">
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="type">Type</label>
                            <select
                                id="type"
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="form-control"
                                disabled={isLoading}
                                autoComplete="off"
                            >
                                <option value="lost">Lost</option>
                                <option value="found">Found</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="UserName">User Name</label>
                            <input
                                type="text"
                                id="UserName"
                                name="UserName"
                                value={formData.UserName}
                                onChange={handleChange}
                                className="form-control"
                                required
                                placeholder="Your name"
                                autoComplete="off"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="Email">Email</label>
                            <input
                                type="email"
                                id="Email"
                                name="Email"
                                value={formData.Email}
                                onChange={handleChange}
                                className="form-control"
                                required
                                placeholder="Your email address"
                                autoComplete="off"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="ItemName">Item Name</label>
                            <input
                                type="text"
                                id="ItemName"
                                name="ItemName"
                                value={formData.ItemName}
                                onChange={handleChange}
                                className="form-control"
                                required
                                disabled={isLoading}
                                placeholder="Enter item name"
                                autoComplete="off"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="Category">Category</label>
                            <select
                                id="Category"
                                name="Category"
                                value={formData.Category}
                                onChange={handleChange}
                                className="form-control"
                                required
                                disabled={isLoading}
                                autoComplete="off"
                            >
                                <option value="">Select a category</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="Location">Location</label>
                            <input
                                type="text"
                                id="Location"
                                name="Location"
                                value={formData.Location}
                                onChange={handleChange}
                                className="form-control"
                                required
                                disabled={isLoading}
                                placeholder="Where was it lost/found?"
                                autoComplete="off"
                            />
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                <button type="button" className="btn btn-secondary" onClick={handleUseMyLocation} disabled={isLoading}>
                                    Use My Location
                                </button>
                                <button type="button" className="btn btn-secondary" onClick={handleShowMap} disabled={isLoading}>
                                    Pick on Map
                                </button>
                            </div>
                            <div className="latlng-row">
                                <label>Latitude:</label>
                                <input type="text" value={latLng.latitude} readOnly autoComplete="off" />
                                <label style={{ marginLeft: 10 }}>Longitude:</label>
                                <input type="text" value={latLng.longitude} readOnly autoComplete="off" />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="date">Date</label>
                            <input
                                type="date"
                                id={formData.type === 'lost' ? 'DateLost' : 'DateFound'}
                                name={formData.type === 'lost' ? 'DateLost' : 'DateFound'}
                                value={formData[formData.type === 'lost' ? 'DateLost' : 'DateFound']}
                                onChange={handleChange}
                                className="form-control"
                                required
                                disabled={isLoading}
                                autoComplete="off"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="ContactInfo">Contact Information</label>
                            <input
                                type="text"
                                id="ContactInfo"
                                name="ContactInfo"
                                value={formData.ContactInfo}
                                onChange={handleChange}
                                className="form-control"
                                required
                                disabled={isLoading}
                                placeholder="Your contact information"
                                autoComplete="off"
                            />
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="Description">Description</label>
                            <textarea
                                id="Description"
                                name="Description"
                                value={formData.Description}
                                onChange={handleChange}
                                className="form-control"
                                required
                                disabled={isLoading}
                                placeholder="Provide detailed description of the item..."
                                rows="4"
                                autoComplete="off"
                            />
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="image">Item Image</label>
                            <div className="image-upload-container">
                                <input
                                    type="file"
                                    id="image"
                                    name="image"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="image-upload-input"
                                    disabled={isLoading}
                                />
                                {imagePreview && (
                                    <div className="image-preview">
                                        <img src={imagePreview} alt="Preview" />
                                        <button
                                            type="button"
                                            className="remove-image"
                                            onClick={() => {
                                                setSelectedImage(null);
                                                setImagePreview(null);
                                            }}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button 
                            type="button" 
                            onClick={() => navigate(-1)} 
                            className="btn btn-secondary"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="btn btn-primary"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Posting...' : 'Post Item'}
                        </button>
                    </div>
                </form>
            </div>
            {showMap && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: 'white', padding: 20, borderRadius: 10, minWidth: 400, minHeight: 400, position: 'relative', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}>
                        <button style={{ position: 'absolute', top: 10, right: 10, zIndex: 10, fontSize: 18 }} onClick={() => setShowMap(false)}>X</button>
                        <MapContainer center={mapCenter} zoom={14} style={{ height: 350, width: 350 }} scrollWheelZoom={true}>
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <LocationPicker setLatLng={(latlng) => {
                                setLatLng({ latitude: latlng.lat, longitude: latlng.lng });
                                setShowMap(false);
                            }} initialCenter={mapCenter} />
                        </MapContainer>
                        <div style={{ marginTop: 10, textAlign: 'center', color: '#555', fontSize: '0.95em' }}>
                            Click on the map to select a location.
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostItem; 