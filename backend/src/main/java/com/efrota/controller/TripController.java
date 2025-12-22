package com.efrota.controller;

import com.efrota.model.Trip;
import com.efrota.service.TripService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;

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

    @PostMapping(consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<Trip> createTrip(
            @RequestPart("trip") String tripJson,
            @RequestPart(value = "file", required = false) MultipartFile file) throws IOException {

        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new com.fasterxml.jackson.datatype.jsr310.JavaTimeModule());
        Trip trip = mapper.readValue(tripJson, Trip.class);

        if (file != null && !file.isEmpty()) {
            trip.setAttachment(file.getBytes());
            trip.setAttachmentName(file.getOriginalFilename());
            trip.setAttachmentType(file.getContentType());
        }

        calculateValueToDriver(trip);
        return ResponseEntity.ok(tripService.save(trip));
    }

    @PutMapping(value = "/{id}", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<Trip> updateTrip(
            @PathVariable Long id,
            @RequestPart("trip") String tripJson,
            @RequestPart(value = "file", required = false) MultipartFile file) throws IOException {

        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new com.fasterxml.jackson.datatype.jsr310.JavaTimeModule());
        Trip tripUpdates = mapper.readValue(tripJson, Trip.class);

        return tripService.findById(id)
                .map(existingTrip -> {
                    existingTrip.setOrigin(tripUpdates.getOrigin());
                    existingTrip.setDestination(tripUpdates.getDestination());
                    existingTrip.setDistance(tripUpdates.getDistance());
                    existingTrip.setTruck(tripUpdates.getTruck());
                    existingTrip.setDriver(tripUpdates.getDriver());
                    existingTrip.setCargoType(tripUpdates.getCargoType());
                    existingTrip.setCargoValue(tripUpdates.getCargoValue());
                    existingTrip.setCargoDeadline(tripUpdates.getCargoDeadline());
                    existingTrip.setDriverCommissionRate(tripUpdates.getDriverCommissionRate());
                    existingTrip.setFuelExpense(tripUpdates.getFuelExpense());
                    existingTrip.setTollExpense(tripUpdates.getTollExpense());
                    existingTrip.setFoodExpense(tripUpdates.getFoodExpense());
                    existingTrip.setUnexpectedExpense(tripUpdates.getUnexpectedExpense());
                    existingTrip.setStatus(tripUpdates.getStatus());

                    if (file != null && !file.isEmpty()) {
                        try {
                            existingTrip.setAttachment(file.getBytes());
                            existingTrip.setAttachmentName(file.getOriginalFilename());
                            existingTrip.setAttachmentType(file.getContentType());
                        } catch (IOException e) {
                            throw new RuntimeException("Error processing file", e);
                        }
                    }

                    calculateValueToDriver(existingTrip);
                    return ResponseEntity.ok(tripService.save(existingTrip));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/attachment")
    public ResponseEntity<?> getAttachment(@PathVariable Long id) {
        return tripService.findById(id)
                .map(trip -> {
                    if (trip.getAttachment() == null) {
                        return ResponseEntity.notFound().build();
                    }
                    String attachmentType = trip.getAttachmentType();
                    if (attachmentType == null) {
                        attachmentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
                    }
                    return ResponseEntity.ok()
                            .header(HttpHeaders.CONTENT_DISPOSITION,
                                    "attachment; filename=\"" + trip.getAttachmentName() + "\"")
                            .contentType(MediaType.parseMediaType(attachmentType))
                            .body(trip.getAttachment());
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
