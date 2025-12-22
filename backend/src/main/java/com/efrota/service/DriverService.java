package com.efrota.service;

import com.efrota.model.Driver;
import com.efrota.repository.DriverRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DriverService {

    @Autowired
    private DriverRepository driverRepository;

    public List<Driver> findAll() {
        return driverRepository.findAll();
    }

    public Optional<Driver> findById(Long id) {
        if (id == null) {
            return Optional.empty();
        }
        return driverRepository.findById(id);
    }

    public Driver save(Driver driver) {
        if (driver == null) {
            return null;
        }
        return driverRepository.save(driver);
    }

    public void deleteById(Long id) {
        if (id == null) {
            return;
        }
        driverRepository.deleteById(id);
    }
}
