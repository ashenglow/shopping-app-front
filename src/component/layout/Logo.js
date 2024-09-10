import React from 'react';

const Logo = () => {
  return (
    <div style={{ textAlign: 'center', margin: '0' }}>
      <h1 style={{ 
        fontFamily: 'Montserrat, sans-serif', 
        letterSpacing: '-0.02em', 
        fontSize: '48px', 
        color: '#333333', 
        margin: '0' 
      }}>
        Soolé
      </h1>
      <p style={{ 
        fontFamily: 'Open Sans, sans-serif', 
        fontWeight: '200',
        fontSize: '16px', 
        color: '#8b6d43', 
        letterSpacing: '0.05em',
        margin: '0' 
      }}>
        Brewing Korea’s Finest
      </p>
    </div>
  );
};

export default Logo;
