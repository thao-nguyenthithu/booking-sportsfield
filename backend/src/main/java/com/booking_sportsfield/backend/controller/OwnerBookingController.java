package com.booking_sportsfield.backend.controller;

import com.booking_sportsfield.backend.dto.owner.BookingRequest;
import com.booking_sportsfield.backend.dto.owner.BookingResponse;
import com.booking_sportsfield.backend.service.BookingService;
import com.booking_sportsfield.backend.repository.UserRepository;
import com.booking_sportsfield.backend.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/owner/bookings")
@RequiredArgsConstructor
public class OwnerBookingController {
    private final BookingService bookingService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<List<BookingResponse>> createBookings(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody BookingRequest req
    ) {
        String email = userDetails.getUsername();
        User user = userRepository.findByEmail(email).orElseThrow();
        Long ownerId = user.getId();
        return ResponseEntity.ok(bookingService.createBookings(ownerId, req));
    }

    @GetMapping
    public ResponseEntity<List<BookingResponse>> getBookingsByDate(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam String date
    ) {
        String email = userDetails.getUsername();
        User user = userRepository.findByEmail(email).orElseThrow();
        Long ownerId = user.getId();
        return ResponseEntity.ok(bookingService.getBookingsByOwnerAndDate(ownerId, date));
    }
} 