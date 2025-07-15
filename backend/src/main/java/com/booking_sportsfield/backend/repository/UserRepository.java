package com.booking_sportsfield.backend.repository;

import com.booking_sportsfield.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    @Query("SELECT u FROM User u WHERE u.email LIKE %:searchTerm% OR u.fullName LIKE %:searchTerm%")
    List<User> findByEmailOrFullNameContaining(@Param("searchTerm") String searchTerm);
} 