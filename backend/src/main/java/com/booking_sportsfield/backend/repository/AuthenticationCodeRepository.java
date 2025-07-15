package com.booking_sportsfield.backend.repository;

import com.booking_sportsfield.backend.entity.AuthenticationCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AuthenticationCodeRepository extends JpaRepository<AuthenticationCode, Long> {
    
    @Query("SELECT ac FROM AuthenticationCode ac WHERE ac.email = :email AND ac.type = :type AND ac.used = false AND ac.expiresAt > :now ORDER BY ac.createdAt DESC")
    List<AuthenticationCode> findValidCodesByEmailAndType(@Param("email") String email, 
                                                         @Param("type") AuthenticationCode.CodeType type, 
                                                         @Param("now") LocalDateTime now);
    
    @Query("SELECT ac FROM AuthenticationCode ac WHERE ac.email = :email AND ac.code = :code AND ac.type = :type AND ac.used = false AND ac.expiresAt > :now")
    Optional<AuthenticationCode> findValidCodeByEmailAndCodeAndType(@Param("email") String email, 
                                                                   @Param("code") String code, 
                                                                   @Param("type") AuthenticationCode.CodeType type, 
                                                                   @Param("now") LocalDateTime now);
    
    void deleteByEmailAndType(String email, AuthenticationCode.CodeType type);
} 