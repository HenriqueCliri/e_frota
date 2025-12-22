package com.efrota.service;

import com.efrota.model.Trip;
import com.efrota.repository.TripRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TripService {

    @Autowired
    private TripRepository tripRepository;

    public List<Trip> findAll() {
        return tripRepository.findAll();
    }

    public Optional<Trip> findById(Long id) {
        if (id == null) {
            return Optional.empty();
        }
        return tripRepository.findById(id);
    }

    public Trip save(Trip trip) {
        if (trip == null) {
            return null;
        }
        return tripRepository.save(trip);
    }

    public void deleteById(Long id) {
        if (id == null) {
            return;
        }
        tripRepository.deleteById(id);
    }
}
