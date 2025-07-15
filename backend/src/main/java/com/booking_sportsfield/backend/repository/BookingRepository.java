package com.booking_sportsfield.backend.repository;

import com.booking_sportsfield.backend.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByField_Owner_Id(Long ownerId);
} 