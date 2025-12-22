import React, { useState, useEffect } from 'react';
import api from '../api';

const TripList = () => {
    const [trips, setTrips] = useState([]);
    const [trucks, setTrucks] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [newTrip, setNewTrip] = useState({
        truck: null,
        driver: null,
        origin: '',
        destination: '',
        distance: '',
        cargoType: '',
        cargoValue: '',
        cargoDeadline: '',
        driverCommissionRate: '',
        valueToDriver: '',
        fuelExpense: '',
        tollExpense: '',
        foodExpense: '',
        unexpectedExpense: '',

        status: 'PLANNED'
    });
    const [editingId, setEditingId] = useState(null);

    const [file, setFile] = useState(null);

    useEffect(() => {
        fetchTrips();
        fetchTrucks();
        fetchDrivers();
    }, []);

    const fetchTrips = async () => {
        try {
            const response = await api.get('/trips');
            setTrips(response.data);
        } catch (error) {
            console.error('Error fetching trips:', error);
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
        let updatedTrip = { ...newTrip, [name]: value };

        // Auto-calculate Value to Driver
        if (name === 'cargoValue' || name === 'driverCommissionRate') {
            const cargoValue = parseFloat(name === 'cargoValue' ? value : newTrip.cargoValue) || 0;
            const commissionRate = parseFloat(name === 'driverCommissionRate' ? value : newTrip.driverCommissionRate) || 0;
            if (cargoValue > 0 && commissionRate > 0) {
                updatedTrip.valueToDriver = (cargoValue * (commissionRate / 100)).toFixed(2);
            }
        }

        setNewTrip(updatedTrip);
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSelectChange = (e) => {
        const { name, value } = e.target;
        setNewTrip({ ...newTrip, [name]: { id: value } });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('trip', JSON.stringify(newTrip));
            if (file) {
                formData.append('file', file);
            }

            if (editingId) {
                await api.put(`/trips/${editingId}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post('/trips', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            fetchTrips();
            resetForm();
        } catch (error) {
            console.error('Error saving trip:', error);
            alert('Erro ao salvar viagem.');
        }
    };

    const resetForm = () => {
        setNewTrip({
            truck: null,
            driver: null,
            origin: '',
            destination: '',
            distance: '',
            cargoType: '',
            cargoValue: '',
            cargoDeadline: '',
            driverCommissionRate: '',
            valueToDriver: '',
            fuelExpense: '',
            tollExpense: '',
            foodExpense: '',
            unexpectedExpense: '',
            status: 'PLANNED'
        });
        setFile(null);
        setEditingId(null);
    };

    const handleEdit = (trip) => {
        setNewTrip({
            ...trip,
            truck: trip.truck ? { id: trip.truck.id } : null,
            driver: trip.driver ? { id: trip.driver.id } : null,
            origin: trip.origin || '',
            cargoValue: trip.cargoValue || '',
            cargoDeadline: trip.cargoDeadline || '',
            driverCommissionRate: trip.driverCommissionRate || '',
            fuelExpense: trip.fuelExpense || '',
            tollExpense: trip.tollExpense || '',
            foodExpense: trip.foodExpense || '',
            unexpectedExpense: trip.unexpectedExpense || ''
        });
        setFile(null); // Reset file input on edit
        setEditingId(trip.id);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir esta viagem?')) {
            try {
                await api.delete(`/trips/${id}`);
                fetchTrips();
            } catch (error) {
                console.error('Erro ao excluir viagem:', error);
            }
        }
    };

    const handleCancelEdit = () => {
        resetForm();
    };

    const handleDownload = async (tripId, fileName) => {
        try {
            const response = await api.get(`/trips/${tripId}/attachment`, {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error downloading file:', error);
            alert('Erro ao baixar arquivo.');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Gerenciamento de Viagens</h2>

            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h3 className="text-xl mb-4">{editingId ? 'Editar Viagem' : 'Planejar Nova Viagem'}</h3>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Basic Info */}
                    <div className="md:col-span-2 lg:col-span-3 font-bold text-gray-700 border-b pb-2 mb-2">Informações Básicas</div>

                    <select
                        name="truck"
                        value={newTrip.truck?.id || ''}
                        onChange={handleSelectChange}
                        className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    >
                        <option value="">Selecione um Caminhão</option>
                        {trucks.filter(t => t.status === 'AVAILABLE' || (editingId && newTrip.truck?.id === t.id)).map(truck => (
                            <option key={truck.id} value={truck.id}>{truck.licensePlate} - {truck.model}</option>
                        ))}
                    </select>
                    <select
                        name="driver"
                        value={newTrip.driver?.id || ''}
                        onChange={handleSelectChange}
                        className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    >
                        <option value="">Selecione um Motorista</option>
                        {drivers.filter(d => d.status === 'AVAILABLE' || (editingId && newTrip.driver?.id === d.id)).map(driver => (
                            <option key={driver.id} value={driver.id}>{driver.name}</option>
                        ))}
                    </select>
                    <input
                        type="text"
                        name="origin"
                        placeholder="Origem"
                        value={newTrip.origin}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                    <input
                        type="text"
                        name="destination"
                        placeholder="Destino"
                        value={newTrip.destination}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                    <input
                        type="number"
                        name="distance"
                        placeholder="Distância (km)"
                        value={newTrip.distance}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />

                    {/* Cargo Info */}
                    <div className="md:col-span-2 lg:col-span-3 font-bold text-gray-700 border-b pb-2 mb-2 mt-4">Carga e Valores</div>

                    <input
                        type="text"
                        name="cargoType"
                        placeholder="Tipo de Carga"
                        value={newTrip.cargoType}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                    <input
                        type="number"
                        name="cargoValue"
                        placeholder="Valor da Carga (R$)"
                        value={newTrip.cargoValue}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        step="0.01"
                    />
                    <input
                        type="date"
                        name="cargoDeadline"
                        placeholder="Prazo da Carga"
                        value={newTrip.cargoDeadline}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    <input
                        type="number"
                        name="driverCommissionRate"
                        placeholder="Comissão Motorista (%)"
                        value={newTrip.driverCommissionRate}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        step="0.1"
                    />
                    <input
                        type="number"
                        name="valueToDriver"
                        placeholder="Valor para Motorista (R$)"
                        value={newTrip.valueToDriver}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
                        readOnly
                    />

                    {/* Expenses */}
                    <div className="md:col-span-2 lg:col-span-3 font-bold text-gray-700 border-b pb-2 mb-2 mt-4">Despesas da Viagem</div>

                    <input
                        type="number"
                        name="fuelExpense"
                        placeholder="Combustível (R$)"
                        value={newTrip.fuelExpense}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        step="0.01"
                    />
                    <input
                        type="number"
                        name="tollExpense"
                        placeholder="Pedágio (R$)"
                        value={newTrip.tollExpense}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        step="0.01"
                    />
                    <input
                        type="number"
                        name="foodExpense"
                        placeholder="Alimentação (R$)"
                        value={newTrip.foodExpense}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        step="0.01"
                    />
                    <input
                        type="number"
                        name="unexpectedExpense"
                        placeholder="Imprevistos (R$)"
                        value={newTrip.unexpectedExpense}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        step="0.01"
                    />

                    {/* Documents */}
                    <div className="md:col-span-2 lg:col-span-3 font-bold text-gray-700 border-b pb-2 mb-2 mt-4">Documentação</div>

                    <div className="md:col-span-2 lg:col-span-3">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Anexar Documento (PDF, Imagem)
                        </label>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    {editingId && (
                        <select
                            name="status"
                            value={newTrip.status}
                            onChange={handleInputChange}
                            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option value="PLANNED">Planejada</option>
                            <option value="IN_PROGRESS">Em Andamento</option>
                            <option value="COMPLETED">Concluída</option>
                        </select>
                    )}

                    <div className="md:col-span-2 lg:col-span-3 flex gap-2 mt-4" style={{ width: '25%' }}>
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex-1"
                        >
                            {editingId ? 'Atualizar Viagem' : 'Planejar Viagem'}
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

            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8">
                <h3 className="text-xl mb-4">Lista de Viagens</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Origem/Destino
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Caminhão/Motorista
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Carga
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
                            {trips.map((trip) => (
                                <tr key={trip.id}>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <div>{trip.origin}</div>
                                        <div className="text-gray-500 text-xs">para</div>
                                        <div>{trip.destination}</div>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <div>{trip.truck ? trip.truck.licensePlate : 'N/A'}</div>
                                        <div className="text-gray-500 text-xs">{trip.driver ? trip.driver.name : 'N/A'}</div>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <div>{trip.cargoType}</div>
                                        <div className="text-gray-500 text-xs">R$ {trip.cargoValue ? trip.cargoValue.toFixed(2) : '0.00'}</div>
                                        {trip.attachmentName && (
                                            <button
                                                onClick={() => handleDownload(trip.id, trip.attachmentName)}
                                                className="text-blue-500 hover:text-blue-700 text-xs block mt-1 underline"
                                            >
                                                📎 {trip.attachmentName}
                                            </button>
                                        )}
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <span className={`relative inline-block px-3 py-1 font-semibold leading-tight text-white rounded-full ${trip.status === 'PLANNED' ? 'bg-blue-500' :
                                            trip.status === 'IN_PROGRESS' ? 'bg-yellow-500' : 'bg-green-500'
                                            }`}>
                                            {trip.status === 'PLANNED' ? 'Planejada' :
                                                trip.status === 'IN_PROGRESS' ? 'Em Andamento' : 'Concluída'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <button
                                            onClick={() => handleEdit(trip)}
                                            className="text-blue-600 hover:text-blue-900 mr-4"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(trip.id)}
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

export default TripList;
