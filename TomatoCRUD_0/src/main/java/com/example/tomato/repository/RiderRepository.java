package com.example.tomato.repository;

import com.example.tomato.entity.Rider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RiderRepository extends JpaRepository<Rider, Long> {

    List<Rider> findByStatus(String status);

    List<Rider> findByZoneContainingIgnoreCase(String zone);

    List<Rider> findByNameContainingIgnoreCase(String name);
}
