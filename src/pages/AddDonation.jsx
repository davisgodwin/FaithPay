// AddDonation.jsx
import React, { useState } from 'react';
import { Card, Form, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import PaymentButton from '../components/PaymentButton'; 
import './AddDonation.css'; 

function AddDonation({ onAdd }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: '',
    amount: '',
    currency: 'NGN', // Default to Naira
    date: ''
  });

  const currencySymbols = {
    NGN: '₦',
    USD: '$',
    GBP: '£'
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentSuccess = (reference) => {
    const newDonation = {
      name: formData.name.trim(),
      type: formData.type,
      amount: parseFloat(formData.amount),
      currency: formData.currency, // Store currency string (e.g., 'USD')
      currencySymbol: currencySymbols[formData.currency], // Store explicit symbol
      date: formData.date,
      reference: reference 
    };

    onAdd(newDonation); 
    navigate('/receipt', { state: { donation: newDonation } });
  };

  const isFormValid = formData.name && formData.type && formData.amount && formData.date && formData.email;

  return (
    <div className="ff-form-container">
      <Card className="ff-form-card">
        <Card.Body>
          <h3 className="ff-form-title">Record New Contribution</h3>
          <p className="ff-form-subtitle">Enter details below to update the ledger records via secure payment.</p>

          <Form onSubmit={(e) => e.preventDefault()}>
            <Form.Group className="mb-3" controlId="formDonorName">
              <Form.Label className="ff-form-label">Donor Full Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Enter complete name"
                value={formData.name}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formDonorEmail">
              <Form.Label className="ff-form-label">Email Address (for receipt)</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="donor@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formCurrency">
              <Form.Label className="ff-form-label">Select Currency Type</Form.Label>
              <Form.Select name="currency" value={formData.currency} onChange={handleChange}>
                <option value="NGN">Nigerian Naira (₦ - NGN)</option>
                <option value="USD">US Dollar ($ - USD)</option>
                <option value="GBP">British Pound (£ - GBP)</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formDonationType">
              <Form.Label className="ff-form-label">Contribution Category</Form.Label>
              <Form.Select name="type" value={formData.type} onChange={handleChange}>
                <option value="">-- Select Type --</option>
                <option value="Tithe">Tithe</option>
                <option value="Offering">Offering</option>
                <option value="Thanksgiving">Thanksgiving</option>
                <option value="Building Fund">Building Fund</option>
                <option value="Welfare">Welfare</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formAmount">
              <Form.Label className="ff-form-label">Amount ({currencySymbols[formData.currency]})</Form.Label>
              <Form.Control
                type="number"
                name="amount"
                placeholder={`e.g. 5000`}
                value={formData.amount}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formDate">
              <Form.Label className="ff-form-label">Date Selected</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
              />
            </Form.Group>

            <Row className="ff-btn-group g-2">
              <Col xs={12}>
                {isFormValid ? (
                  <PaymentButton
                    email={formData.email}
                    amount={formData.amount}
                    currency={formData.currency}
                    currencySymbol={currencySymbols[formData.currency]}
                    donorName={formData.name}
                    donationType={formData.type}
                    onSuccess={handlePaymentSuccess}
                    onClose={() => alert('Payment window closed.')}
                  />
                ) : (
                  <button type="button" className="btn btn-secondary w-100" disabled>
                    Please fill out all fields to activate payment
                  </button>
                )}
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default AddDonation;