import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';  // Added useLocation
import './Verify.css';

const Verify = () => {
    const navigate = useNavigate();
    const location = useLocation(); // To receive passed email

    const [formData, setFormData] = useState({
        email: location.state?.email || '',   // Auto-fill email if passed
        secNum: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleResendCode = async () => {
        try {
            setResendLoading(true);
            setError('');
            setSuccessMessage('');

            const response = await fetch('http://localhost:5000/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Email: formData.email,
                    resend: true
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to resend verification code');
            }

            setSuccessMessage('Verification code has been resent to your email');
        } catch (err) {
            setError(err.message);
        } finally {
            setResendLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!formData.email || !formData.secNum) {
            setError('Both email and verification code are required');
            return;
        }

        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/users/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    secNum: formData.secNum
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Verification failed');
            }

            navigate('/login', { 
                state: { 
                    message: 'Account verified successfully! Please log in.' 
                }
            });

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterAgain = () => {
        navigate('/register');
    };

    return (
        <div className="verify-container">
            <div className="verify-form-container">
                <h2>Verify Your Account</h2>
                <p className="verify-instructions">
                    Please enter your verification code sent to your email address.
                </p>
                {error && <div className="error-message">{error}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>}
                <form onSubmit={handleSubmit} className="verify-form">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="secNum">Verification Code</label>
                        <input
                            type="text"
                            id="secNum"
                            name="secNum"
                            value={formData.secNum}
                            onChange={handleChange}
                            placeholder="Enter verification code"
                            required
                        />
                    </div>
                    <button type="submit" className="verify-button" disabled={loading}>
                        {loading ? 'Verifying...' : 'Verify Account'}
                    </button>
                </form>
                <div className="action-links">
                    <button 
                        onClick={handleResendCode} 
                        className="resend-button"
                        disabled={resendLoading}
                    >
                        {resendLoading ? 'Sending...' : 'Resend Code'}
                    </button>
                    <button 
                        onClick={handleRegisterAgain} 
                        className="register-again-button"
                    >
                        Register Again
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Verify;
