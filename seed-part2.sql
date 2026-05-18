-- =============================================
-- SPRINT SHOP - SEED DATA PART 2
-- HOKA, New Balance, Converse, Puma
-- Run AFTER seed-part1.sql
-- =============================================

SET search_path TO sneaker_shop;

-- HOKA NAM
INSERT INTO products (id, brand_id, category_id, name, slug, description, price, gender, is_active) VALUES
('a0000007-0000-0000-0000-000000000001','b0000001-0000-0000-0000-000000000006','c0000001-0000-0000-0000-000000000001','HOKA Mach 6 Wide Xanh Navy','hoka-mach-6-wide-xanh-navy','Giày chạy bộ HOKA Mach 6 Wide màu xanh navy, đế rộng, đệm MetaRocker.',4200000,'male',true),
('a0000007-0000-0000-0000-000000000002','b0000001-0000-0000-0000-000000000006','c0000001-0000-0000-0000-000000000006','HOKA Hopara 2 Xanh Dương','hoka-hopara-2-xanh-duong','Giày leo núi HOKA Hopara 2 màu xanh dương, bám tốt, thoáng khí.',3800000,'male',true),
('a0000007-0000-0000-0000-000000000003','b0000001-0000-0000-0000-000000000006','c0000001-0000-0000-0000-000000000006','HOKA Hopara 2 Xanh Quân Đội','hoka-hopara-2-xanh-quan-doi','Giày leo núi HOKA Hopara 2 màu xanh quân đội, bền bỉ ngoài trời.',3800000,'male',true);

-- HOKA NỮ
INSERT INTO products (id, brand_id, category_id, name, slug, description, price, gender, is_active) VALUES
('a0000008-0000-0000-0000-000000000001','b0000001-0000-0000-0000-000000000006','c0000001-0000-0000-0000-000000000006','HOKA Transport Hồng','hoka-transport-hong','Giày HOKA Transport màu hồng, phong cách outdoor nhẹ nhàng.',3500000,'female',true),
('a0000008-0000-0000-0000-000000000002','b0000001-0000-0000-0000-000000000006','c0000001-0000-0000-0000-000000000001','HOKA Cielo X1 2.0 Đen','hoka-cielo-x1-2-den','Giày chạy bộ HOKA Cielo X1 2.0 màu đen, siêu nhẹ, dành cho thi đấu.',6500000,'female',true),
('a0000008-0000-0000-0000-000000000003','b0000001-0000-0000-0000-000000000006','c0000001-0000-0000-0000-000000000006','HOKA Women Hiking Transport 2','hoka-women-hiking-transport-2','Giày leo núi nữ HOKA Transport 2, ổn định, chống trượt.',3900000,'female',true),
('a0000008-0000-0000-0000-000000000004','b0000001-0000-0000-0000-000000000006','c0000001-0000-0000-0000-000000000006','HOKA Women Hiking Transport 2 Beige','hoka-women-hiking-transport-2-beige','Giày leo núi nữ HOKA Transport 2 màu be, nhẹ nhàng và thời trang.',3900000,'female',true);

-- HOKA TRẺ EM
INSERT INTO products (id, brand_id, category_id, name, slug, description, price, gender, is_active) VALUES
('a0000009-0000-0000-0000-000000000001','b0000001-0000-0000-0000-000000000006','c0000001-0000-0000-0000-000000000001','HOKA Clifton 10 Kids','hoka-clifton-10-kids','Giày chạy bộ trẻ em HOKA Clifton 10, đệm tối đa, bảo vệ chân.',2800000,'kids',true),
('a0000009-0000-0000-0000-000000000002','b0000001-0000-0000-0000-000000000006','c0000001-0000-0000-0000-000000000001','HOKA Clifton 10 Pink Kids','hoka-clifton-10-pink-kids','Giày chạy bộ trẻ em HOKA Clifton 10 màu hồng, dành cho bé gái.',2800000,'kids',true),
('a0000009-0000-0000-0000-000000000003','b0000001-0000-0000-0000-000000000006','c0000001-0000-0000-0000-000000000006','HOKA Transport Freedom Kids','hoka-transport-freedom-kids','Giày outdoor trẻ em HOKA Transport Freedom, thoải mái, an toàn.',2500000,'kids',true);

