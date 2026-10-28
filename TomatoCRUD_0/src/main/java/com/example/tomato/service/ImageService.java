package com.example.tomato.service;



import com.example.tomato.DTOs.StoredImage;
import com.example.tomato.entity.Image;
import com.example.tomato.enums.ImageOwnerType;
import com.example.tomato.repository.ImageRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
public class ImageService {

    private final ImageRepository imageRepository;
    private final LocalImageStorageService storageService;

    public ImageService(
            ImageRepository imageRepository,
            LocalImageStorageService storageService
    ) {
        this.imageRepository = imageRepository;
        this.storageService = storageService;
    }

    @Transactional
    public Image upload(
            ImageOwnerType ownerType,
            Long ownerId,
            MultipartFile file
    ) {
        validateOwner(ownerType, ownerId);

        StoredImage stored = storageService.store(file);

        try {
            Image image = new Image();
            image.setOwnerType(ownerType);
            image.setOwnerId(ownerId);
            image.setImageUrl(stored.imageUrl());
            image.setStorageKey(stored.storageKey());
            image.setOriginalFileName(stored.originalFileName());
            image.setContentType(stored.contentType());
            image.setFileSize(stored.fileSize());
            image.setDisplayOrder(
                    (int) imageRepository.countByOwnerTypeAndOwnerId(
                            ownerType, ownerId
                    )
            );
            image.setPrimaryImage(
                    !imageRepository.existsByOwnerTypeAndOwnerId(
                            ownerType, ownerId
                    )
            );

            return imageRepository.save(image);

        } catch (RuntimeException e) {
            storageService.delete(stored.storageKey());
            throw e;
        }
    }

    @Transactional
    public List<Image> uploadMultiple(
            ImageOwnerType ownerType,
            Long ownerId,
            List<MultipartFile> files
    ) {
        List<Image> uploaded = new ArrayList<>();

        if (files == null || files.isEmpty()) {
            return uploaded;
        }

        for (MultipartFile file : files) {
            if (file != null && !file.isEmpty()) {
                uploaded.add(upload(ownerType, ownerId, file));
            }
        }

        return uploaded;
    }

    public List<Image> getImages(
            ImageOwnerType ownerType,
            Long ownerId
    ) {
        validateOwner(ownerType, ownerId);

        return imageRepository
                .findAllByOwnerTypeAndOwnerIdOrderByDisplayOrderAsc(
                        ownerType, ownerId
                );
    }

    @Transactional
    public Image replace(Long imageId, MultipartFile file) {
        Image image = findImage(imageId);

        StoredImage stored = storageService.store(file);
        String oldStorageKey = image.getStorageKey();

        try {
            image.setImageUrl(stored.imageUrl());
            image.setStorageKey(stored.storageKey());
            image.setOriginalFileName(stored.originalFileName());
            image.setContentType(stored.contentType());
            image.setFileSize(stored.fileSize());

            Image updated = imageRepository.saveAndFlush(image);

            if (oldStorageKey != null
                    && !oldStorageKey.equals(stored.storageKey())) {
                storageService.delete(oldStorageKey);
            }

            return updated;

        } catch (RuntimeException e) {
            storageService.delete(stored.storageKey());
            throw e;
        }
    }

    @Transactional
    public Image setPrimary(Long imageId) {
        Image selected = findImage(imageId);

        List<Image> images = imageRepository
                .findAllByOwnerTypeAndOwnerIdOrderByDisplayOrderAsc(
                        selected.getOwnerType(),
                        selected.getOwnerId()
                );

        for (Image image : images) {
            image.setPrimaryImage(image.getId().equals(imageId));
        }

        imageRepository.saveAll(images);

        return selected;
    }

    @Transactional
    public void deleteImage(Long imageId) {
        Image image = findImage(imageId);
        String storageKey = image.getStorageKey();

        imageRepository.delete(image);
        imageRepository.flush();

        storageService.delete(storageKey);
    }

    @Transactional
    public void deleteAll(
            ImageOwnerType ownerType,
            Long ownerId
    ) {
        List<Image> images = getImages(ownerType, ownerId);

        imageRepository.deleteAll(images);
        imageRepository.flush();

        for (Image image : images) {
            storageService.delete(image.getStorageKey());
        }
    }

    private Image findImage(Long imageId) {
        return imageRepository.findById(imageId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Image not found: " + imageId
                        )
                );
    }

    private void validateOwner(
            ImageOwnerType ownerType,
            Long ownerId
    ) {
        if (ownerType == null || ownerId == null || ownerId <= 0) {
            throw new IllegalArgumentException(
                    "Valid owner type and owner ID are required"
            );
        }
    }
}
