package com.example.tomato.service;

import com.example.tomato.entity.Coupon;
import com.example.tomato.repository.CouponRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CouponService {

    private final CouponRepository couponRepository;

    @Transactional
    public Coupon createCoupon(Coupon coupon) {
        if (coupon.getCode() != null) {
            coupon.setCode(coupon.getCode().toUpperCase().trim());
        }
        if (coupon.getStatus() == null || coupon.getStatus().isBlank()) {
            coupon.setStatus("Active");
        }
        if (coupon.getDiscountType() == null || coupon.getDiscountType().isBlank()) {
            coupon.setDiscountType("Percentage");
        }
        if (coupon.getUsedCount() == null) {
            coupon.setUsedCount(0);
        }
        if (coupon.getActive() == null) {
            coupon.setActive(true);
        }
        return couponRepository.save(coupon);
    }

    public List<Coupon> getAllCoupons() {
        return couponRepository.findAll();
    }

    public Coupon getCouponById(Long id) {
        return couponRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Coupon not found with id: " + id));
    }

    public Coupon getCouponByCode(String code) {
        return couponRepository.findByCodeIgnoreCase(code)
                .orElseThrow(() -> new RuntimeException("Coupon not found with code: " + code));
    }

    @Transactional
    public Coupon updateCoupon(Long id, Coupon updatedData) {
        Coupon existing = getCouponById(id);

        if (updatedData.getCode() != null) existing.setCode(updatedData.getCode().toUpperCase().trim());
        if (updatedData.getTitle() != null) existing.setTitle(updatedData.getTitle());
        if (updatedData.getDiscountType() != null) existing.setDiscountType(updatedData.getDiscountType());
        if (updatedData.getDiscount() != null) existing.setDiscount(updatedData.getDiscount());
        if (updatedData.getMinOrder() != null) existing.setMinOrder(updatedData.getMinOrder());
        if (updatedData.getMaxDiscount() != null) existing.setMaxDiscount(updatedData.getMaxDiscount());
        if (updatedData.getUsageLimit() != null) existing.setUsageLimit(updatedData.getUsageLimit());
        if (updatedData.getUsedCount() != null) existing.setUsedCount(updatedData.getUsedCount());
        if (updatedData.getStartDate() != null) existing.setStartDate(updatedData.getStartDate());
        if (updatedData.getExpiryDate() != null) existing.setExpiryDate(updatedData.getExpiryDate());
        if (updatedData.getStatus() != null) existing.setStatus(updatedData.getStatus());
        if (updatedData.getDescription() != null) existing.setDescription(updatedData.getDescription());
        if (updatedData.getActive() != null) existing.setActive(updatedData.getActive());

        return couponRepository.save(existing);
    }

    @Transactional
    public Coupon toggleStatus(Long id) {
        Coupon existing = getCouponById(id);
        if ("Active".equalsIgnoreCase(existing.getStatus())) {
            existing.setStatus("Inactive");
            existing.setActive(false);
        } else {
            existing.setStatus("Active");
            existing.setActive(true);
        }
        return couponRepository.save(existing);
    }

    @Transactional
    public void deleteCoupon(Long id) {
        if (!couponRepository.existsById(id)) {
            throw new RuntimeException("Coupon not found with id: " + id);
        }
        couponRepository.deleteById(id);
    }
}