-- NEW BALANCE NAM
INSERT INTO products (id, brand_id, category_id, name, slug, description, price, gender, is_active) VALUES
('a0000010-0000-0000-0000-000000000001','b0000001-0000-0000-0000-000000000003','c0000001-0000-0000-0000-000000000005','New Balance MKAIRCK1 2E Đen','new-balance-mkairck1-2e-den','Giày thể thao New Balance MKAIRCK1 2E màu đen, rộng rãi, thoải mái.',3200000,'male',true),
('a0000010-0000-0000-0000-000000000002','b0000001-0000-0000-0000-000000000003','c0000001-0000-0000-0000-000000000005','New Balance MKAIRCD1 2E Xám Đen','new-balance-mkaircd1-2e-xam-den','Giày thể thao New Balance MKAIRCD1 2E màu xám đen, phong cách tối giản.',3400000,'male',true);

-- NEW BALANCE NỮ
INSERT INTO products (id, brand_id, category_id, name, slug, description, price, gender, is_active) VALUES
('a0000011-0000-0000-0000-000000000001','b0000001-0000-0000-0000-000000000003','c0000001-0000-0000-0000-000000000001','New Balance Women Fresh Foam Roav','new-balance-fresh-foam-roav','Giày chạy bộ nữ New Balance Fresh Foam Roav, đệm Fresh Foam, nhẹ êm.',2600000,'female',true),
('a0000011-0000-0000-0000-000000000002','b0000001-0000-0000-0000-000000000003','c0000001-0000-0000-0000-000000000005','New Balance Women 574','new-balance-womens-574','Giày lifestyle New Balance 574 nữ, biểu tượng thời trang bền vững.',2200000,'female',true);

-- NEW BALANCE TRẺ EM
INSERT INTO products (id, brand_id, category_id, name, slug, description, price, gender, is_active) VALUES
('a0000012-0000-0000-0000-000000000001','b0000001-0000-0000-0000-000000000003','c0000001-0000-0000-0000-000000000005','New Balance Kids 515 V1 Hook Loop','new-balance-kids-515-v1','Giày trẻ em New Balance 515 V1 dây dán, dễ mang, thoải mái cả ngày.',1400000,'kids',true);

-- CONVERSE
INSERT INTO products (id, brand_id, category_id, name, slug, description, price, gender, is_active) VALUES
('a0000013-0000-0000-0000-000000000001','b0000001-0000-0000-0000-000000000005','c0000001-0000-0000-0000-000000000005','Converse Chuck Taylor All Star High Top Nam','converse-chuck-taylor-high-top-nam','Giày Converse Chuck Taylor All Star High Top huyền thoại dành cho nam.',1800000,'male',true),
('a0000013-0000-0000-0000-000000000002','b0000001-0000-0000-0000-000000000005','c0000001-0000-0000-0000-000000000005','Converse Chuck Taylor All Star High Top Nữ','converse-chuck-taylor-high-top-nu','Giày Converse Chuck Taylor All Star High Top huyền thoại dành cho nữ.',1800000,'female',true);

