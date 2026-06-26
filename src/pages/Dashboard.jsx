// Dashboard.jsx
import React, { useState } from 'react';
import { Container, Row, Col, Card, Form } from 'react-bootstrap';
import DonationTable from '../components/DonationTable';

function Dashboard({ donations, onDelete }) {
  // Initialize start and end date states (YYYY-MM-DD strings)
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // 1. Filter donations by selected date range inputs
  const filteredDonations = donations.filter((item) => {
    if (!item.date) return false;
    
    // Compare dates as standard chronological string segments
    if (startDate && item.date < startDate) return false;
    if (endDate && item.date > endDate) return false;
    
    return true;
  });

  // 2. Compute live totals dynamically from the filtered dataset
  const totalCollectedInNaira = filteredDonations.reduce((sum, item) => {
    let itemValueInNaira = parseFloat(item.amount) || 0;
    
    // Standard exchange rates conversion fallback logic
    if (item.currency === 'USD') itemValueInNaira *= 1500;
    if (item.currency === 'GBP') itemValueInNaira *= 1900;
    
    return sum + itemValueInNaira;
  }, 0);

  return (
    <Container className="py-5" style={{ backgroundColor: '#fafafa', minHeight: '100vh' }}>
      <div className="mb-4">
        <h2 style={{ fontWeight: 600, color: '#111827', letterSpacing: '-0.02em' }}>Church Dashboard</h2>
        <p className="text-muted small">Tracking and auditing all centralized church contributions.</p>
      </div>

      {/* Metric Summary Cards */}
      <Row className="g-4 mb-4">
        <Col md={6}>
          <Card className="p-4" style={{ border: '1px solid #e5e7eb', borderRadius: '12px' }}>
            <span className="text-uppercase tracking-wider text-muted small font-weight-bold mb-1">Total Audited (NGN Equivalent)</span>
            <h3 style={{ fontWeight: 600, color: '#111827' }}>
              ₦{totalCollectedInNaira.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
            </h3>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="p-4" style={{ border: '1px solid #e5e7eb', borderRadius: '12px' }}>
            <span className="text-uppercase tracking-wider text-muted small font-weight-bold mb-1">Ledger Scope Entries</span>
            <h3 style={{ fontWeight: 600, color: '#111827' }}>
              {filteredDonations.length} {filteredDonations.length === 1 ? 'Record' : 'Records'}
            </h3>
          </Card>
        </Col>
      </Row>

      {/* Minimalist Date Range Filter Panel */}
      <Card className="p-4 mb-4" style={{ border: '1px solid #e5e7eb', borderRadius: '12px' }}>
        <h6 className="mb-3" style={{ fontWeight: 500, color: '#374151', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Filter Audit Period
        </h6>
        <Form>
          <Row className="g-3">
            <Col sm={6} md={4}>
              <Form.Group controlId="filterStartDate">
                <Form.Label className="text-muted small">Start Date</Form.Label>
                <Form.Control 
                  type="date" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)} 
                  style={{ borderRadius: '8px', fontSize: '0.9rem' }}
                />
              </Form.Group>
            </Col>
            <Col sm={6} md={4}>
              <Form.Group controlId="filterEndDate">
                <Form.Label className="text-muted small">End Date</Form.Label>
                <Form.Control 
                  type="date" 
                  value={endDate} 
                  onChange={(e) => setEndDate(e.target.value)} 
                  style={{ borderRadius: '8px', fontSize: '0.9rem' }}
                />
              </Form.Group>
            </Col>
            <Col sm={12} md={4} className="d-flex align-items-end">
              {(startDate || endDate) && (
                <button
                  type="button"
                  className="btn btn-link text-muted p-0 pb-2 text-decoration-none small"
                  onClick={() => { setStartDate(''); setEndDate(''); }}
                >
                  ✕ Clear Date Filter
                </button>
              )}
            </Col>
          </Row>
        </Form>
      </Card>

      {/* Main Filtered Data Ledger Grid Table */}
      <DonationTable donations={filteredDonations} onDelete={onDelete} />
    </Container>
  );
}

export default Dashboard;