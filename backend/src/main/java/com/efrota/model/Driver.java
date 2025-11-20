package com.efrota.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Driver {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String licenseNumber;

    @Enumerated(EnumType.STRING)
    private DriverStatus status;

    public enum DriverStatus {
        AVAILABLE,
        ON_TRIP,
        OFF_DUTY
    }
}
