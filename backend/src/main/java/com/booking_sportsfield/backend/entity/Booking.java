package com.booking_sportsfield.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "field_id", nullable = false)
    private SportsField field;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    
    @NotNull
    @Column(name = "booking_date", nullable = false)
    private LocalDate bookingDate;
    
    @NotNull
    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;
    
    @NotNull
    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;
    
    @NotNull
    @Column(name = "total_amount", nullable = false)
    private BigDecimal totalAmount;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status = BookingStatus.PENDING_PAYMENT;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "customer_type", nullable = false)
    private CustomerType customerType = CustomerType.REGISTERED;
    
    @Column(name = "customer_name")
    private String customerName;
    
    @Column(name = "customer_note", columnDefinition = "TEXT")
    private String customerNote;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method")
    private PaymentMethod paymentMethod;
    
    @Column(name = "transfer_content")
    private String transferContent;
    
    @Column(name = "refund_bank_account")
    private String refundBankAccount;
    
    @Column(name = "refund_bank_name")
    private String refundBankName;
    
    @Column(name = "refund_account_holder")
    private String refundAccountHolder;
    
    @Column(name = "cancellation_reason", columnDefinition = "TEXT")
    private String cancellationReason;
    
    @Column(name = "refund_amount")
    private BigDecimal refundAmount;
    
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
    
    public enum BookingStatus {
        PENDING_PAYMENT,
        PAID,
        CANCELLATION_REQUESTED,
        CANCELLED_BY_MANAGER,
        COMPLETED
    }
    
    public enum CustomerType {
        REGISTERED,
        WALK_IN
    }
    
    public enum PaymentMethod {
        CASH,
        BANK_TRANSFER_OFFLINE,
        BANK_TRANSFER_ONLINE
    }
    
    public boolean canBeCancelled() {
        LocalDateTime bookingStart = LocalDateTime.of(bookingDate, startTime);
        return LocalDateTime.now().isBefore(bookingStart);
    }
    
    public boolean isInProgress() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime bookingStart = LocalDateTime.of(bookingDate, startTime);
        LocalDateTime bookingEnd = LocalDateTime.of(bookingDate, endTime);
        return now.isAfter(bookingStart) && now.isBefore(bookingEnd);
    }
    
    public boolean isHalfwayThrough() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime bookingStart = LocalDateTime.of(bookingDate, startTime);
        LocalDateTime bookingEnd = LocalDateTime.of(bookingDate, endTime);
        long totalSeconds = java.time.Duration.between(bookingStart, bookingEnd).getSeconds();
        LocalDateTime halfway = bookingStart.plusSeconds(totalSeconds / 2);
        return now.isAfter(halfway);
    }
} 