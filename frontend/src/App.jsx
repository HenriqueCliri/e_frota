import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import TruckList from './components/TruckList';
import DriverList from './components/DriverList';
import MaintenanceList from './components/MaintenanceList';
import TripList from './components/TripList';
import ClientList from './components/ClientList';
import Login from './components/Login';

import Sidebar from './components/Sidebar';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={
          <div className="flex h-screen bg-gray-100 overflow-hidden relative">

            {/* Overlay */}
            {isSidebarOpen && (
              <div
                className="fixed inset-0 bg-black opacity-50 z-40"
                onClick={() => setIsSidebarOpen(false)}
              ></div>
            )}

            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="flex-1 overflow-y-auto p-4">
              {/* Hamburger Button */}
              {!isSidebarOpen && (
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="mb-4 p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              )}

              <Routes>
                <Route path="/" element={<PrivateRoute><TruckList /></PrivateRoute>} />
                <Route path="/drivers" element={<PrivateRoute><DriverList /></PrivateRoute>} />
                <Route path="/trips" element={<PrivateRoute><TripList /></PrivateRoute>} />
                <Route path="/maintenances" element={<PrivateRoute><MaintenanceList /></PrivateRoute>} />
                <Route path="/clients" element={<PrivateRoute><ClientList /></PrivateRoute>} />
              </Routes>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
