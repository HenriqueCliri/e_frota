package com.efrota.controller;

import com.efrota.model.Truck;
import com.efrota.service.TruckService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trucks")
@CrossOrigin(origins = "http://localhost:5173")
public class TruckController {

    @Autowired
    private TruckService truckService;

    @GetMapping
    public List<Truck> getAllTrucks() {
        return truckService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Truck> getTruckById(@PathVariable Long id) {
        return truckService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Truck createTruck(@RequestBody Truck truck) {
        return truckService.save(truck);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Truck> updateTruck(@PathVariable Long id, @RequestBody Truck truck) {
        return truckService.findById(id)
                .map(existingTruck -> {
                    truck.setId(id);
                    return ResponseEntity.ok(truckService.save(truck));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTruck(@PathVariable Long id) {
        if (truckService.findById(id).isPresent()) {
            truckService.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
