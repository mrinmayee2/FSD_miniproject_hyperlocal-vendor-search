DROP DATABASE IF EXISTS vendordb;
CREATE DATABASE vendordb;
USE vendordb;
CREATE TABLE vendors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    service_type VARCHAR(50),
    phone VARCHAR(15),
    pin_code VARCHAR(10),
    address VARCHAR(255),
    rating FLOAT
);


INSERT INTO vendors (name, service_type, phone, pin_code, address, rating) VALUES
('Ramesh Patil', 'Plumber', '9876543210', '413701', 'Near Bus Stand, Shrigonda', 4.5),
('Suresh Kumar', 'Plumber', '9123456780', '413701', 'Main Road, Shrigonda', 4.2),
('Anil Electricals', 'Electrician', '9988776655', '413701', 'Market Yard, Shrigonda', 4.8),
('Vinod Carpenter', 'Carpenter', '9871234560', '413701', 'Station Road, Shrigonda', 4.0),
('Manoj AC Services', 'AC Repair', '9765432100', '413701', 'Pune Nagar Road, Shrigonda', 4.6),
('Sanjay Painter', 'Painter', '9654321098', '413701', 'Old Town, Shrigonda', 3.9),
('Ravi Plumbing', 'Plumber', '9543210987', '411001', 'FC Road, Pune', 4.3),
('Ajay Electric Co', 'Electrician', '9432109876', '411001', 'MG Road, Pune', 4.7);


SELECT * FROM vendors;