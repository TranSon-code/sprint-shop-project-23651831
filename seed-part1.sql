-- =============================================
-- SPRINT SHOP - SEED DATA PART 1
-- Brands, Categories, Nike, Adidas products
-- Run in Supabase SQL Editor (schema: sneaker_shop)
-- =============================================

SET search_path TO sneaker_shop;

-- Clean existing data (order matters for FK)
DELETE FROM product_labels;
DELETE FROM product_images;
DELETE FROM product_variants;
DELETE FROM products;
DELETE FROM categories;
DELETE FROM brands;

-- =============================================
-- BRANDS
-- =============================================
INSERT INTO brands (id, name, logo_url) VALUES
('b0000001-0000-0000-0000-000000000001','Nike','https://zpjhtkmwtkgrkyptmovs.supabase.co/storage/v1/object/public/brands/brands/Black-Nike.png'),
('b0000001-0000-0000-0000-000000000002','Adidas','https://zpjhtkmwtkgrkyptmovs.supabase.co/storage/v1/object/public/brands/brands/Adidas.png'),
('b0000001-0000-0000-0000-000000000003','New Balance','https://zpjhtkmwtkgrkyptmovs.supabase.co/storage/v1/object/public/brands/brands/NewBalance.png'),
('b0000001-0000-0000-0000-000000000004','Puma','https://zpjhtkmwtkgrkyptmovs.supabase.co/storage/v1/object/public/brands/brands/Puma.png'),
('b0000001-0000-0000-0000-000000000005','Converse','https://zpjhtkmwtkgrkyptmovs.supabase.co/storage/v1/object/public/brands/brands/Converse.png'),
('b0000001-0000-0000-0000-000000000006','HOKA','https://zpjhtkmwtkgrkyptmovs.supabase.co/storage/v1/object/public/brands/brands/Hoka-Black-Logo-Vector.svg-.png');

-- =============================================
-- CATEGORIES
-- =============================================
INSERT INTO categories (id, name, slug) VALUES
('c0000001-0000-0000-0000-000000000001','Chạy bộ','chay-bo'),
('c0000001-0000-0000-0000-000000000002','Bóng rổ','bong-ro'),
('c0000001-0000-0000-0000-000000000003','Bóng đá','bong-da'),
('c0000001-0000-0000-0000-000000000004','Tập gym','tap-gym'),
('c0000001-0000-0000-0000-000000000005','Lifestyle','lifestyle'),
('c0000001-0000-0000-0000-000000000006','Outdoor','outdoor');

