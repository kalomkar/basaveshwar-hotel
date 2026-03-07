UPDATE menu_items SET image_url = '/images/idli.jpeg' WHERE english_name = 'Idli';
UPDATE menu_items SET image_url = '/images/vada.jpg' WHERE english_name = 'Vada';
UPDATE menu_items SET image_url = '/images/veg_thali.jpg' WHERE english_name LIKE 'Veg Thali%';
UPDATE menu_items SET image_url = '/images/poha.jpg' WHERE english_name = 'Poha';
UPDATE menu_items SET image_url = '/images/vada_pav.jpg' WHERE english_name = 'Vada Pav';
INSERT IGNORE INTO menu_items (category, english_name, hindi_name, kannada_name, price, image_url) 
VALUES ('Lunch/Dinner', 'Banana Leaf Special Thali', 'केले के पत्ते की विशेष थाली', 'ಬಾಳೆ ಎಲೆ ವಿಶೇಷ ಥಾಲಿ', 120.00, '/images/veg_thali.jpg');
