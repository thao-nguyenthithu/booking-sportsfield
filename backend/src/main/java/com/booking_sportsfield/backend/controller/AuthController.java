package com.booking_sportsfield.backend.controller;

import com.booking_sportsfield.backend.dto.auth.AuthResponse;
import com.booking_sportsfield.backend.dto.auth.LoginRequest;
import com.booking_sportsfield.backend.dto.auth.RegisterRequest;
import com.booking_sportsfield.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {
    
    private final AuthService authService;
    
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(new AuthResponse(e.getMessage(), null, null));
        }
    }
    
    @PostMapping("/verify-otp")
    public ResponseEntity<AuthResponse> verifyOTP(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String otpCode = request.get("otpCode");
            
            if (email == null || otpCode == null) {
                return ResponseEntity.badRequest()
                    .body(new AuthResponse("Thông tin không được để trống", null, null));
            }
            
            AuthResponse response = authService.verifyOTP(email, otpCode);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(new AuthResponse(e.getMessage(), null, null));
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(new AuthResponse(e.getMessage(), null, null));
        }
    }
    
    @PostMapping("/forgot-password/request")
    public ResponseEntity<AuthResponse> forgotPasswordRequest(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new AuthResponse("Thông tin không được để trống", null, null));
            }
            
            AuthResponse response = authService.forgotPasswordRequest(email);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(new AuthResponse(e.getMessage(), null, null));
        }
    }
    
    @PostMapping("/forgot-password/verify-otp")
    public ResponseEntity<AuthResponse> verifyPasswordResetOTP(@RequestBody Map<String, String> request) {
        try {
            String otpRequestId = request.get("otpRequestId");
            String otpCode = request.get("otpCode");
            
            if (otpRequestId == null || otpCode == null) {
                return ResponseEntity.badRequest()
                    .body(new AuthResponse("Thông tin không được để trống", null, null));
            }
            
            // For now, just return success - in a real implementation, you'd verify the OTP
            return ResponseEntity.ok(new AuthResponse("Xác thực thành công", null, null));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(new AuthResponse(e.getMessage(), null, null));
        }
    }
    
    @PostMapping("/forgot-password/reset")
    public ResponseEntity<AuthResponse> resetPassword(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String newPassword = request.get("newPassword");
            String confirmPassword = request.get("confirmPassword");
            
            if (email == null || newPassword == null || confirmPassword == null) {
                return ResponseEntity.badRequest()
                    .body(new AuthResponse("Thông tin không được để trống", null, null));
            }
            
            AuthResponse response = authService.resetPassword(email, newPassword, confirmPassword);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(new AuthResponse(e.getMessage(), null, null));
        }
    }
} 