-- =============================================
-- PRODUCTS: NIKE NAM
-- =============================================
INSERT INTO products (id, brand_id, category_id, name, slug, description, price, gender, is_active) VALUES
('a0000001-0000-0000-0000-000000000001','b0000001-0000-0000-0000-000000000001','c0000001-0000-0000-0000-000000000002','Nike LeBron Witness IX EP Đen','nike-lebron-witness-ix-ep-den','Giày bóng rổ Nike LeBron Witness IX EP phiên bản màu đen, đế cao su bền bỉ, đệm Cushlon 3.0.',3200000,'male',true),
('a0000001-0000-0000-0000-000000000002','b0000001-0000-0000-0000-000000000001','c0000001-0000-0000-0000-000000000002','Nike LeBron Witness VIII EP Xám','nike-lebron-witness-viii-ep-xam','Giày bóng rổ Nike LeBron Witness VIII EP màu xám, thiết kế mạnh mẽ, hỗ trợ cổ chân tốt.',2900000,'male',true),
('a0000001-0000-0000-0000-000000000003','b0000001-0000-0000-0000-000000000001','c0000001-0000-0000-0000-000000000001','Nike Downshifter','nike-downshifter-nam','Giày chạy bộ Nike Downshifter nhẹ, đế cao su bền, phù hợp chạy hàng ngày.',1850000,'male',true),
('a0000001-0000-0000-0000-000000000004','b0000001-0000-0000-0000-000000000001','c0000001-0000-0000-0000-000000000005','Nike Jordan CMFT ERA','nike-jordan-cmft-era','Giày lifestyle Nike Jordan CMFT ERA, phong cách retro kết hợp hiện đại.',3500000,'male',true),
('a0000001-0000-0000-0000-000000000005','b0000001-0000-0000-0000-000000000001','c0000001-0000-0000-0000-000000000003','Nike Tiempo Maestro Academy','nike-tiempo-maestro-academy','Giày bóng đá Nike Tiempo Maestro Academy, đế TF, kiểm soát bóng tốt.',2200000,'male',true),
('a0000001-0000-0000-0000-000000000006','b0000001-0000-0000-0000-000000000001','c0000001-0000-0000-0000-000000000004','Nike Victory Pro 3','nike-victory-pro-3','Giày golf Nike Victory Pro 3, đế spikeless, ổn định và thoải mái trên sân.',3800000,'male',true),
('a0000001-0000-0000-0000-000000000007','b0000001-0000-0000-0000-000000000001','c0000001-0000-0000-0000-000000000004','Nike Zoom GP Challenge 1.5 Tennis','nike-zoom-gp-challenge-1-5','Giày tennis sân cứng Nike Zoom GP Challenge 1.5, đệm Zoom Air, bền bỉ.',3200000,'male',true),
('a0000001-0000-0000-0000-000000000008','b0000001-0000-0000-0000-000000000001','c0000001-0000-0000-0000-000000000004','Nike Zoom GP Challenge 1.5 PRM Tennis','nike-zoom-gp-challenge-1-5-prm','Phiên bản PRM của Nike Zoom GP Challenge 1.5 với chất liệu cao cấp hơn.',3800000,'male',true),
('a0000001-0000-0000-0000-000000000009','b0000001-0000-0000-0000-000000000001','c0000001-0000-0000-0000-000000000003','Nike Zoomvapor 16 Academy','nike-zoomvapor-16-academy','Giày bóng đá Nike Zoomvapor 16 Academy, nhẹ, ôm chân tốt.',2500000,'male',true),
('a0000001-0000-0000-0000-000000000010','b0000001-0000-0000-0000-000000000001','c0000001-0000-0000-0000-000000000005','Nike Air Max 90','nike-air-max-90-nam','Huyền thoại Nike Air Max 90, đệm Air ở gót, biểu tượng thời trang đường phố.',4200000,'male',true),
('a0000001-0000-0000-0000-000000000011','b0000001-0000-0000-0000-000000000001','c0000001-0000-0000-0000-000000000002','Nike Jordan Heir Series','nike-jordan-heir-series','Giày bóng rổ Nike Jordan Heir Series, ôm chân, hỗ trợ di chuyển nhanh.',3100000,'male',true),
('a0000001-0000-0000-0000-000000000012','b0000001-0000-0000-0000-000000000001','c0000001-0000-0000-0000-000000000006','Nike Air Zoom Infinity Tour 2 Wide Golf','nike-air-zoom-infinity-tour-2-wide','Giày golf Nike Air Zoom Infinity Tour 2 Wide, đệm Zoom, ổn định cao.',4500000,'male',true),
('a0000001-0000-0000-0000-000000000013','b0000001-0000-0000-0000-000000000001','c0000001-0000-0000-0000-000000000001','Nike Journey Run','nike-journey-run','Giày chạy bộ Nike Journey Run, nhẹ, thoáng khí, phù hợp chạy dài.',2100000,'male',true);