-- PUMA NAM
INSERT INTO products (id, brand_id, category_id, name, slug, description, price, gender, is_active) VALUES
('a0000014-0000-0000-0000-000000000001','b0000001-0000-0000-0000-000000000004','c0000001-0000-0000-0000-000000000003','Puma VITORIA II FG AG Cam','puma-vitoria-ii-fg-ag-cam','Giày bóng đá Puma VITORIA II FG AG màu cam, bám tốt trên cỏ tự nhiên và nhân tạo.',2400000,'male',true),
('a0000014-0000-0000-0000-000000000002','b0000001-0000-0000-0000-000000000004','c0000001-0000-0000-0000-000000000002','Puma Court Pro 2 Marble','puma-court-pro-2-marble','Giày bóng rổ Puma Court Pro 2 Marble, thiết kế độc đáo, bám sân tốt.',2800000,'male',true),
('a0000014-0000-0000-0000-000000000003','b0000001-0000-0000-0000-000000000004','c0000001-0000-0000-0000-000000000001','Puma FAST R NITRO Elite 3 Nam','puma-fast-r-nitro-elite-3-nam','Giày chạy bộ Puma FAST R NITRO Elite 3, tấm carbon, dành cho thi đấu.',5800000,'male',true),
('a0000014-0000-0000-0000-000000000004','b0000001-0000-0000-0000-000000000004','c0000001-0000-0000-0000-000000000001','Puma Deviate NITRO 4 Nam','puma-deviate-nitro-4-nam','Giày chạy bộ Puma Deviate NITRO 4, NITROFOAM mới, ổn định và nhanh.',4200000,'male',true),
('a0000014-0000-0000-0000-000000000005','b0000001-0000-0000-0000-000000000004','c0000001-0000-0000-0000-000000000001','Puma Velocity NITRO 4 Nam','puma-velocity-nitro-4-nam','Giày chạy bộ Puma Velocity NITRO 4, cân bằng tốc độ và đệm.',3600000,'male',true),
('a0000014-0000-0000-0000-000000000006','b0000001-0000-0000-0000-000000000004','c0000001-0000-0000-0000-000000000002','Puma Dagger 2 Basketball','puma-dagger-2-basketball','Giày bóng rổ Puma Dagger 2, nhẹ, bám sân, hỗ trợ di chuyển.',2600000,'male',true);

-- PUMA NỮ
INSERT INTO products (id, brand_id, category_id, name, slug, description, price, gender, is_active) VALUES
('a0000015-0000-0000-0000-000000000001','b0000001-0000-0000-0000-000000000004','c0000001-0000-0000-0000-000000000001','Puma FAST R NITRO Elite 3 Showtime Nữ','puma-fast-r-nitro-elite-3-showtime-nu','Giày chạy bộ nữ Puma FAST R NITRO Elite 3 Showtime, tấm carbon, cao cấp.',5800000,'female',true),
('a0000015-0000-0000-0000-000000000002','b0000001-0000-0000-0000-000000000004','c0000001-0000-0000-0000-000000000001','Puma Deviate Elite 4 HYROX Nữ','puma-deviate-elite-4-hyrox-nu','Giày chạy bộ nữ Puma Deviate Elite 4 x HYROX, dành cho obstacle race.',5200000,'female',true),
('a0000015-0000-0000-0000-000000000003','b0000001-0000-0000-0000-000000000004','c0000001-0000-0000-0000-000000000004','Puma NOVA Smash Padel Nữ','puma-nova-smash-padel-nu','Giày padel nữ Puma NOVA Smash, bám tốt, linh hoạt.',2200000,'female',true),
('a0000015-0000-0000-0000-000000000004','b0000001-0000-0000-0000-000000000004','c0000001-0000-0000-0000-000000000006','Puma IGNITE Blaze 2 Golf Nữ','puma-ignite-blaze-2-golf-nu','Giày golf nữ Puma IGNITE Blaze 2, ổn định, chống thấm nước.',3800000,'female',true),
('a0000015-0000-0000-0000-000000000005','b0000001-0000-0000-0000-000000000004','c0000001-0000-0000-0000-000000000006','Puma IGNITE Blaze 2 Trắng Xanh Golf Nữ','puma-ignite-blaze-2-trang-xanh-golf','Giày golf nữ Puma IGNITE Blaze 2 màu trắng xanh, tươi sáng, bền bỉ.',3800000,'female',true);
