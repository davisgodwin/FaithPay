// src/components/SplashScreen.jsx
import React from 'react';
import './SplashScreen.css';

function SplashScreen() {
  return (
    <div className="ff-splash-container">
      <div className="ff-splash-content">
        <h1 className="ff-splash-logo">LIWA</h1>
        <div className="ff-splash-loader"></div>
      </div>
    </div>
  );
}

export default SplashScreen;