package com.booking_sportsfield.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {
    
    private final JavaMailSender mailSender;
    
    public void sendOTPEmail(String to, String otpCode, String subject) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText("Mã xác thực của bạn là: " + otpCode + "\n\nMã này có hiệu lực trong 10 phút.\n\nVui lòng không chia sẻ mã này với bất kỳ ai.");
        
        mailSender.send(message);
    }
    
    public void sendPasswordResetEmail(String to, String otpCode) {
        sendOTPEmail(to, otpCode, "Đặt lại mật khẩu");
    }
    
    public void sendRegistrationConfirmationEmail(String to, String otpCode) {
        sendOTPEmail(to, otpCode, "Xác thực đăng ký tài khoản");
    }
} 