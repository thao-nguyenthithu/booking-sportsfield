package com.booking_sportsfield.backend.dto.owner;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
public class BookingRequest {
    private LocalDate date;
    private List<Slot> slots;
    private String customerName;
    private String customerPhone;
    private String note;
    private String paymentMethod;
    private BigDecimal totalAmount;

    @Data
    public static class Slot {
        private Long fieldId;
        private LocalTime startTime;
        private LocalTime endTime;
        private BigDecimal price;
    }
} 