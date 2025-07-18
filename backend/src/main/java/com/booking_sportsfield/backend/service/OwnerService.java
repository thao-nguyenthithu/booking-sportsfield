package com.booking_sportsfield.backend.service;

import com.booking_sportsfield.backend.dto.owner.OwnerRegisterRequest;
import com.booking_sportsfield.backend.entity.Owner;
import com.booking_sportsfield.backend.entity.AuthenticationCode;
import com.booking_sportsfield.backend.repository.OwnerRepository;
import com.booking_sportsfield.backend.repository.AuthenticationCodeRepository;
import com.booking_sportsfield.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class OwnerService {
    private final OwnerRepository ownerRepository;
    private final AuthenticationCodeRepository authCodeRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public void register(OwnerRegisterRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Mật khẩu xác nhận không khớp");
        }
        Owner owner = ownerRepository.findByEmail(request.getEmail()).orElse(null);
        if (owner != null && owner.isEnabled()) {
            throw new RuntimeException("Email đã tồn tại");
        }
        if (owner == null) {
            owner = new Owner();
            owner.setEmail(request.getEmail());
        }
        // Cho phép cập nhật lại thông tin nếu chưa xác thực
        owner.setFullName(request.getFullName());
        owner.setPassword(passwordEncoder.encode(request.getPassword()));
        owner.setEnabled(false);
        ownerRepository.save(owner);

        // Xóa OTP cũ
        authCodeRepository.deleteByEmailAndType(request.getEmail(), AuthenticationCode.CodeType.REGISTRATION);

        // Tạo và gửi OTP
        String otpCode = generateOTP();
        AuthenticationCode authCode = new AuthenticationCode();
        authCode.setEmail(request.getEmail());
        authCode.setCode(otpCode);
        authCode.setExpiresAt(LocalDateTime.now().plusMinutes(10));
        authCode.setType(AuthenticationCode.CodeType.REGISTRATION);
        authCodeRepository.save(authCode);

        emailService.sendOTPEmail(request.getEmail(), otpCode, "Xác thực đăng ký chủ sân");
    }

    @Transactional
    public void verifyOTP(String email, String otpCode) {
        AuthenticationCode authCode = authCodeRepository
            .findValidCodeByEmailAndCodeAndType(email, otpCode, AuthenticationCode.CodeType.REGISTRATION, LocalDateTime.now())
            .orElseThrow(() -> new RuntimeException("Mã xác thực sai hoặc đã quá hạn. Vui lòng thử lại."));

        authCode.setUsed(true);
        authCodeRepository.save(authCode);

        Owner owner = ownerRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy chủ sân"));
        owner.setEnabled(true);
        ownerRepository.save(owner);
    }

    public String login(String email, String password) {
        // Authenticate owner
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(email, password)
        );

        // Get owner details
        Owner owner = ownerRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Email hoặc mật khẩu không đúng"));

        if (!owner.isEnabled()) {
            throw new RuntimeException("Tài khoản chưa được kích hoạt. Vui lòng xác thực email.");
        }

        // Generate JWT token
        return jwtService.generateToken(owner);
    }

    private String generateOTP() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }
} 