package com.efrota.service;

import com.efrota.model.Maintenance;
import com.efrota.repository.MaintenanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MaintenanceService {

    @Autowired
    private MaintenanceRepository maintenanceRepository;

    public List<Maintenance> getAllMaintenances() {
        return maintenanceRepository.findAll();
    }

    public Optional<Maintenance> getMaintenanceById(Long id) {
        if (id == null) {
            return Optional.empty();
        }
        return maintenanceRepository.findById(id);
    }

    public Maintenance saveMaintenance(Maintenance maintenance) {
        if (maintenance == null) {
            return null;
        }
        return maintenanceRepository.save(maintenance);
    }

    public void deleteMaintenance(Long id) {
        if (id == null) {
            return;
        }
        maintenanceRepository.deleteById(id);
    }
}
