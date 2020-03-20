import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => (
  <div>
    <nav>
      <NavLink to="/">Home</NavLink>
      <NavLink to="/getrtv">Get Right to Vote</NavLink>
      <NavLink to="/verify">Verify Vote</NavLink>
    </nav>
  </div>
);

export default Header;