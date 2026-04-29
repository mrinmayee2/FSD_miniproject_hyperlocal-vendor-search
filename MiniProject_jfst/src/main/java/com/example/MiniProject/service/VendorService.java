package com.example.MiniProject.service;

import com.example.MiniProject.model.Vendor;
import com.example.MiniProject.repository.VendorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VendorService {

    @Autowired
    private VendorRepository vendorRepository;

    // Get all vendors by pinCode
    public List<Vendor> getVendorsByPinCode(String pinCode) {
        return vendorRepository.findByPinCode(pinCode);
    }

    // Get vendors filtered by pinCode + serviceType
    public List<Vendor> getVendorsByPinCodeAndService(String pinCode, String serviceType) {
        if (serviceType == null || serviceType.trim().isEmpty()) {
            return vendorRepository.findByPinCode(pinCode);
        }
        return vendorRepository.findByPinCodeAndServiceTypeIgnoreCase(pinCode, serviceType);
    }

    // Get all distinct service types available in a pinCode
    public List<String> getServiceTypesByPinCode(String pinCode) {
        return vendorRepository.findDistinctServiceTypesByPinCode(pinCode);
    }

    // Add a new vendor
    public Vendor addVendor(Vendor vendor) {
        return vendorRepository.save(vendor);
    }

    // Get vendor by ID
    public Optional<Vendor> getVendorById(Long id) {
        return vendorRepository.findById(id);
    }

    // Delete vendor by ID
    public void deleteVendor(Long id) {
        vendorRepository.deleteById(id);
    }

    // Update vendor
    public Vendor updateVendor(Long id, Vendor updatedVendor) {
        return vendorRepository.findById(id).map(vendor -> {
            vendor.setName(updatedVendor.getName());
            vendor.setServiceType(updatedVendor.getServiceType());
            vendor.setPhone(updatedVendor.getPhone());
            vendor.setPinCode(updatedVendor.getPinCode());
            vendor.setAddress(updatedVendor.getAddress());
            vendor.setRating(updatedVendor.getRating());
            return vendorRepository.save(vendor);
        }).orElseThrow(() -> new RuntimeException("Vendor not found with id: " + id));
    }
}
