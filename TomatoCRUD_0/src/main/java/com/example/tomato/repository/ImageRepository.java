
package com.example.tomato.repository;

import com.example.tomato.entity.Image;
import com.example.tomato.enums.ImageOwnerType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ImageRepository extends JpaRepository<Image, Long> {

    List<Image> findAllByOwnerTypeAndOwnerIdOrderByDisplayOrderAsc(
            ImageOwnerType ownerType,
            Long ownerId
    );

    boolean existsByOwnerTypeAndOwnerId(
            ImageOwnerType ownerType,
            Long ownerId
    );

    long countByOwnerTypeAndOwnerId(
            ImageOwnerType ownerType,
            Long ownerId
    );
}
