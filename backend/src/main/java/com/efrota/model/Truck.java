package com.efrota.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Truck {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String licensePlate;
    private String model;
    private Double capacity;

    @Enumerated(EnumType.STRING)
    private TruckStatus status;

    public enum TruckStatus {
        AVAILABLE,
        ON_TRIP,
        MAINTENANCE
    }
}
