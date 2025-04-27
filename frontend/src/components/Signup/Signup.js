import React, { useState } from 'react';
import './Signup.css';

const Signup = ({ handleRegister, setAuthStep }) => {
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
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.Password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const dataToSend = { ...formData };
      delete dataToSend.confirmPassword;
      await handleRegister(dataToSend);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              name="FirstName"
              value={formData.FirstName}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label>Second Name</label>
            <input
              type="text"
              name="SecondName"
              value={formData.SecondName}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>
          <div className="form-group full-width">
            <label>Email</label>
            <input
              type="email"
              name="Email"
              value={formData.Email}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>
          <div className="form-group full-width">
            <label>Username</label>
            <input
              type="text"
              name="UserName"
              value={formData.UserName}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>
          <div className="form-group full-width">
            <label>Phone Number</label>
            <input
              type="tel"
              name="Number"
              value={formData.Number}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="Password"
              value={formData.Password}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>
        </div>
        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <p className="auth-switch">
        Already have an account?{' '}
        <button onClick={() => setAuthStep('login')} className="link-button">
          Login
        </button>
      </p>
    </div>
  );
};

export default Signup;