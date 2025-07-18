package com.booking_sportsfield.backend.controller;

import com.booking_sportsfield.backend.dto.owner.FieldRequest;
import com.booking_sportsfield.backend.dto.owner.FieldResponse;
import com.booking_sportsfield.backend.service.SportsFieldService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.booking_sportsfield.backend.repository.OwnerRepository;
import com.booking_sportsfield.backend.entity.Owner;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/owner/fields")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OwnerFieldController {
    private final SportsFieldService sportsFieldService;
    private final OwnerRepository ownerRepository;

    // Test database connection
    @GetMapping("/db-test")
    public ResponseEntity<?> testDatabase() {
        try {
            // Test if we can access the owner repository
            long ownerCount = ownerRepository.count();
            return ResponseEntity.ok(Map.of(
                "message", "Database connection successful",
                "ownerCount", ownerCount,
                "timestamp", System.currentTimeMillis()
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Database connection failed: " + e.getMessage());
        }
    }

    // Test endpoint to verify connection
    @GetMapping("/test")
    public ResponseEntity<?> testConnection(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            String email = userDetails.getUsername();
            Owner owner = ownerRepository.findByEmail(email).orElseThrow();
            return ResponseEntity.ok(Map.of(
                "message", "Connection successful",
                "ownerId", owner.getId(),
                "ownerEmail", owner.getEmail(),
                "ownerName", owner.getFullName()
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Connection failed: " + e.getMessage());
        }
    }

    // Lấy danh sách sân của owner đang đăng nhập
    @GetMapping
    public ResponseEntity<List<FieldResponse>> getFields(@AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails.getUsername();
        Owner owner = ownerRepository.findByEmail(email).orElseThrow();
        Long ownerId = owner.getId();
        return ResponseEntity.ok(sportsFieldService.getFieldsByOwner(ownerId));
    }

    // Thêm sân mới
    @PostMapping
    public ResponseEntity<?> addField(@AuthenticationPrincipal UserDetails userDetails, @RequestBody FieldRequest req) {
        try {
            String email = userDetails.getUsername();
            Owner owner = ownerRepository.findByEmail(email).orElseThrow();
            Long ownerId = owner.getId();
            
            // Validate required fields
            if (req.getName() == null || req.getName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Tên sân không được để trống");
            }
            if (req.getType() == null || req.getType().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Loại sân không được để trống");
            }
            if (req.getLocation() == null || req.getLocation().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Địa điểm không được để trống");
            }
            if (req.getPricePerHour() == null || req.getPricePerHour().doubleValue() <= 0) {
                return ResponseEntity.badRequest().body("Giá/giờ phải lớn hơn 0");
            }
            if (req.getNumberOfField() <= 0) {
                return ResponseEntity.badRequest().body("Số sân phải lớn hơn 0");
            }
            if (req.getOpenTime() == null) {
                return ResponseEntity.badRequest().body("Giờ mở cửa không được để trống");
            }
            if (req.getCloseTime() == null) {
                return ResponseEntity.badRequest().body("Giờ đóng cửa không được để trống");
            }
            
            FieldResponse response = sportsFieldService.addField(ownerId, req);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace(); // Log the error
            return ResponseEntity.badRequest().body("Lỗi khi thêm sân: " + e.getMessage());
        }
    }

    // Sửa sân
    @PutMapping("/{fieldId}")
    public ResponseEntity<FieldResponse> updateField(@AuthenticationPrincipal UserDetails userDetails, @PathVariable Long fieldId, @RequestBody FieldRequest req) {
        String email = userDetails.getUsername();
        Owner owner = ownerRepository.findByEmail(email).orElseThrow();
        Long ownerId = owner.getId();
        return ResponseEntity.ok(sportsFieldService.updateField(ownerId, fieldId, req));
    }

    // Xóa sân
    @DeleteMapping("/{fieldId}")
    public ResponseEntity<Void> deleteField(@AuthenticationPrincipal UserDetails userDetails, @PathVariable Long fieldId) {
        String email = userDetails.getUsername();
        Owner owner = ownerRepository.findByEmail(email).orElseThrow();
        Long ownerId = owner.getId();
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
        Owner owner = ownerRepository.findByEmail(email).orElseThrow();
        Long ownerId = owner.getId();
        String status = body.get("status");
        return ResponseEntity.ok(sportsFieldService.updateFieldStatus(ownerId, fieldId, status));
    }
} 