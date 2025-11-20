package com.efrota.controller;

import com.efrota.model.Trip;
import com.efrota.service.TripService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips")
@CrossOrigin(origins = "http://localhost:5173")
public class TripController {

    @Autowired
    private TripService tripService;

    @GetMapping
    public List<Trip> getAllTrips() {
        return tripService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Trip> getTripById(@PathVariable Long id) {
        return tripService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Trip createTrip(@RequestBody Trip trip) {
        calculateValueToDriver(trip);
        return tripService.save(trip);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Trip> updateTrip(@PathVariable Long id, @RequestBody Trip trip) {
        return tripService.findById(id)
                .map(existingTrip -> {
                    trip.setId(id);
                    calculateValueToDriver(trip);
                    return ResponseEntity.ok(tripService.save(trip));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    private void calculateValueToDriver(Trip trip) {
        if (trip.getCargoValue() != null && trip.getDriverCommissionRate() != null) {
            java.math.BigDecimal commission = trip.getCargoValue()
                    .multiply(java.math.BigDecimal.valueOf(trip.getDriverCommissionRate()))
                    .divide(java.math.BigDecimal.valueOf(100));
            trip.setValueToDriver(commission);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrip(@PathVariable Long id) {
        if (tripService.findById(id).isPresent()) {
            tripService.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
