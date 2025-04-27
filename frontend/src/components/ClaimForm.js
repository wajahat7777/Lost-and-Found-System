import React, { useState, useEffect } from 'react';

const ClaimForm = ({ itemId, onSuccess }) => {
  const [proofText, setProofText] = useState('');
  const [proofFile, setProofFile] = useState(null);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Reset form when itemId changes
    setProofText('');
    setProofFile(null);
    setMessage('');
    setIsSubmitting(false);
  }, [itemId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!itemId) {
      setMessage('Error: Invalid item reference');
      return;
    }

    if (!proofText.trim()) {
      setMessage('Please provide proof description');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('Please login to submit a claim');
        return;
      }

      const formData = new FormData();
      formData.append('itemId', itemId);
      formData.append('proofText', proofText.trim());
      if (proofFile) formData.append('proofFile', proofFile);

      console.log('Submitting claim for item:', itemId);
      const res = await fetch('http://localhost:5000/api/claims', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      const data = await res.json();
      
      if (res.ok) {
        setMessage('Claim submitted successfully!');
        setProofText('');
        setProofFile(null);
        onSuccess && onSuccess();
      } else {
        console.error('Claim submission error:', data);
        setMessage(data.message || 'Error submitting claim. Please try again.');
        if (data.details) {
          console.error('Error details:', data.details);
        }
      }
    } catch (error) {
      console.error('Claim submission error:', error);
      setMessage('Failed to submit claim. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="claim-form">
      <div className="form-group">
        <label htmlFor="proofText">Describe your proof:*</label>
        <textarea 
          id="proofText"
          value={proofText} 
          onChange={e => setProofText(e.target.value)}
          placeholder="Please provide detailed information about your ownership..."
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="proofFile">Upload proof (optional):</label>
        <input 
          type="file" 
          id="proofFile"
          onChange={e => setProofFile(e.target.files[0])} 
        />
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting || !proofText.trim()}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Claim'}
      </button>

      {message && (
        <div className={`message ${message.includes('Error') || message.includes('Failed') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}
    </form>
  );
};

export default ClaimForm;