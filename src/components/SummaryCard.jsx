// SummaryCard.jsx
import React from 'react';
import { Card, Col } from 'react-bootstrap';
import './SummaryCard.css'; // Importing its own CSS file

function SummaryCard({ title, value, variant }) {
  // Select the appropriate text color class depending on the variant type passed
  const valueColorClass = variant === 'success' ? 'ff-card-value-success' : 'ff-card-value-primary';

  return (
    <Col md={6} xs={12} className="ff-card-wrapper">
      <Card className="ff-summary-card">
        <Card.Body>
          <Card.Subtitle className="ff-card-title">
            {title}
          </Card.Subtitle>
          <Card.Title className={`ff-card-value ${valueColorClass}`}>
            {value}
          </Card.Title>
        </Card.Body>
      </Card>
    </Col>
  );
}

export default SummaryCard;