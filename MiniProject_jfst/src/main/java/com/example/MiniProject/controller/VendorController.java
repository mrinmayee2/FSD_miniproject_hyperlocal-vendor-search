package com.example.MiniProject.controller;

import com.example.MiniProject.model.Vendor;
import com.example.MiniProject.service.VendorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class VendorController {

    @Autowired
    private VendorService vendorService;

    @GetMapping("/search")
    public ResponseEntity<List<Vendor>> searchVendors(
            @RequestParam String pinCode,
            @RequestParam(required = false) String serviceType) {

        if (pinCode == null || pinCode.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        List<Vendor> vendors = vendorService.getVendorsByPinCodeAndService(pinCode.trim(), serviceType);
        return ResponseEntity.ok(vendors);
    }

    // GET /api/services?pinCode=413701  → returns list of service types in that area
    @GetMapping("/services")
    public ResponseEntity<List<String>> getServiceTypes(@RequestParam String pinCode) {
        List<String> services = vendorService.getServiceTypesByPinCode(pinCode.trim());
        return ResponseEntity.ok(services);
    }

    // POST /api/vendors  → add a new vendor
    @PostMapping("/vendors")
    public ResponseEntity<Vendor> addVendor(@RequestBody Vendor vendor) {
        Vendor saved = vendorService.addVendor(vendor);
        return ResponseEntity.ok(saved);
    }

    // GET /api/vendors/{id}
    @GetMapping("/vendors/{id}")
    public ResponseEntity<Vendor> getVendorById(@PathVariable Long id) {
        return vendorService.getVendorById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // PUT /api/vendors/{id}
    @PutMapping("/vendors/{id}")
    public ResponseEntity<Vendor> updateVendor(@PathVariable Long id, @RequestBody Vendor vendor) {
        try {
            Vendor updated = vendorService.updateVendor(id, vendor);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE /api/vendors/{id}
    @DeleteMapping("/vendors/{id}")
    public ResponseEntity<Void> deleteVendor(@PathVariable Long id) {
        vendorService.deleteVendor(id);
        return ResponseEntity.noContent().build();
    }
}
