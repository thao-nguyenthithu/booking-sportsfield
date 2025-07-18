package com.booking_sportsfield.backend.controller;

import com.booking_sportsfield.backend.dto.owner.FieldRequest;
import com.booking_sportsfield.backend.dto.owner.FieldResponse;
import com.booking_sportsfield.backend.service.SportsFieldService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.booking_sportsfield.backend.repository.UserRepository;
import com.booking_sportsfield.backend.entity.User;

import java.util.List;

@RestController
@RequestMapping("/api/owner/fields")
@RequiredArgsConstructor
public class OwnerFieldController {
    private final SportsFieldService sportsFieldService;
    private final UserRepository userRepository;

    // Lấy danh sách sân của owner đang đăng nhập
    @GetMapping
    public ResponseEntity<List<FieldResponse>> getFields(@AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails.getUsername();
        User user = userRepository.findByEmail(email).orElseThrow();
        Long ownerId = user.getId();
        return ResponseEntity.ok(sportsFieldService.getFieldsByOwner(ownerId));
    }

    // Thêm sân mới
    @PostMapping
    public ResponseEntity<FieldResponse> addField(@AuthenticationPrincipal UserDetails userDetails, @RequestBody FieldRequest req) {
        String email = userDetails.getUsername();
        User user = userRepository.findByEmail(email).orElseThrow();
        Long ownerId = user.getId();
        return ResponseEntity.ok(sportsFieldService.addField(ownerId, req));
    }

    // Sửa sân
    @PutMapping("/{fieldId}")
    public ResponseEntity<FieldResponse> updateField(@AuthenticationPrincipal UserDetails userDetails, @PathVariable Long fieldId, @RequestBody FieldRequest req) {
        String email = userDetails.getUsername();
        User user = userRepository.findByEmail(email).orElseThrow();
        Long ownerId = user.getId();
        return ResponseEntity.ok(sportsFieldService.updateField(ownerId, fieldId, req));
    }

    // Xóa sân
    @DeleteMapping("/{fieldId}")
    public ResponseEntity<Void> deleteField(@AuthenticationPrincipal UserDetails userDetails, @PathVariable Long fieldId) {
        String email = userDetails.getUsername();
        User user = userRepository.findByEmail(email).orElseThrow();
        Long ownerId = user.getId();
        sportsFieldService.deleteField(ownerId, fieldId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{fieldId}/status")
    public ResponseEntity<FieldResponse> updateFieldStatus(
        @AuthenticationPrincipal UserDetails userDetails,
        @PathVariable Long fieldId,
        @RequestBody java.util.Map<String, String> body
    ) {
        String email = userDetails.getUsername();
        User user = userRepository.findByEmail(email).orElseThrow();
        Long ownerId = user.getId();
        String status = body.get("status");
        return ResponseEntity.ok(sportsFieldService.updateFieldStatus(ownerId, fieldId, status));
    }
} 