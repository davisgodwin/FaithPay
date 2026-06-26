// Receipt.jsx
import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import './Receipt.css';

function Receipt() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Grab the transaction data passed during navigation redirect
  const { donation } = location.state || {};

  if (!donation) {
    return (
      <div className="text-center mt-5">
        <h4>No receipt data found.</h4>
        <Button variant="success" onClick={() => navigate('/')} className="mt-3">Go Home</Button>
      </div>
    );
  }

  return (
    <div className="ff-receipt-container">
      <Card className="ff-receipt-card">
        <div className="ff-receipt-success-banner">
          <div className="ff-receipt-icon-circle">✓</div>
          <h3>Payment Successful</h3>
          <p className="mb-0">Thank you for your generous contribution!</p>
        </div>
        
        <div className="ff-receipt-body">
          <div className="ff-receipt-row">
            <span className="ff-receipt-label">Donor Name</span>
            <span className="ff-receipt-value">{donation.name}</span>
          </div>
          <div className="ff-receipt-row">
  <span className="ff-receipt-label">Amount Paid</span>
  <span className="ff-receipt-value amount">
    {donation.currencySymbol || '₦'}{Number(donation.amount).toLocaleString()}
  </span>
</div>
          <div className="ff-receipt-row">
            <span className="ff-receipt-label">Amount Paid</span>
            <span className="ff-receipt-value amount">₦{Number(donation.amount).toLocaleString()}</span>
          </div>
          <div className="ff-receipt-row">
            <span className="ff-receipt-label">Date</span>
            <span className="ff-receipt-value">{donation.date}</span>
          </div>
          <div className="ff-receipt-row">
            <span className="ff-receipt-label">Reference</span>
            <span className="ff-receipt-value text-muted small">{donation.reference || 'N/A'}</span>
          </div>

          <Button variant="outline-success" className="w-100 mt-4 py-2" onClick={() => navigate('/')}>
            Make Another Donation
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default Receipt;