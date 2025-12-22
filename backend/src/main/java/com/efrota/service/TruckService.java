package com.efrota.service;

import com.efrota.model.Truck;
import com.efrota.repository.TruckRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TruckService {

    @Autowired
    private TruckRepository truckRepository;

    public List<Truck> findAll() {
        return truckRepository.findAll();
    }

    public Optional<Truck> findById(Long id) {
        if (id == null) {
            return Optional.empty();
        }
        return truckRepository.findById(id);
    }

    public Truck save(Truck truck) {
        if (truck == null) {
            return null;
        }
        return truckRepository.save(truck);
    }

    public void deleteById(Long id) {
        if (id == null) {
            return;
        }
        truckRepository.deleteById(id);
    }
}
