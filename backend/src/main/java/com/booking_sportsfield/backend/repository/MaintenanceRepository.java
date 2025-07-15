package com.booking_sportsfield.backend.repository;

import com.booking_sportsfield.backend.entity.Maintenance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MaintenanceRepository extends JpaRepository<Maintenance, Long> {
    List<Maintenance> findByField_Owner_Id(Long ownerId);
    List<Maintenance> findByField_Id(Long fieldId);
} 