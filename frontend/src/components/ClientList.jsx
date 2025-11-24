import React, { useState, useEffect } from 'react';
import api from '../api';

const ClientList = () => {
    const [clients, setClients] = useState([]);
    const [newClient, setNewClient] = useState({
        name: '',
        contactPerson: '',
        phone: '',
        email: '',
        address: ''
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const response = await api.get('/clients');
            setClients(response.data);
        } catch (error) {
            console.error('Error fetching clients:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewClient({ ...newClient, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/clients/${editingId}`, newClient);
            } else {
                await api.post('/clients', newClient);
            }
            fetchClients();
            resetForm();
        } catch (error) {
            console.error('Error saving client:', error);
            alert('Erro ao salvar cliente.');
        }
    };

    const resetForm = () => {
        setNewClient({
            name: '',
            contactPerson: '',
            phone: '',
            email: '',
            address: ''
        });
        setEditingId(null);
    };

    const handleEdit = (client) => {
        setNewClient(client);
        setEditingId(client.id);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
            try {
                await api.delete(`/clients/${id}`);
                fetchClients();
            } catch (error) {
                console.error('Erro ao excluir cliente:', error);
            }
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Gerenciamento de Clientes</h2>

            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h3 className="text-xl mb-4">{editingId ? 'Editar Cliente' : 'Adicionar Novo Cliente'}</h3>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Nome da Empresa"
                        value={newClient.name}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                    <input
                        type="text"
                        name="contactPerson"
                        placeholder="Pessoa de Contato"
                        value={newClient.contactPerson}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                    <input
                        type="text"
                        name="phone"
                        placeholder="Telefone"
                        value={newClient.phone}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={newClient.email}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                    <input
                        type="text"
                        name="address"
                        placeholder="Endereço"
                        value={newClient.address}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline md:col-span-2"
                        required
                    />
                    <div className="md:col-span-2 flex gap-2" style={{ width: '25%' }}>
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex-1"
                        >
                            {editingId ? 'Atualizar Cliente' : 'Adicionar Cliente'}
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
            </div >

            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8">
                <h3 className="text-xl mb-4">Lista de Clientes</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Nome
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Contato
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Telefone
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Endereço
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {clients.map((client) => (
                                <tr key={client.id}>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        {client.name}
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        {client.contactPerson}
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        {client.phone}
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        {client.email}
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        {client.address}
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <button
                                            onClick={() => handleEdit(client)}
                                            className="text-blue-600 hover:text-blue-900 mr-4"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(client.id)}
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
        </div >
    );
};

export default ClientList;
