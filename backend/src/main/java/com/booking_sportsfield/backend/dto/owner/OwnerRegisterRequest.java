package com.booking_sportsfield.backend.dto.owner;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OwnerRegisterRequest {
    private String fullName;
    private String email;
    private String password;
    private String confirmPassword;
} 