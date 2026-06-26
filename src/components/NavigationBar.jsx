// NavigationBar.jsx
import React from 'react';
import { Navbar, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './NavigationBar.css';

function NavigationBar() {
  return (
    <Navbar className="ff-navbar" expand="lg">
      <Container>
        {/* Clicking the brand logo will safely bring members right back to the payment form */}
        <Navbar.Brand as={Link} to="/" className="ff-brand">
          LivingSpring Word-Alive Assembly
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;