package com.booking_sportsfield.backend.controller;

import com.booking_sportsfield.backend.entity.Booking;
import com.booking_sportsfield.backend.entity.Maintenance;
import com.booking_sportsfield.backend.service.OwnerDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/owner/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OwnerDashboardController {
    private final OwnerDashboardService dashboardService;

    // Lấy ownerId từ principal hoặc request param (tạm thời dùng request param cho demo)
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats(@RequestParam Long ownerId) {
        return ResponseEntity.ok(dashboardService.getStats(ownerId));
    }

    @GetMapping("/recent-bookings")
    public ResponseEntity<List<Booking>> getRecentBookings(@RequestParam Long ownerId) {
        return ResponseEntity.ok(dashboardService.getRecentBookings(ownerId));
    }

    @GetMapping("/availability")
    public ResponseEntity<Map<String, Object>> getAvailability(@RequestParam Long ownerId) {
        return ResponseEntity.ok(dashboardService.getAvailability(ownerId));
    }

    @GetMapping("/maintenance")
    public ResponseEntity<List<Maintenance>> getMaintenance(@RequestParam Long ownerId) {
        return ResponseEntity.ok(dashboardService.getUpcomingMaintenance(ownerId));
    }
} 