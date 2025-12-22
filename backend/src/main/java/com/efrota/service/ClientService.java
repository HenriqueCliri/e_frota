package com.efrota.service;

import com.efrota.model.Client;
import com.efrota.repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClientService {

    @Autowired
    private ClientRepository clientRepository;

    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }

    public Optional<Client> getClientById(Long id) {
        if (id == null) {
            return Optional.empty();
        }
        return clientRepository.findById(id);
    }

    public Client saveClient(Client client) {
        if (client == null) {
            return null;
        }
        return clientRepository.save(client);
    }

    public void deleteClient(Long id) {
        if (id == null) {
            return;
        }
        clientRepository.deleteById(id);
    }
}
