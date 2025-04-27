import React, { useEffect, useState } from 'react';

const FinderClaims = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  const fetchClaims = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/claims/finder', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setClaims(data.claims || []);
      } else {
        setError(data.message || 'Failed to fetch claims');
      }
    } catch (err) {
      setError('Error fetching claims');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const handleAction = async (claimId, status) => {
    setActionMessage('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/claims/${claimId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (res.ok) {
        setActionMessage(`Claim ${status}`);
        fetchClaims();
      } else {
        setActionMessage(data.message || 'Action failed');
      }
    } catch (err) {
      setActionMessage('Action failed');
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '2rem auto', padding: 20, background: '#fff', borderRadius: 10 }}>
      <h2>Claims for Your Found Items</h2>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {actionMessage && <div style={{ color: 'green' }}>{actionMessage}</div>}
      {claims.length === 0 && !loading && <div>No claims to review.</div>}
      {claims.map(claim => (
        <div key={claim._id} style={{ border: '1px solid #eee', borderRadius: 8, margin: '1rem 0', padding: 16 }}>
          <div><b>Item:</b> {claim.itemId?.ItemName || 'N/A'}</div>
          <div><b>Claimant:</b> {claim.claimantId?.UserName || 'N/A'} ({claim.claimantId?.Email || 'N/A'})</div>
          <div><b>Proof:</b> {claim.proofText || 'None'}</div>
          {claim.proofFile && (
            <div><b>Proof File:</b> <a href={claim.proofFile} target="_blank" rel="noopener noreferrer">View</a></div>
          )}
          <div><b>Status:</b> {claim.status}</div>
          {claim.status === 'pending' && (
            <div style={{ marginTop: 8 }}>
              <button onClick={() => handleAction(claim._id, 'approved')} style={{ marginRight: 8 }}>Approve</button>
              <button onClick={() => handleAction(claim._id, 'rejected')}>Reject</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FinderClaims; 