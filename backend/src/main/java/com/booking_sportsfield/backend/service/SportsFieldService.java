package com.booking_sportsfield.backend.service;

import com.booking_sportsfield.backend.dto.owner.FieldRequest;
import com.booking_sportsfield.backend.dto.owner.FieldResponse;
import com.booking_sportsfield.backend.entity.SportsField;
import com.booking_sportsfield.backend.entity.User;
import com.booking_sportsfield.backend.repository.SportsFieldRepository;
import com.booking_sportsfield.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SportsFieldService {
    private final SportsFieldRepository sportsFieldRepository;
    private final UserRepository userRepository;

    public List<FieldResponse> getFieldsByOwner(Long ownerId) {
        return sportsFieldRepository.findByOwner_Id(ownerId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public FieldResponse addField(Long ownerId, FieldRequest req) {
        User owner = userRepository.findById(ownerId).orElseThrow(() -> new EntityNotFoundException("Owner not found"));
        SportsField field = new SportsField();
        updateFieldFromRequest(field, req);
        field.setOwner(owner);
        sportsFieldRepository.save(field);
        return toResponse(field);
    }

    @Transactional
    public FieldResponse updateField(Long ownerId, Long fieldId, FieldRequest req) {
        SportsField field = sportsFieldRepository.findById(fieldId)
                .orElseThrow(() -> new EntityNotFoundException("Field not found"));
        if (!field.getOwner().getId().equals(ownerId)) throw new SecurityException("Not your field");
        updateFieldFromRequest(field, req);
        sportsFieldRepository.save(field);
        return toResponse(field);
    }

    @Transactional
    public FieldResponse updateFieldStatus(Long ownerId, Long fieldId, String status) {
        SportsField field = sportsFieldRepository.findById(fieldId)
                .orElseThrow(() -> new EntityNotFoundException("Field not found"));
        if (!field.getOwner().getId().equals(ownerId)) throw new SecurityException("Not your field");
        field.setStatus(SportsField.FieldStatus.valueOf(status));
        sportsFieldRepository.save(field);
        return toResponse(field);
    }

    @Transactional
    public void deleteField(Long ownerId, Long fieldId) {
        SportsField field = sportsFieldRepository.findById(fieldId)
                .orElseThrow(() -> new EntityNotFoundException("Field not found"));
        if (!field.getOwner().getId().equals(ownerId)) throw new SecurityException("Not your field");
        sportsFieldRepository.delete(field);
    }

    private void updateFieldFromRequest(SportsField field, FieldRequest req) {
        field.setName(req.getName());
        field.setType(req.getType());
        field.setLocation(req.getLocation());
        field.setPricePerHour(req.getPricePerHour());
        field.setOpenTime(req.getOpenTime());
        field.setCloseTime(req.getCloseTime());
        field.setDetails(req.getDetails());
        field.setNumberOfField(req.getNumberOfField());
        if (req.getStatus() != null) field.setStatus(SportsField.FieldStatus.valueOf(req.getStatus()));
        if (req.getImages() != null) field.setImages(String.join(",", req.getImages()));
    }

    private FieldResponse toResponse(SportsField field) {
        FieldResponse res = new FieldResponse();
        res.setId(field.getId());
        res.setName(field.getName());
        res.setType(field.getType());
        res.setLocation(field.getLocation());
        res.setPricePerHour(field.getPricePerHour());
        res.setOpenTime(field.getOpenTime());
        res.setCloseTime(field.getCloseTime());
        res.setDetails(field.getDetails());
        res.setStatus(field.getStatus().name());
        res.setImages(field.getImages() != null ? List.of(field.getImages().split(",")) : List.of());
        res.setOwnerId(field.getOwner().getId());
        res.setNumberOfField(field.getNumberOfField());
        return res;
    }
} 