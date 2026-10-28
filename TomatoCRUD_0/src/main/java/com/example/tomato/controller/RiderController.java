package com.example.tomato.controller;

import com.example.tomato.entity.Rider;
import com.example.tomato.service.RiderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/riders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RiderController {

    private final RiderService riderService;

    @PostMapping
    public ResponseEntity<Rider> createRider(@RequestBody Rider rider) {
        Rider created = riderService.createRider(rider);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Rider>> getAllRiders() {
        return ResponseEntity.ok(riderService.getAllRiders());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Rider> getRiderById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(riderService.getRiderById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Rider> updateRider(
            @PathVariable Long id,
            @RequestBody Rider rider) {
        try {
            return ResponseEntity.ok(riderService.updateRider(id, rider));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Rider> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload) {
        try {
            String status = payload.get("status");
            return ResponseEntity.ok(riderService.updateStatus(id, status));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRider(@PathVariable Long id) {
        try {
            riderService.deleteRider(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
