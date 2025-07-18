package com.booking_sportsfield.backend.controller;

import com.booking_sportsfield.backend.dto.owner.OwnerRegisterRequest;
import com.booking_sportsfield.backend.service.OwnerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/owner")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OwnerAuthController {
    private final OwnerService ownerService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody OwnerRegisterRequest request) {
        try {
            ownerService.register(request);
            return ResponseEntity.ok(Map.of("message", "OTP đã được gửi đến email"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String otpCode = request.get("otpCode");
            ownerService.verifyOTP(email, otpCode);
            return ResponseEntity.ok(Map.of("message", "Xác thực thành công! Đăng ký làm chủ sân đã hoàn tất."));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String password = request.get("password");
            
            if (email == null || password == null) {
                return ResponseEntity.badRequest().body(Map.of("message", "Email và mật khẩu không được để trống"));
            }
            
            String token = ownerService.login(email, password);
            return ResponseEntity.ok(Map.of(
                "message", "Đăng nhập thành công!",
                "token", token
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
} 