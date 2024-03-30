import React from 'react';
import './NavBarComponent.css'

function NavBarComponent() {
  return (
    <div>
      <nav className="navbar">
      <div className="navbar-left">
        <img
          src="/logo.png"
          alt="Invoice Logo"
          className="logo"
        />
        <span className="company-name">EXTRACT</span>
      </div>
      <div className="navbar-right">
        <button className="sign-in-button">Sign In</button>
      </div>
    </nav>
    </div>
  );
}

export default NavBarComponent;
