package com.booking_sportsfield.backend.repository;

import com.booking_sportsfield.backend.entity.SportsField;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SportsFieldRepository extends JpaRepository<SportsField, Long> {
    List<SportsField> findByOwner_Id(Long ownerId);
} 