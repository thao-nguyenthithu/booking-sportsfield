package com.booking_sportsfield.backend.service;

import com.booking_sportsfield.backend.entity.Booking;
import com.booking_sportsfield.backend.entity.Maintenance;
import com.booking_sportsfield.backend.entity.SportsField;
import com.booking_sportsfield.backend.repository.BookingRepository;
import com.booking_sportsfield.backend.repository.MaintenanceRepository;
import com.booking_sportsfield.backend.repository.SportsFieldRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OwnerDashboardService {
    private final SportsFieldRepository sportsFieldRepository;
    private final BookingRepository bookingRepository;
    private final MaintenanceRepository maintenanceRepository;

    public Map<String, Object> getStats(Long ownerId) {
        int totalCourts = sportsFieldRepository.findByOwner_Id(ownerId).size();
        int currentlyBooked = (int) bookingRepository.findByField_Owner_Id(ownerId).stream()
                .filter(b -> b.getBookingDate().equals(LocalDate.now()))
                .count();
        int availableToday = (int) sportsFieldRepository.findByOwner_Id(ownerId).stream()
                .filter(f -> f.getStatus() == SportsField.FieldStatus.ACTIVE)
                .count();
        int maintenanceDue = (int) maintenanceRepository.findByField_Owner_Id(ownerId).stream()
                .filter(m -> m.getDate().isAfter(LocalDate.now().minusDays(1)))
                .count();
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalCourts", totalCourts);
        stats.put("currentlyBooked", currentlyBooked);
        stats.put("availableToday", availableToday);
        stats.put("maintenanceDue", maintenanceDue);
        return stats;
    }

    public List<Booking> getRecentBookings(Long ownerId) {
        return bookingRepository.findByField_Owner_Id(ownerId).stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .limit(10)
                .toList();
    }

    public Map<String, Object> getAvailability(Long ownerId) {
        List<SportsField> fields = sportsFieldRepository.findByOwner_Id(ownerId);
        long total = fields.size();
        long available = fields.stream().filter(f -> f.getStatus() == SportsField.FieldStatus.ACTIVE).count();
        long booked = total - available;
        Map<String, Object> result = new HashMap<>();
        result.put("total", total);
        result.put("available", available);
        result.put("booked", booked);
        return result;
    }

    public List<Maintenance> getUpcomingMaintenance(Long ownerId) {
        return maintenanceRepository.findByField_Owner_Id(ownerId).stream()
                .filter(m -> m.getDate().isAfter(LocalDate.now().minusDays(1)))
                .sorted((a, b) -> a.getDate().compareTo(b.getDate()))
                .limit(10)
                .toList();
    }
} 