import React, { useState, useEffect } from 'react';
import api from '../api';

const TruckList = () => {
    const [trucks, setTrucks] = useState([]);
    const [newTruck, setNewTruck] = useState({
        licensePlate: '',
        model: '',
        capacity: '',
        status: 'AVAILABLE'
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchTrucks();
    }, []);

    const fetchTrucks = async () => {
        try {
            const response = await api.get('/trucks');
            setTrucks(response.data);
        } catch (error) {
            console.error('Error fetching trucks:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTruck({ ...newTruck, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/trucks/${editingId}`, newTruck);
            } else {
                await api.post('/trucks', newTruck);
            }
            fetchTrucks();
            setNewTruck({ licensePlate: '', model: '', capacity: '', status: 'AVAILABLE' });
            setEditingId(null);
        } catch (error) {
            console.error('Error saving truck:', error);
        }
    };

    const handleEdit = (truck) => {
        setNewTruck(truck);
        setEditingId(truck.id);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir este caminhão?')) {
            try {
                await api.delete(`/trucks/${id}`);
                fetchTrucks();
            } catch (error) {
                console.error('Erro ao excluir caminhão:', error);
            }
        }
    };

    const handleCancelEdit = () => {
        setNewTruck({ licensePlate: '', model: '', capacity: '', status: 'AVAILABLE' });
        setEditingId(null);
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Gerenciamento de Caminhões</h2>

            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h3 className="text-xl mb-4">{editingId ? 'Editar Caminhão' : 'Adicionar Novo Caminhão'}</h3>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        name="licensePlate"
                        placeholder="Placa"
                        value={newTruck.licensePlate}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                    <input
                        type="text"
                        name="model"
                        placeholder="Modelo"
                        value={newTruck.model}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                    <input
                        type="number"
                        name="capacity"
                        placeholder="Capacidade (toneladas)"
                        value={newTruck.capacity}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                    <select
                        name="status"
                        value={newTruck.status}
                        onChange={handleInputChange}
                        className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                        <option value="AVAILABLE">Disponível</option>
                        <option value="ON_TRIP">Em Viagem</option>
                        <option value="MAINTENANCE">Manutenção</option>
                    </select>
                    <div className="md:col-span-2 flex gap-2" style={{ width: '25%' }}>
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex-1"
                        >
                            {editingId ? 'Atualizar Caminhão' : 'Adicionar Caminhão'}
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

            {/* Truck List */}
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8">
                <h3 className="text-xl mb-4">Frota</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Placa
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Modelo
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Capacidade
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
                            {trucks.map((truck) => (
                                <tr key={truck.id}>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        {truck.licensePlate}
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        {truck.model}
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        {truck.capacity}
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <span className={`relative inline-block px-3 py-1 font-semibold leading-tight text-white rounded-full ${truck.status === 'AVAILABLE' ? 'bg-green-500' :
                                            truck.status === 'ON_TRIP' ? 'bg-yellow-500' : 'bg-red-500'
                                            }`}>
                                            {truck.status === 'AVAILABLE' ? 'Disponível' :
                                                truck.status === 'ON_TRIP' ? 'Em Viagem' : 'Manutenção'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <button
                                            onClick={() => handleEdit(truck)}
                                            className="text-blue-600 hover:text-blue-900 mr-4"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(truck.id)}
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

export default TruckList;
