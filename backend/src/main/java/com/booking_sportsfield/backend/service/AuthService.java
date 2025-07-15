package com.booking_sportsfield.backend.service;

import com.booking_sportsfield.backend.dto.auth.AuthResponse;
import com.booking_sportsfield.backend.dto.auth.LoginRequest;
import com.booking_sportsfield.backend.dto.auth.RegisterRequest;
import com.booking_sportsfield.backend.entity.AuthenticationCode;
import com.booking_sportsfield.backend.entity.User;
import com.booking_sportsfield.backend.repository.AuthenticationCodeRepository;
import com.booking_sportsfield.backend.repository.UserRepository;
import com.booking_sportsfield.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final AuthenticationCodeRepository authCodeRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Validate password confirmation
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Mật khẩu không khớp");
        }
        // Validate role
        if (request.getRole() == null || (!request.getRole().equalsIgnoreCase("PLAYER") && !request.getRole().equalsIgnoreCase("OWNER"))) {
            throw new RuntimeException("Vai trò không hợp lệ");
        }
        User.Role userRole = User.Role.valueOf(request.getRole().toUpperCase());

        // Check if email already exists and is enabled
        User existingUser = userRepository.findByEmail(request.getEmail()).orElse(null);
        if (existingUser != null && existingUser.isEnabled()) {
            throw new RuntimeException("Email đã tồn tại");
        }

        User user;
        if (existingUser != null) {
            // User exists but not enabled, update their information
            user = existingUser;
            user.setFullName(request.getFullName());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setRole(userRole);
            userRepository.save(user);
        } else {
            // Create new user with disabled status
            user = new User();
            user.setEmail(request.getEmail());
            user.setFullName(request.getFullName());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setEnabled(false);
            user.setRole(userRole);
            userRepository.save(user);
        }

        // Delete any existing OTP codes for this email
        authCodeRepository.deleteByEmailAndType(request.getEmail(), AuthenticationCode.CodeType.REGISTRATION);

        // Generate and send OTP
        String otpCode = generateOTP();
        
        AuthenticationCode authCode = new AuthenticationCode();
        authCode.setEmail(request.getEmail());
        authCode.setCode(otpCode);
        authCode.setExpiresAt(LocalDateTime.now().plusMinutes(10));
        authCode.setType(AuthenticationCode.CodeType.REGISTRATION);
        
        authCodeRepository.save(authCode);
        
        // Send OTP email
        emailService.sendOTPEmail(request.getEmail(), otpCode, "Xác thực đăng ký tài khoản");

        return new AuthResponse(
            "OTP đã được gửi đến email",
            null,
            new AuthResponse.UserDto(user.getId(), user.getEmail(), user.getFullName(), user.getRole().name())
        );
    }

    public AuthResponse verifyOTP(String email, String otpCode) {
        // Find valid OTP code
        AuthenticationCode authCode = authCodeRepository
            .findValidCodeByEmailAndCodeAndType(email, otpCode, AuthenticationCode.CodeType.REGISTRATION, LocalDateTime.now())
            .orElseThrow(() -> new RuntimeException("Mã xác thực sai hoặc đã quá hạn. Vui lòng thử lại."));

        // Mark OTP as used
        authCode.setUsed(true);
        authCodeRepository.save(authCode);

        // Enable user account
        User user = userRepository.findByEmail(authCode.getEmail())
            .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
        
        user.setEnabled(true);
        userRepository.save(user);

        return new AuthResponse("Xác thực thành công, bạn có thể đăng nhập", null, null);
    }

    public AuthResponse login(LoginRequest request) {
        // Authenticate user
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        // Get user details
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("Email hoặc mật khẩu không đúng"));

        if (!user.isEnabled()) {
            throw new RuntimeException("Tài khoản chưa được kích hoạt. Vui lòng xác thực email.");
        }

        // Generate JWT token
        String token = jwtService.generateToken(user);

        return new AuthResponse(
            "Đăng nhập thành công!",
            token,
            new AuthResponse.UserDto(user.getId(), user.getEmail(), user.getFullName(), user.getRole().name())
        );
    }

    public AuthResponse forgotPasswordRequest(String email) {
        // Check if user exists
        if (!userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email chưa được đăng kí");
        }

        // Generate and send OTP
        String otpCode = generateOTP();
        
        AuthenticationCode authCode = new AuthenticationCode();
        authCode.setEmail(email);
        authCode.setCode(otpCode);
        authCode.setExpiresAt(LocalDateTime.now().plusMinutes(10));
        authCode.setType(AuthenticationCode.CodeType.PASSWORD_RESET);
        
        authCodeRepository.save(authCode);
        
        // Send OTP email
        emailService.sendOTPEmail(email, otpCode, "Đặt lại mật khẩu");

        return new AuthResponse("Mã xác thực đã được gửi đến email", null, null);
    }

    public AuthResponse resetPassword(String email, String newPassword, String confirmPassword) {
        // Validate password confirmation
        if (!newPassword.equals(confirmPassword)) {
            throw new RuntimeException("Mật khẩu không khớp");
        }

        // Find user
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        // Update password
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return new AuthResponse("Cập nhật mật khẩu thành công", null, null);
    }

    private String generateOTP() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000); // 6-digit OTP
        return String.valueOf(otp);
    }
} 