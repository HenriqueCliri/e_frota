package com.efrota.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Entity
public class Trip {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Truck truck;

    @ManyToOne
    private Driver driver;

    private Double distance;
    private BigDecimal valueToDriver;
    private String origin;
    private String destination;
    private String cargoType;
    private java.time.LocalDate cargoDeadline;
    private BigDecimal cargoValue;
    private Double driverCommissionRate; // Percentage
    private BigDecimal fuelExpense;
    private BigDecimal tollExpense;
    private BigDecimal foodExpense;
    private BigDecimal unexpectedExpense;
    private String documents; // URL or description

    @Enumerated(EnumType.STRING)
    private TripStatus status;

    public enum TripStatus {
        PLANNED,
        IN_PROGRESS,
        COMPLETED
    }
}