-- =============================================
-- PRODUCTS: NIKE NỮ
-- =============================================
INSERT INTO products (id, brand_id, category_id, name, slug, description, price, gender, is_active) VALUES
('a0000002-0000-0000-0000-000000000001','b0000001-0000-0000-0000-000000000001','c0000001-0000-0000-0000-000000000005','Nike A''Two Standing Ovation','nike-a-two-standing-ovation','Giày lifestyle Nike A''Two Standing Ovation, thiết kế nổi bật, thời trang.',3600000,'female',true),
('a0000002-0000-0000-0000-000000000002','b0000001-0000-0000-0000-000000000001','c0000001-0000-0000-0000-000000000006','Air Jordan Mule Golf Shoes','air-jordan-mule-golf-shoes','Giày golf dạng mule Air Jordan, tháo rời tiện lợi, phong cách.',3900000,'female',true),
('a0000002-0000-0000-0000-000000000003','b0000001-0000-0000-0000-000000000001','c0000001-0000-0000-0000-000000000001','Nike Air Winflo 12 Trắng','nike-air-winflo-12-trang','Giày chạy bộ nữ Nike Air Winflo 12 màu trắng, nhẹ, đệm tốt.',2800000,'female',true),
('a0000002-0000-0000-0000-000000000004','b0000001-0000-0000-0000-000000000001','c0000001-0000-0000-0000-000000000006','Jordan Grind Golf Shoes','jordan-grind-golf-shoes','Giày golf Jordan Grind, đế spikeless, phong cách Jordan trên sân golf.',4100000,'female',true),
('a0000002-0000-0000-0000-000000000005','b0000001-0000-0000-0000-000000000001','c0000001-0000-0000-0000-000000000002','Kobe 9 Low Protro Basketball Shoes','kobe-9-low-protro','Giày bóng rổ Kobe 9 Low Protro, huyền thoại tái sinh, ôm chân xuất sắc.',5200000,'female',true),
('a0000002-0000-0000-0000-000000000006','b0000001-0000-0000-0000-000000000001','c0000001-0000-0000-0000-000000000003','Nike Mercurial Vapor 16 Academy Vini Jr','nike-mercurial-vapor-16-academy-vini-jr','Giày bóng đá Nike Mercurial Vapor 16 Academy phiên bản Vini Jr, siêu nhẹ.',2700000,'female',true),
('a0000002-0000-0000-0000-000000000007','b0000001-0000-0000-0000-000000000001','c0000001-0000-0000-0000-000000000001','Nike Pegasus 42 Hồng','nike-pegasus-42-hong','Giày chạy bộ nữ Nike Pegasus 42 màu hồng, đệm React, thoải mái.',3300000,'female',true),
('a0000002-0000-0000-0000-000000000008','b0000001-0000-0000-0000-000000000001','c0000001-0000-0000-0000-000000000001','Nike Pegasus 42 Women Road Running','nike-pegasus-42-women-road-running','Giày chạy bộ nữ Nike Pegasus 42 cho đường nhựa, bền bỉ và êm ái.',3300000,'female',true),
('a0000002-0000-0000-0000-000000000009','b0000001-0000-0000-0000-000000000001','c0000001-0000-0000-0000-000000000003','Nike Phantom 6 Low Elite Erling Haaland','nike-phantom-6-low-elite-haaland','Giày bóng đá Nike Phantom 6 Low Elite phiên bản Haaland, kiểm soát bóng vượt trội.',4800000,'female',true),
('a0000002-0000-0000-0000-000000000010','b0000001-0000-0000-0000-000000000001','c0000001-0000-0000-0000-000000000004','Nike Tennis Classic Women Shoes','nike-tennis-classic-women','Giày tennis nữ Nike Tennis Classic, kiểu dáng cổ điển, thoải mái.',2400000,'female',true),
('a0000002-0000-0000-0000-000000000011','b0000001-0000-0000-0000-000000000001','c0000001-0000-0000-0000-000000000004','NikeCourt Lite 4 Women Clay Court','nikecourt-lite-4-women-clay-court','Giày tennis sân đất nện NikeCourt Lite 4, bám tốt, bền.',2200000,'female',true);

