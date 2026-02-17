-- Sample Products
INSERT INTO products (id, name, price) VALUES ('apple', 'Apple', 0.30);
INSERT INTO products (id, name, price) VALUES ('banana', 'Banana', 0.50);
INSERT INTO products (id, name, price) VALUES ('orange', 'Orange', 0.60);
INSERT INTO products (id, name, price) VALUES ('milk', 'Milk', 1.20);
INSERT INTO products (id, name, price) VALUES ('bread', 'Bread', 1.00);

-- Sample Offers (Weekly Deals)
-- 2 Apples for 0.45€ (instead of 0.60€)
INSERT INTO offers (id, product_id, required_quantity, offer_price, active) VALUES ('offer-apple', 'apple', 2, 0.45, true);

-- 3 Bananas for 1.20€ (instead of 1.50€)
INSERT INTO offers (id, product_id, required_quantity, offer_price, active) VALUES ('offer-banana', 'banana', 3, 1.20, true);

-- 2 Milk for 2.00€ (instead of 2.40€)
INSERT INTO offers (id, product_id, required_quantity, offer_price, active) VALUES ('offer-milk', 'milk', 2, 2.00, true);

