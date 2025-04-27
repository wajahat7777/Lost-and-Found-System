import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        FirstName: '',
        SecondName: '',
        Email: '',
        UserName: '',
        Number: '',
        Password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (!formData.FirstName || !formData.SecondName || !formData.Email || 
            !formData.UserName || !formData.Number || !formData.Password || 
            !formData.confirmPassword) {
            setError('All fields are required');
            return false;
        }

        if (formData.Password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.Email)) {
            setError('Please enter a valid email address');
            return false;
        }

        const phoneRegex = /^\d{11}$/;
        if (!phoneRegex.test(formData.Number)) {
            setError('Please enter a valid 11-digit phone number');
            return false;
        }

        if (formData.Password.length < 6) {
            setError('Password must be at least 6 characters long');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    FirstName: formData.FirstName,
                    SecondName: formData.SecondName,
                    Email: formData.Email,
                    UserName: formData.UserName,
                    Number: formData.Number,
                    Password: formData.Password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            // If registration is successful, navigate to verification page
            navigate('/verify', { state: { email: formData.Email } });

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-form-container">
                <h2>Create Account</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit} className="register-form" autoComplete="off">
                    <div className="form-group">
                        <label htmlFor="FirstName">First Name</label>
                        <input
                            type="text"
                            id="FirstName"
                            name="FirstName"
                            value={formData.FirstName}
                            onChange={handleChange}
                            placeholder="Enter your first name"
                            autoComplete="off"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="SecondName">Last Name</label>
                        <input
                            type="text"
                            id="SecondName"
                            name="SecondName"
                            value={formData.SecondName}
                            onChange={handleChange}
                            placeholder="Enter your last name"
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
                            placeholder="Enter your email"
                            autoComplete="off"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="UserName">Username</label>
                        <input
                            type="text"
                            id="UserName"
                            name="UserName"
                            value={formData.UserName}
                            onChange={handleChange}
                            placeholder="Choose a username"
                            autoComplete="off"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="Number">Phone Number</label>
                        <input
                            type="tel"
                            id="Number"
                            name="Number"
                            value={formData.Number}
                            onChange={handleChange}
                            placeholder="Enter your phone number (11 digits)"
                            autoComplete="off"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="Password">Password</label>
                        <input
                            type="password"
                            id="Password"
                            name="Password"
                            value={formData.Password}
                            onChange={handleChange}
                            placeholder="Create a password"
                            autoComplete="new-password"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm your password"
                            autoComplete="off"
                        />
                    </div>

                    <button type="submit" className="register-button" disabled={loading}>
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>

                <div className="login-link">
                    Already have an account? <a href="/login">Login here</a>
                </div>
            </div>
        </div>
    );
};

export default Register; 