package com.example.tomato.DTOs;



public record StoredImage(
        String imageUrl,
        String storageKey,
        String originalFileName,
        String contentType,
        long fileSize
) {
}
