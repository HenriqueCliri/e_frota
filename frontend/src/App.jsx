import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import TruckList from './components/TruckList';
import DriverList from './components/DriverList';
import MaintenanceList from './components/MaintenanceList';
import TripList from './components/TripList';
import ClientList from './components/ClientList';
import Login from './components/Login';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-blue-600 text-white p-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">E-frota</h1>
            <ul className="flex space-x-4">
              <li><Link to="/" className="hover:text-blue-200">Caminhões</Link></li>
              <li><Link to="/drivers" className="hover:text-blue-200">Motoristas</Link></li>
              <li><Link to="/trips" className="hover:text-blue-200">Viagens</Link></li>
              <li><Link to="/maintenances" className="hover:text-blue-200">Manutenções</Link></li>
              <li><Link to="/clients" className="hover:text-blue-200">Clientes</Link></li>
              <li><button onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }} className="hover:text-blue-200">Sair</button></li>
            </ul>
          </div>
        </nav>

        <div className="container mx-auto p-4">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<PrivateRoute><TruckList /></PrivateRoute>} />
            <Route path="/drivers" element={<PrivateRoute><DriverList /></PrivateRoute>} />
            <Route path="/trips" element={<PrivateRoute><TripList /></PrivateRoute>} />
            <Route path="/maintenances" element={<PrivateRoute><MaintenanceList /></PrivateRoute>} />
            <Route path="/clients" element={<PrivateRoute><ClientList /></PrivateRoute>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
