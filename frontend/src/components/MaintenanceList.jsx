import React, { useState, useEffect } from 'react';
import api from '../api';

const MaintenanceList = () => {
    const [maintenances, setMaintenances] = useState([]);
    const [trucks, setTrucks] = useState([]);
    const [newMaintenance, setNewMaintenance] = useState({
        truck: null,
        description: '',
        date: '',
        cost: ''
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchMaintenances();
        fetchTrucks();
    }, []);

    const fetchMaintenances = async () => {
        try {
            const response = await api.get('/maintenances');
            setMaintenances(response.data);
        } catch (error) {
            console.error('Error fetching maintenances:', error);
        }
    };

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
        setNewMaintenance({ ...newMaintenance, [name]: value });
    };

    const handleSelectChange = (e) => {
        const { name, value } = e.target;
        setNewMaintenance({ ...newMaintenance, [name]: { id: value } });
    };

    const validateForm = () => {
        if (!newMaintenance.truck || !newMaintenance.truck.id) {
            alert('Selecione um caminhão.');
            return false;
        }
        if (!newMaintenance.description) {
            alert('Informe a descrição.');
            return false;
        }
        if (!newMaintenance.date) {
            alert('Informe a data.');
            return false;
        }
        const selectedDate = new Date(newMaintenance.date);
        const today = new Date();
        if (selectedDate > today) {
            alert('A data não pode ser futura.');
            return false;
        }
        if (!newMaintenance.cost || parseFloat(newMaintenance.cost) <= 0) {
            alert('O custo deve ser maior que zero.');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            if (editingId) {
                await api.put(`/maintenances/${editingId}`, newMaintenance);
            } else {
                await api.post('/maintenances', newMaintenance);
            }
            fetchMaintenances();
            resetForm();
        } catch (error) {
            console.error('Error saving maintenance:', error);
            alert('Erro ao salvar manutenção.');
        }
    };

    const resetForm = () => {
        setNewMaintenance({
            truck: null,
            description: '',
            date: '',
            cost: ''
        });
        setEditingId(null);
    };

    const handleEdit = (maintenance) => {
        setNewMaintenance({
            ...maintenance,
            truck: maintenance.truck ? { id: maintenance.truck.id } : null
        });
        setEditingId(maintenance.id);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir esta manutenção?')) {
            try {
                await api.delete(`/maintenances/${id}`);
                fetchMaintenances();
            } catch (error) {
                console.error('Erro ao excluir manutenção:', error);
            }
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Gerenciamento de Manutenção</h2>

            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h3 className="text-xl mb-4">{editingId ? 'Editar Manutenção' : 'Registrar Nova Manutenção'}</h3>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select
                        name="truck"
                        value={newMaintenance.truck?.id || ''}
                        onChange={handleSelectChange}
                        className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    >
                        <option value="">Selecione um Caminhão</option>
                        {trucks.map(truck => (
                            <option key={truck.id} value={truck.id}>{truck.licensePlate} - {truck.model}</option>
                        ))}
                    </select>
                    <input
                        type="text"
                        name="description"
                        placeholder="Descrição"
                        value={newMaintenance.description}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                    <input
                        type="date"
                        name="date"
                        placeholder="Data"
                        value={newMaintenance.date}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                    <input
                        type="number"
                        name="cost"
                        placeholder="Custo (R$)"
                        value={newMaintenance.cost}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                        step="0.01"
                    />
                    <div className="md:col-span-2 flex gap-2" style={{ width: '25%' }}>
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex-1"
                        >
                            {editingId ? 'Atualizar Manutenção' : 'Registrar Manutenção'}
                        </button>
                        {editingId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8">
                <h3 className="text-xl mb-4">Histórico de Manutenções</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Caminhão
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Descrição
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Data
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Custo
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {maintenances.map((maintenance) => (
                                <tr key={maintenance.id}>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        {maintenance.truck ? maintenance.truck.licensePlate : 'N/A'}
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        {maintenance.description}
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        {maintenance.date}
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        R$ {maintenance.cost.toFixed(2)}
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <button
                                            onClick={() => handleEdit(maintenance)}
                                            className="text-blue-600 hover:text-blue-900 mr-4"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(maintenance.id)}
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

export default MaintenanceList;
