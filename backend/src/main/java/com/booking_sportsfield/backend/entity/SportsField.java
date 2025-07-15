package com.booking_sportsfield.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "sports_fields")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SportsField {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Column(nullable = false)
    private String name;
    
    @NotBlank
    @Column(nullable = false)
    private String type;
    
    @NotBlank
    @Column(nullable = false)
    private String location;
    
    @NotNull
    @Positive
    @Column(name = "price_per_hour", nullable = false)
    private BigDecimal pricePerHour;
    
    @Column(name = "open_time", nullable = false)
    private LocalTime openTime;
    
    @Column(name = "close_time", nullable = false)
    private LocalTime closeTime;
    
    @Column(columnDefinition = "TEXT")
    private String details;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FieldStatus status = FieldStatus.ACTIVE;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private User owner;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public enum FieldStatus {
        ACTIVE,
        MAINTENANCE,
        INACTIVE
    }
} 