package com.example.MiniProject.repository;

import com.example.MiniProject.model.Vendor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VendorRepository extends JpaRepository<Vendor, Long> {

    // Search by pinCode only
    List<Vendor> findByPinCode(String pinCode);

    // Search by pinCode AND serviceType (case-insensitive)
    List<Vendor> findByPinCodeAndServiceTypeIgnoreCase(String pinCode, String serviceType);

    // Search by pinCode and partial name match
    @Query("SELECT v FROM Vendor v WHERE v.pinCode = :pinCode AND LOWER(v.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Vendor> findByPinCodeAndNameContaining(@Param("pinCode") String pinCode, @Param("name") String name);

    // Get all distinct service types for a pinCode
    @Query("SELECT DISTINCT v.serviceType FROM Vendor v WHERE v.pinCode = :pinCode")
    List<String> findDistinctServiceTypesByPinCode(@Param("pinCode") String pinCode);
}
