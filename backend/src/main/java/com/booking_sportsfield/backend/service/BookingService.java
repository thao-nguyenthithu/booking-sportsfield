package com.booking_sportsfield.backend.service;

import com.booking_sportsfield.backend.dto.owner.BookingRequest;
import com.booking_sportsfield.backend.dto.owner.BookingResponse;
import com.booking_sportsfield.backend.entity.Booking;
import com.booking_sportsfield.backend.entity.SportsField;
import com.booking_sportsfield.backend.repository.BookingRepository;
import com.booking_sportsfield.backend.repository.SportsFieldRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {
    private final BookingRepository bookingRepository;
    private final SportsFieldRepository sportsFieldRepository;

    @Transactional
    public List<BookingResponse> createBookings(Long ownerId, BookingRequest req) {
        List<BookingResponse> result = new ArrayList<>();
        for (BookingRequest.Slot slot : req.getSlots()) {
            SportsField field = sportsFieldRepository.findById(slot.getFieldId()).orElseThrow();
            Booking booking = new Booking();
            booking.setField(field);
            booking.setBookingDate(req.getDate());
            booking.setStartTime(slot.getStartTime());
            booking.setEndTime(slot.getEndTime());
            booking.setTotalAmount(slot.getPrice());
            booking.setCustomerName(req.getCustomerName());
            booking.setCustomerNote(req.getNote());
            booking.setPaymentMethod(req.getPaymentMethod() != null ? Booking.PaymentMethod.valueOf(req.getPaymentMethod()) : null);
            booking.setStatus(Booking.BookingStatus.PAID); // hoặc PENDING_PAYMENT nếu cần
            booking = bookingRepository.save(booking);
            BookingResponse res = new BookingResponse();
            res.setId(booking.getId());
            res.setFieldId(field.getId());
            res.setFieldName(field.getName());
            res.setDate(booking.getBookingDate());
            res.setStartTime(booking.getStartTime());
            res.setEndTime(booking.getEndTime());
            res.setPrice(booking.getTotalAmount());
            res.setCustomerName(booking.getCustomerName());
            res.setNote(booking.getCustomerNote());
            res.setPaymentMethod(booking.getPaymentMethod() != null ? booking.getPaymentMethod().name() : null);
            res.setStatus(booking.getStatus().name());
            result.add(res);
        }
        return result;
    }

    public List<BookingResponse> getBookingsByOwnerAndDate(Long ownerId, String date) {
        // Lấy tất cả booking của owner theo ngày
        List<Booking> bookings = bookingRepository.findByField_Owner_Id(ownerId);
        List<BookingResponse> result = new ArrayList<>();
        for (Booking booking : bookings) {
            if (!booking.getBookingDate().toString().equals(date)) continue;
            BookingResponse res = new BookingResponse();
            res.setId(booking.getId());
            res.setFieldId(booking.getField().getId());
            res.setFieldName(booking.getField().getName());
            res.setDate(booking.getBookingDate());
            res.setStartTime(booking.getStartTime());
            res.setEndTime(booking.getEndTime());
            res.setPrice(booking.getTotalAmount());
            res.setCustomerName(booking.getCustomerName());
            res.setNote(booking.getCustomerNote());
            res.setPaymentMethod(booking.getPaymentMethod() != null ? booking.getPaymentMethod().name() : null);
            res.setStatus(booking.getStatus().name());
            result.add(res);
        }
        return result;
    }
} 