package com.example.MiniProject.model;

import jakarta.persistence.*;

@Entity
@Table(name = "vendors")
public class Vendor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String serviceType;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    private String pinCode;

    @Column
    private String address;

    @Column
    private Double rating;

    // Constructors
    public Vendor() {}

    public Vendor(String name, String serviceType, String phone, String pinCode, String address, Double rating) {
        this.name = name;
        this.serviceType = serviceType;
        this.phone = phone;
        this.pinCode = pinCode;
        this.address = address;
        this.rating = rating;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getServiceType() { return serviceType; }
    public void setServiceType(String serviceType) { this.serviceType = serviceType; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getPinCode() { return pinCode; }
    public void setPinCode(String pinCode) { this.pinCode = pinCode; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }
}
