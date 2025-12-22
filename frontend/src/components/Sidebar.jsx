import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose }) => {
    const token = localStorage.getItem('token');

    return (
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 text-white transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} shadow-lg flex flex-col`}>
            <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-blue-400">E-frota</h1>
                <button onClick={onClose} className="text-gray-400 hover:text-white focus:outline-none">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <nav className="flex-1 p-4">
                <ul className="space-y-2">
                    <li>
                        <Link to="/" onClick={onClose} className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white">
                            Caminhões
                        </Link>
                    </li>
                    <li>
                        <Link to="/drivers" onClick={onClose} className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white">
                            Motoristas
                        </Link>
                    </li>
                    <li>
                        <Link to="/trips" onClick={onClose} className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white">
                            Viagens
                        </Link>
                    </li>
                    <li>
                        <Link to="/maintenances" onClick={onClose} className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white">
                            Manutenções
                        </Link>
                    </li>
                    <li>
                        <Link to="/clients" onClick={onClose} className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white">
                            Clientes
                        </Link>
                    </li>
                </ul>
            </nav>
            {token && (
                <div className="p-4 border-t border-gray-700">
                    <button
                        onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }}
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition duration-200"
                    >
                        Sair
                    </button>
                </div>
            )}
        </div>
    );
};

export default Sidebar;
