import React, { useState, useEffect } from 'react';
import api from '../api';

const DriverList = () => {
    const [drivers, setDrivers] = useState([]);
    const [newDriver, setNewDriver] = useState({
        name: '',
        licenseNumber: '',
        status: 'AVAILABLE'
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchDrivers();
    }, []);

    const fetchDrivers = async () => {
        try {
            const response = await api.get('/drivers');
            setDrivers(response.data);
        } catch (error) {
            console.error('Error fetching drivers:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewDriver({ ...newDriver, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/drivers/${editingId}`, newDriver);
            } else {
                await api.post('/drivers', newDriver);
            }
            fetchDrivers();
            setNewDriver({ name: '', licenseNumber: '', status: 'AVAILABLE' });
            setEditingId(null);
        } catch (error) {
            console.error('Error saving driver:', error);
        }
    };

    const handleEdit = (driver) => {
        setNewDriver(driver);
        setEditingId(driver.id);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir este motorista?')) {
            try {
                await api.delete(`/drivers/${id}`);
                fetchDrivers();
            } catch (error) {
                console.error('Erro ao excluir motorista:', error);
            }
        }
    };

    const handleCancelEdit = () => {
        setNewDriver({ name: '', licenseNumber: '', status: 'AVAILABLE' });
        setEditingId(null);
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Gerenciamento de Motoristas</h2>

            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h3 className="text-xl mb-4">{editingId ? 'Editar Motorista' : 'Adicionar Novo Motorista'}</h3>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Nome"
                        value={newDriver.name}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                    <input
                        type="text"
                        name="licenseNumber"
                        placeholder="CNH"
                        value={newDriver.licenseNumber}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                    <select
                        name="status"
                        value={newDriver.status}
                        onChange={handleInputChange}
                        className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                        <option value="AVAILABLE">Disponível</option>
                        <option value="ON_TRIP">Em Viagem</option>
                        <option value="OFF_DUTY">Folga</option>
                    </select>
                    <div className="md:col-span-2 flex gap-2" style={{ width: '25%' }}>
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex-1"
                        >
                            {editingId ? 'Atualizar Motorista' : 'Adicionar Motorista'}
                        </button>
                        {editingId && (
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Driver List */}
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8">
                <h3 className="text-xl mb-4">Lista de Motoristas</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Nome
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    CNH
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {drivers.map((driver) => (
                                <tr key={driver.id}>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        {driver.name}
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        {driver.licenseNumber}
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <span className={`relative inline-block px-3 py-1 font-semibold leading-tight text-white rounded-full ${driver.status === 'AVAILABLE' ? 'bg-green-500' :
                                            driver.status === 'ON_TRIP' ? 'bg-yellow-500' : 'bg-gray-500'
                                            }`}>
                                            {driver.status === 'AVAILABLE' ? 'Disponível' :
                                                driver.status === 'ON_TRIP' ? 'Em Viagem' : 'Folga'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <button
                                            onClick={() => handleEdit(driver)}
                                            className="text-blue-600 hover:text-blue-900 mr-4"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(driver.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Excluir
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DriverList;
