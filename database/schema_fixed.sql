CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('manager', 'cashier', 'waiter') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    date DATE NOT NULL,
    check_in TIME NOT NULL,
    check_out TIME,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tables (
    id INT AUTO_INCREMENT PRIMARY KEY,
    table_number INT NOT NULL UNIQUE,
    status ENUM('Available', 'Occupied', 'Reserved') DEFAULT 'Available',
    capacity INT DEFAULT 3
);

CREATE TABLE IF NOT EXISTS menu_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category ENUM('Breakfast', 'Lunch/Dinner', 'Snacks') NOT NULL,
    english_name VARCHAR(100) NOT NULL,
    hindi_name VARCHAR(100) NOT NULL,
    kannada_name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(255),
    is_available BOOLEAN DEFAULT TRUE,
    UNIQUE(english_name, category)
);

CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_type ENUM('Dine-in', 'Pre-Order') NOT NULL,
    table_id INT, -- Nullable for Pre-Orders
    status ENUM('Pending', 'Preparing', 'Completed', 'Cancelled') DEFAULT 'Pending',
    total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    discount DECIMAL(10, 2) DEFAULT 0.00,
    final_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    customer_name VARCHAR(100), -- Required for Pre-Orders
    customer_mobile VARCHAR(15), -- Required for Pre-Orders
    visit_time TIME, -- Required for Pre-Orders
    waiter_id INT, -- Nullable for Pre-Orders
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (table_id) REFERENCES tables(id) ON DELETE SET NULL,
    FOREIGN KEY (waiter_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    menu_item_id INT NOT NULL,
    quantity INT NOT NULL,
    price_at_time DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL UNIQUE,
    amount DECIMAL(10, 2) NOT NULL,
    payment_mode ENUM('Cash', 'UPI') NOT NULL,
    status ENUM('Success', 'Failed', 'Pending') DEFAULT 'Success',
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

INSERT IGNORE INTO tables (table_number, capacity) VALUES 
(1, 3), (2, 3), (3, 3), (4, 3), (5, 3), 
(6, 3), (7, 3), (8, 3), (9, 3), (10, 3),
(11, 3), (12, 3), (13, 3), (14, 3), (15, 3);

INSERT IGNORE INTO users (username, password, role) VALUES 
('waiter1', '$2b$10$uzcvVidgH9cq2W.mdvJaeO9qzb0xXm3pNuy./bS2X59tjFo1TxNSW', 'waiter'),
('waiter2', '$2b$10$uzcvVidgH9cq2W.mdvJaeO9qzb0xXm3pNuy./bS2X59tjFo1TxNSW', 'waiter'),
('waiter3', '$2b$10$uzcvVidgH9cq2W.mdvJaeO9qzb0xXm3pNuy./bS2X59tjFo1TxNSW', 'waiter'),
('waiter4', '$2b$10$uzcvVidgH9cq2W.mdvJaeO9qzb0xXm3pNuy./bS2X59tjFo1TxNSW', 'waiter'),
('cashier', '$2b$10$uzcvVidgH9cq2W.mdvJaeO9qzb0xXm3pNuy./bS2X59tjFo1TxNSW', 'cashier'),
('manager', '$2b$10$uzcvVidgH9cq2W.mdvJaeO9qzb0xXm3pNuy./bS2X59tjFo1TxNSW', 'manager');

INSERT IGNORE INTO menu_items (category, english_name, hindi_name, kannada_name, price, image_url) VALUES
('Breakfast', 'Idli', 'इडली', 'ಇಡ್ಲಿ', 35.00, '/images/idli.jpeg'),
('Breakfast', 'Vada', 'वडा', 'ವಡೆ', 35.00, '/images/vada.jpg'),
('Breakfast', 'Sambar', 'सांभर', 'ಸಾಂಬಾರ್', 35.00, '/images/sambar.jpg'),
('Breakfast', 'Poha', 'पोहा', 'ಪೊಹಾ', 35.00, '/images/poha.jpg'),
('Breakfast', 'Sheera', 'शीरा', 'ಶೀರಾ', 35.00, '/images/sheera.jpg'),
('Breakfast', 'Upma', 'उपमा', 'ಉಪ್ಮಾ', 35.00, '/images/upma.jpg'),
('Breakfast', 'Aloo Bonda', 'आलू बोंडा', 'ಆಲೂ ಬೊಂಡಾ', 35.00, '/images/aloo_bonda.jpg'),
('Breakfast', 'Puri', 'पूरी', 'ಪೂರಿ', 35.00, '/images/puri.jpg'),
('Lunch/Dinner', 'Veg Thali (Chapati + 2 Curries + Rice + Papad)', 'वेज थाली', 'ವೆಜ್ ಥಾಳಿ', 70.00, '/images/veg_thali.jpg'),
('Lunch/Dinner', 'Rice', 'चावल', 'ಅನ್ನ', 40.00, '/images/rice.jpg'),
('Lunch/Dinner', 'Extra Chapati', 'अतिरिक्त चपाती', 'ಹೆಚ್ಚುವರಿ ಚಪಾತಿ', 10.00, '/images/extra_chapati.jpg'),
('Snacks', 'Vada Pav', 'वड़ा पाव', 'ವಡಾ ಪಾವ್', 25.00, '/images/vada_pav.jpg'),
('Snacks', 'Bhaji (Plate)', 'भाजी', 'ಭಾಜಿ', 25.00, '/images/bhaji.jpg'),
('Snacks', 'Khara', 'खारा', 'ಖಾರಾ', 30.00, '/images/khara.jpg'),
('Snacks', 'Cutlet', 'कटलेट', 'ಕಟ್ಲೆಟ್', 15.00, '/images/cutlet.jpg'),
('Snacks', 'Patties', 'पैटीज़', 'ಪ್ಯಾಟೀಸ್', 15.00, '/images/patties.jpg');