-- =============================================
-- PRODUCTS: NIKE TRẺ EM
-- =============================================
INSERT INTO products (id, brand_id, category_id, name, slug, description, price, gender, is_active) VALUES
('a0000003-0000-0000-0000-000000000001','b0000001-0000-0000-0000-000000000001','c0000001-0000-0000-0000-000000000002','Giannis Immortality 4 Kids Basketball','giannis-immortality-4-kids','Giày bóng rổ trẻ em Giannis Immortality 4, hỗ trợ tốt, bền bỉ.',1800000,'kids',true),
('a0000003-0000-0000-0000-000000000002','b0000001-0000-0000-0000-000000000001','c0000001-0000-0000-0000-000000000005','Nike Air Max Phoenix Kids','nike-air-max-phoenix-kids','Giày Nike Air Max Phoenix cho trẻ em, đệm Air, thời trang.',2100000,'kids',true),
('a0000003-0000-0000-0000-000000000003','b0000001-0000-0000-0000-000000000001','c0000001-0000-0000-0000-000000000005','Nike Field General Kids','nike-field-general-kids','Giày Nike Field General cho trẻ em, phong cách thể thao năng động.',1900000,'kids',true),
('a0000003-0000-0000-0000-000000000004','b0000001-0000-0000-0000-000000000001','c0000001-0000-0000-0000-000000000001','Nike Free Ride Kids Running','nike-free-ride-kids-running','Giày chạy bộ trẻ em Nike Free Ride, linh hoạt, nhẹ.',1700000,'kids',true),
('a0000003-0000-0000-0000-000000000005','b0000001-0000-0000-0000-000000000001','c0000001-0000-0000-0000-000000000001','Nike Pegasus 42 Kids Road Running','nike-pegasus-42-kids','Giày chạy bộ trẻ em Nike Pegasus 42, công nghệ của người lớn thu nhỏ.',1950000,'kids',true),
('a0000003-0000-0000-0000-000000000006','b0000001-0000-0000-0000-000000000001','c0000001-0000-0000-0000-000000000003','Nike Phantom 6 Low Elite Haaland Kids','nike-phantom-6-kids-haaland','Giày bóng đá trẻ em Nike Phantom 6 Low Elite Haaland, kiểm soát bóng tốt.',2200000,'kids',true),
('a0000003-0000-0000-0000-000000000007','b0000001-0000-0000-0000-000000000001','c0000001-0000-0000-0000-000000000002','Nike S.T. Dynamite Kids Basketball','nike-st-dynamite-kids','Giày bóng rổ trẻ em Nike S.T. Dynamite, cổ thấp, linh hoạt.',1600000,'kids',true),
('a0000003-0000-0000-0000-000000000008','b0000001-0000-0000-0000-000000000001','c0000001-0000-0000-0000-000000000001','Nike Vomero 18 Kids Road Running','nike-vomero-18-kids','Giày chạy bộ trẻ em Nike Vomero 18, đệm cao, êm ái.',2000000,'kids',true);

-- =============================================
-- PRODUCTS: ADIDAS NAM
-- =============================================
INSERT INTO products (id, brand_id, category_id, name, slug, description, price, gender, is_active) VALUES
('a0000004-0000-0000-0000-000000000001','b0000001-0000-0000-0000-000000000002','c0000001-0000-0000-0000-000000000001','Adidas Adizero Adios 9 Xanh Dương','adidas-adizero-adios-9-xanh-duong','Giày chạy bộ Adidas Adizero Adios 9 màu xanh dương, siêu nhẹ, dành cho tốc độ.',4500000,'male',true),
('a0000004-0000-0000-0000-000000000002','b0000001-0000-0000-0000-000000000002','c0000001-0000-0000-0000-000000000001','Adidas Pureboost Light Sneaker Black','adidas-pureboost-light-sneaker-black','Giày chạy bộ Adidas Pureboost Light màu đen, đệm Boost, thoải mái suốt ngày.',3200000,'male',true),
('a0000004-0000-0000-0000-000000000003','b0000001-0000-0000-0000-000000000002','c0000001-0000-0000-0000-000000000003','Adidas Messi League Xanh Mint','adidas-messi-league-xanh-mint','Giày bóng đá Adidas Messi League màu xanh mint, thiết kế lấy cảm hứng từ Messi.',2800000,'male',true);

