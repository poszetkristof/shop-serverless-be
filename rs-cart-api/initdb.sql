DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS carts;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  created_at DATE NOT NULL,
  updated_at DATE NOT NULL,
  status VARCHAR(255) NOT NULL
);

CREATE TABLE cart_items (
  cart_id UUID NOT NULL REFERENCES carts(id),
  product_id UUID NOT NULL,
  count INT NOT NULL
);

INSERT INTO carts (user_id, created_at, updated_at, status)
VALUES 
  ('ec0cfa60-6857-433d-bc74-4075b6d89edf', CURRENT_DATE, CURRENT_DATE, 'OPEN'),
  ('3839dd35-7a4f-4b69-9a4f-379f093c67c3', CURRENT_DATE, CURRENT_DATE, 'ORDERED'),
  ('6898dda2-4324-4ba2-add8-a08b9f6b740c', CURRENT_DATE, CURRENT_DATE, 'OPEN'),
  ('94a2fdbd-762f-4820-9bd7-8b6737f820ac', CURRENT_DATE, CURRENT_DATE, 'ORDERED'),
  ('c4748cf8-5fca-41cd-8c88-772bc60e0c70', CURRENT_DATE, CURRENT_DATE, 'OPEN'),
  ('b18ddfac-ab34-45a4-bd09-eeb10dc0a420', CURRENT_DATE, CURRENT_DATE, 'ORDERED');

INSERT INTO cart_items 
(cart_id, product_id, count)
VALUES 
((SELECT id FROM carts WHERE user_id = 'ec0cfa60-6857-433d-bc74-4075b6d89edf'), '9a4b74f0-379f-4f33-9a4f-093c67c3379f', 2),
((SELECT id FROM carts WHERE user_id = 'ec0cfa60-6857-433d-bc74-4075b6d89edf'), '4571fdc2-630c-4b61-a3a0-612f780176cc', 1),
((SELECT id FROM carts WHERE user_id = '3839dd35-7a4f-4b69-9a4f-379f093c67c3'), 'ace204bd-6186-4ade-a529-2bb7d01713c1', 5),
((SELECT id FROM carts WHERE user_id = '6898dda2-4324-4ba2-add8-a08b9f6b740c'), '9c974d99-493a-4dfa-97b9-88e5f78337d2', 3),
((SELECT id FROM carts WHERE user_id = '94a2fdbd-762f-4820-9bd7-8b6737f820ac'), '42fa782b-3be8-4f15-8cec-7f0c9cd8fe13', 2),
((SELECT id FROM carts WHERE user_id = 'c4748cf8-5fca-41cd-8c88-772bc60e0c70'), '1ece0ada-f604-4fe1-b591-ce94fbabcea0', 6),
((SELECT id FROM carts WHERE user_id = 'b18ddfac-ab34-45a4-bd09-eeb10dc0a420'), '7cf3d08a-157e-4001-a678-8aee77ea125c', 4);
