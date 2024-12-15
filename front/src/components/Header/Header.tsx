import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="page-header">
      <div className="page-header__logo">
        <h1 className="page-header__title">
          <Link to="/">Идём<span>в</span>кино</Link>
        </h1>
      </div>
      <Link to="/admin/" className="page-header__button">Админ панель</Link>
    </header>
  );
};

export default Header;
