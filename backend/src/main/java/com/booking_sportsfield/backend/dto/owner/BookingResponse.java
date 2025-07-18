package com.booking_sportsfield.backend.dto.owner;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class BookingResponse {
    private Long id;
    private Long fieldId;
    private String fieldName;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private BigDecimal price;
    private String customerName;
    private String customerPhone;
    private String note;
    private String paymentMethod;
    private String status;
} 