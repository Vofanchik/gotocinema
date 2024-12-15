import React from 'react';
import ManageHalls from '../../components/Admin/ManageHalls';
import ConfigureHalls from '../../components/Admin/ConfigureHalls';
import ConfigurePrices from '../../components/Admin/ConfigurePrices';
import SessionGrid from '../../components/Admin/SessionGrid/SessionGrid';
import OpenSales from '../../components/Admin/OpenSales';
import { HallsProvider } from '../../contexts/HallsContext';
import './Admin.css';


const Admin: React.FC = () => {
  return (
    <HallsProvider>
      <main className="conf-steps">
        <ManageHalls />
        <ConfigureHalls />
        <ConfigurePrices />
        <SessionGrid />
        <OpenSales />
      </main>
    </HallsProvider>
  );
};

export default Admin;
