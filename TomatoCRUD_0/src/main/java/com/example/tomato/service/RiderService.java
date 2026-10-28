package com.example.tomato.service;

import com.example.tomato.entity.Rider;
import com.example.tomato.repository.RiderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RiderService {

    private final RiderRepository riderRepository;

    @Transactional
    public Rider createRider(Rider rider) {
        if (rider.getStatus() == null || rider.getStatus().isBlank()) {
            rider.setStatus("Active");
        }
        if (rider.getRating() == null) {
            rider.setRating(4.8);
        }
        if (rider.getOrdersCount() == null) {
            rider.setOrdersCount(0);
        }
        if (rider.getVehicle() == null || rider.getVehicle().isBlank()) {
            rider.setVehicle("Motorcycle");
        }
        return riderRepository.save(rider);
    }

    public List<Rider> getAllRiders() {
        return riderRepository.findAll();
    }

    public Rider getRiderById(Long id) {
        return riderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rider not found with id: " + id));
    }

    @Transactional
    public Rider updateRider(Long id, Rider updatedData) {
        Rider existing = getRiderById(id);

        if (updatedData.getName() != null) existing.setName(updatedData.getName());
        if (updatedData.getEmail() != null) existing.setEmail(updatedData.getEmail());
        if (updatedData.getPhone() != null) existing.setPhone(updatedData.getPhone());
        if (updatedData.getVehicle() != null) existing.setVehicle(updatedData.getVehicle());
        if (updatedData.getZone() != null) existing.setZone(updatedData.getZone());
        if (updatedData.getStatus() != null) existing.setStatus(updatedData.getStatus());
        if (updatedData.getRating() != null) existing.setRating(updatedData.getRating());
        if (updatedData.getOrdersCount() != null) existing.setOrdersCount(updatedData.getOrdersCount());

        return riderRepository.save(existing);
    }

    @Transactional
    public Rider updateStatus(Long id, String status) {
        Rider existing = getRiderById(id);
        existing.setStatus(status);
        return riderRepository.save(existing);
    }

    @Transactional
    public void deleteRider(Long id) {
        if (!riderRepository.existsById(id)) {
            throw new RuntimeException("Rider not found with id: " + id);
        }
        riderRepository.deleteById(id);
    }
}
