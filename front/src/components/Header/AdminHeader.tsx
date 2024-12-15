import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../Button/Button';
import './Header.css';


const AdminHeader: React.FC = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="page-header">
      <div className="page-header__logo">
        <h1 className="page-header__title">
          <Link to="/admin/">Идём<span>в</span>кино</Link>
        </h1>
        <span className="page-header__subtitle">Администраторская</span>
      </div>
      <div className="page-header__buttons">
        <Link to="/" className="page-header__button">Гостевая</Link>
        <Button type="accent" onClick={handleLogout}>Выйти</Button>
      </div>
    </header>
  );
};

export default AdminHeader;
