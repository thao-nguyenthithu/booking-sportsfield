package com.booking_sportsfield.backend.dto.owner;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.List;

@Data
public class FieldRequest {
    private String name;
    private String type;
    private String location;
    
    // Handle both BigDecimal and Number for price
    private Object pricePerHour;
    
    // Handle time as string format "HH:mm"
    @JsonFormat(pattern = "HH:mm")
    private LocalTime openTime;
    
    @JsonFormat(pattern = "HH:mm")
    private LocalTime closeTime;
    
    private String details;
    private String status; // ACTIVE, MAINTENANCE, INACTIVE
    private List<String> images;
    private int numberOfField;
    
    // Getter for price that handles conversion
    public BigDecimal getPricePerHour() {
        if (pricePerHour instanceof BigDecimal) {
            return (BigDecimal) pricePerHour;
        } else if (pricePerHour instanceof Number) {
            return BigDecimal.valueOf(((Number) pricePerHour).doubleValue());
        } else if (pricePerHour instanceof String) {
            return new BigDecimal((String) pricePerHour);
        }
        return null;
    }
} 