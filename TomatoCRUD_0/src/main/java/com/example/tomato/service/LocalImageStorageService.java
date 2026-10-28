package com.example.tomato.service;


import com.example.tomato.DTOs.StoredImage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Set;
import java.util.UUID;

@Service
public class LocalImageStorageService {

    private final Path uploadDirectory;

    private static final Set<String> ALLOWED_TYPES = Set.of(
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif"
    );

    public LocalImageStorageService(
            @Value("${app.upload.dir:uploads/images}") String uploadDir
    ) {
        this.uploadDirectory = Paths.get(uploadDir)
                .toAbsolutePath()
                .normalize();
    }

    public StoredImage store(MultipartFile file) {
        validate(file);

        try {
            Files.createDirectories(uploadDirectory);

            String originalName = StringUtils.cleanPath(
                    file.getOriginalFilename() == null
                            ? "image"
                            : file.getOriginalFilename()
            );

            String extension = getExtension(originalName);
            String storageKey = UUID.randomUUID() + extension;

            Path target = uploadDirectory.resolve(storageKey).normalize();

            if (!target.startsWith(uploadDirectory)) {
                throw new IllegalArgumentException("Invalid file path");
            }

            Files.copy(
                    file.getInputStream(),
                    target,
                    StandardCopyOption.REPLACE_EXISTING
            );

            return new StoredImage(
                    "/uploads/images/" + storageKey,
                    storageKey,
                    originalName,
                    file.getContentType(),
                    file.getSize()
            );

        } catch (IOException e) {
            throw new RuntimeException("Failed to store image", e);
        }
    }

    public void delete(String storageKey) {
        if (storageKey == null || storageKey.isBlank()) {
            return;
        }

        Path target = uploadDirectory.resolve(storageKey).normalize();

        if (!target.startsWith(uploadDirectory)) {
            throw new IllegalArgumentException("Invalid storage key");
        }

        try {
            Files.deleteIfExists(target);
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete image", e);
        }
    }

    private void validate(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Image file is required");
        }

        if (!ALLOWED_TYPES.contains(file.getContentType())) {
            throw new IllegalArgumentException(
                    "Only JPEG, PNG, WebP and GIF images are allowed"
            );
        }
    }

    private String getExtension(String filename) {
        int dot = filename.lastIndexOf('.');

        if (dot < 0) {
            return "";
        }

        String extension = filename.substring(dot).toLowerCase();

        if (!Set.of(".jpg", ".jpeg", ".png", ".webp", ".gif")
                .contains(extension)) {
            throw new IllegalArgumentException("Unsupported image extension");
        }

        return extension;
    }
}