-- =============================================
-- PRODUCTS: ADIDAS NỮ
-- =============================================
INSERT INTO products (id, brand_id, category_id, name, slug, description, price, gender, is_active) VALUES
('a0000005-0000-0000-0000-000000000001','b0000001-0000-0000-0000-000000000002','c0000001-0000-0000-0000-000000000006','Adidas Codechaos Boa 25 Golf Shoes','adidas-codechaos-boa-25','Giày golf nữ Adidas Codechaos Boa 25, hệ thống dây BOA tiện lợi, spikeless.',4200000,'female',true),
('a0000005-0000-0000-0000-000000000002','b0000001-0000-0000-0000-000000000002','c0000001-0000-0000-0000-000000000001','Adidas Adizero Adios 9 Nữ Xanh Dương','adidas-adizero-adios-9-nu-xanh-duong','Giày chạy bộ nữ Adidas Adizero Adios 9 xanh dương, siêu nhẹ cho tốc độ.',4200000,'female',true),
('a0000005-0000-0000-0000-000000000003','b0000001-0000-0000-0000-000000000002','c0000001-0000-0000-0000-000000000001','Adidas Adizero Evo SL Đen Nữ','adidas-adizero-evo-sl-den-nu','Giày chạy bộ nữ Adidas Adizero Evo SL màu đen, thiết kế tối giản, nhanh nhẹn.',3800000,'female',true),
('a0000005-0000-0000-0000-000000000004','b0000001-0000-0000-0000-000000000002','c0000001-0000-0000-0000-000000000006','Adidas MC70 BOA Golf Shoes','adidas-mc70-boa-golf','Giày golf nữ Adidas MC70 BOA Spikeless, cổ điển và linh hoạt.',3900000,'female',true),
('a0000005-0000-0000-0000-000000000005','b0000001-0000-0000-0000-000000000002','c0000001-0000-0000-0000-000000000003','Adidas Predator League TF Xanh Dương','adidas-predator-league-tf-xanh-duong','Giày bóng đá Adidas Predator League TF màu xanh dương, sân nhân tạo.',2600000,'female',true),
('a0000005-0000-0000-0000-000000000006','b0000001-0000-0000-0000-000000000002','c0000001-0000-0000-0000-000000000002','Adidas Trae Young Unlimited 2 Low','adidas-trae-young-unlimited-2-low','Giày bóng rổ Adidas Trae Young Unlimited 2 Low, linh hoạt, kiểm soát tốt.',3500000,'female',true);

-- =============================================
-- PRODUCTS: ADIDAS TRẺ EM
-- =============================================
INSERT INTO products (id, brand_id, category_id, name, slug, description, price, gender, is_active) VALUES
('a0000006-0000-0000-0000-000000000001','b0000001-0000-0000-0000-000000000002','c0000001-0000-0000-0000-000000000005','Adidas Minecraft Fortarun 4.0 Kids','adidas-minecraft-fortarun-kids','Giày trẻ em Adidas Minecraft Fortarun 4.0, phong cách game thủ, bền bỉ.',1500000,'kids',true),
('a0000006-0000-0000-0000-000000000002','b0000001-0000-0000-0000-000000000002','c0000001-0000-0000-0000-000000000001','Adidas Adizero EVO SL Junior','adidas-adizero-evo-sl-junior','Giày chạy bộ trẻ em Adidas Adizero EVO SL Junior, siêu nhẹ.',2000000,'kids',true),
('a0000006-0000-0000-0000-000000000003','b0000001-0000-0000-0000-000000000002','c0000001-0000-0000-0000-000000000003','Adidas Predator League Trắng Kids','adidas-predator-league-trang-kids','Giày bóng đá trẻ em Adidas Predator League màu trắng, sân cỏ nhân tạo.',1800000,'kids',true);
