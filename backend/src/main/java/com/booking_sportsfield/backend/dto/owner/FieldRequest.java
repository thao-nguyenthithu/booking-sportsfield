package com.booking_sportsfield.backend.dto.owner;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.List;

@Data
public class FieldRequest {
    private String name;
    private String type;
    private String location;
    private BigDecimal pricePerHour;
    private LocalTime openTime;
    private LocalTime closeTime;
    private String details;
    private String status; // ACTIVE, MAINTENANCE, INACTIVE
    private List<String> images;
    private int numberOfField;
} 