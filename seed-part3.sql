-- =============================================
-- SPRINT SHOP - SEED DATA PART 3
-- product_images, product_variants, product_labels, banners
-- Run AFTER seed-part1 + seed-part2
-- =============================================

SET search_path TO sneaker_shop;

-- Clean existing
DELETE FROM product_labels;
DELETE FROM product_images;
DELETE FROM product_variants;
DELETE FROM banners;

-- =============================================
-- PRODUCT VARIANTS (dùng generate_series)
-- =============================================

-- Người lớn: size 38-44
INSERT INTO product_variants (product_id, size, stock_quantity)
SELECT id, s, floor(random() * 16 + 5)::int
FROM products
CROSS JOIN generate_series(38, 44) AS s
WHERE gender IN ('male', 'female');

-- Trẻ em: size 28-35
INSERT INTO product_variants (product_id, size, stock_quantity)
SELECT id, s, floor(random() * 16 + 5)::int
FROM products
CROSS JOIN generate_series(28, 35) AS s
WHERE gender = 'kids';

-- =============================================
-- PRODUCT IMAGES
-- =============================================

DO $$
DECLARE
  base TEXT := 'https://zpjhtkmwtkgrkyptmovs.supabase.co/storage/v1/object/public/products/products/';
  rows TEXT[][] := ARRAY[
    -- [product_id, folder_path, ext]
    -- NIKE NAM
    ARRAY['a0000001-0000-0000-0000-000000000001','Nike/Nam/Gia/Giay-Bong-Ro-Nam-Nike-Lebron-Witness-Ix-Ep----en','webp'],
    ARRAY['a0000001-0000-0000-0000-000000000002','Nike/Nam/Gia/Giay-Bong-Ro-Nam-Nike-Lebron-Witness-Viii-Ep---Xam','webp'],
    ARRAY['a0000001-0000-0000-0000-000000000003','Nike/Nam/Nike-Downshifter','webp'],
    ARRAY['a0000001-0000-0000-0000-000000000004','Nike/Nam/Nike-Jordan-CMFT-ERA','webp'],
    ARRAY['a0000001-0000-0000-0000-000000000005','Nike/Nam/Nike-Tiempo-Maestro-Academy','webp'],
    ARRAY['a0000001-0000-0000-0000-000000000006','Nike/Nam/Nike-Victory-Pro-3','webp'],
    ARRAY['a0000001-0000-0000-0000-000000000007','Nike/Nam/Nike-Zoom-GP-Challenge-1.5-Men-s-Hard-Court-Tennis-Shoes','avif'],
    ARRAY['a0000001-0000-0000-0000-000000000008','Nike/Nam/Nike-Zoom-GP-Challenge-1.5-PRM-Men-s-Hard-Court-Tennis-Shoes','avif'],
    ARRAY['a0000001-0000-0000-0000-000000000009','Nike/Nam/Nike-Zoovapor-16-Academy','webp'],
    ARRAY['a0000001-0000-0000-0000-000000000010','Nike/Nam/Nike-air-Max-90','avif'],
    ARRAY['a0000001-0000-0000-0000-000000000011','Nike/Nam/Nike-jordan-heir-series','webp'],
    ARRAY['a0000001-0000-0000-0000-000000000012','Nike/Nam/golf-nike-nam-air-zoom-infinity-tour-2-wide','webp'],
    ARRAY['a0000001-0000-0000-0000-000000000013','Nike/Nam/nike-journey-run','webp'],
    -- NIKE NỮ
    ARRAY['a0000002-0000-0000-0000-000000000001','Nike/Nu/A-Two--Standing-Ovation-','avif'],
    ARRAY['a0000002-0000-0000-0000-000000000002','Nike/Nu/Air-Jordan-Mule-Golf-Shoes','avif'],
    ARRAY['a0000002-0000-0000-0000-000000000003','Nike/Nu/Gia/Giay-Chay-Bo-Nu-Nike-Air-Winflo-12---Trang','webp'],
    ARRAY['a0000002-0000-0000-0000-000000000004','Nike/Nu/Jordan-Grind-Golf-Shoes','avif'],
    ARRAY['a0000002-0000-0000-0000-000000000005','Nike/Nu/Kobe-9-Low-Protro-Basketball-Shoes-','avif'],
    ARRAY['a0000002-0000-0000-0000-000000000006','Nike/Nu/Nike-Mercurial-Vapor-16-Academy--Vini-Jr-.','avif'],
    ARRAY['a0000002-0000-0000-0000-000000000007','Nike/Nu/Nike-Pegasus-42---Ho','webp'],
    ARRAY['a0000002-0000-0000-0000-000000000008','Nike/Nu/Nike-Pegasus-42-Women-s-Road-Running-Shoes','avif'],
    ARRAY['a0000002-0000-0000-0000-000000000009','Nike/Nu/Nike-Phantom-6-Low-Elite--Erling-Haaland-','avif'],
    ARRAY['a0000002-0000-0000-0000-000000000010','Nike/Nu/Nike-Tennis-Classic-Women-s-Shoes','avif'],
    ARRAY['a0000002-0000-0000-0000-000000000011','Nike/Nu/NikeCourt-Lite-4-Women-s-Clay-Court-Tennis-Shoes','avif'],
    -- NIKE TRẺ EM
    ARRAY['a0000003-0000-0000-0000-000000000001','Nike/Tre-em/Giannis-Immortality-4-Older-Kids--Basketball-Shoes','avif'],
    ARRAY['a0000003-0000-0000-0000-000000000002','Nike/Tre-em/Nike-Air-Max-Phoenix-Older-Kids--Shoes','avif'],
    ARRAY['a0000003-0000-0000-0000-000000000003','Nike/Tre-em/Nike-Field-General-Older-Kids--Shoes','avif'],
    ARRAY['a0000003-0000-0000-0000-000000000004','Nike/Tre-em/Nike-Free-Ride-Older-Kids--Running-Shoes','avif'],
    ARRAY['a0000003-0000-0000-0000-000000000005','Nike/Tre-em/Nike-Pegasus-42-Older-Kids--Road-Running-Shoes','avif'],
    ARRAY['a0000003-0000-0000-0000-000000000006','Nike/Tre-em/Nike-Phantom-6-Low-Elite--Erling-Haaland--Firm-Ground-Football-Boot','avif'],
    ARRAY['a0000003-0000-0000-0000-000000000007','Nike/Tre-em/Nike-S.T.-Dynamite-Younger-Kids--Basketball-Shoe','avif'],
    ARRAY['a0000003-0000-0000-0000-000000000008','Nike/Tre-em/Nike-Vomero-18-Older-Kids--Road-Running-Shoes','avif'],
    -- ADIDAS NAM
    ARRAY['a0000004-0000-0000-0000-000000000001','Adidas/Nam/Adidas-Adizero-Adios-9---Xanh-Du','webp'],
    ARRAY['a0000004-0000-0000-0000-000000000002','Adidas/Nam/Adidas-Pureboost-Light-Sneaker-Black','jpg'],
    ARRAY['a0000004-0000-0000-0000-000000000003','Adidas/Nam/Messi-League---Xanh-Mint','webp'],
    -- ADIDAS NỮ
    ARRAY['a0000005-0000-0000-0000-000000000001','Adidas/Nu/Codechaos-Boa-25-Spikeless-Golf-Shoes','avif'],
    ARRAY['a0000005-0000-0000-0000-000000000002','Adidas/Nu/Gia/Giay-Chay-Bo-Nu-Adidas-Adizero-Adios-9---Xanh-Duong','webp'],
    ARRAY['a0000005-0000-0000-0000-000000000003','Adidas/Nu/Gia/Giay-Chay-Bo-Nu-Adidas-Adizero-Evo-Sl----en','webp'],
    ARRAY['a0000005-0000-0000-0000-000000000004','Adidas/Nu/MC70-BOA-Spikeless-Golf-Shoes','avif'],
    ARRAY['a0000005-0000-0000-0000-000000000005','Adidas/Nu/Unisex-Adidas-Predator-League-Tf-Football-Boots---Blue','webp'],
    ARRAY['a0000005-0000-0000-0000-000000000006','Adidas/Nu/Woman-Basketball-Adidas-Unisex-Adult-Trae-Young-Unlimited-2-Low-Trainers','jpg'],
    -- ADIDAS TRẺ EM
    ARRAY['a0000006-0000-0000-0000-000000000001','Adidas/Tre-em/ADIDAS-MINECRAFT-FORTARUN-4.0-SHOES-CHILDREN','avif'],
    ARRAY['a0000006-0000-0000-0000-000000000002','Adidas/Tre-em/Adizero-EVO-SL-Junior-Shoes','avif'],
    ARRAY['a0000006-0000-0000-0000-000000000003','Adidas/Tre-em/Gia/Giay--a-Bong-Danh-Cho-San-Co-Nhan-Tao-Tre-Em-Adidas-Predator-League---Trang','webp'],
    -- HOKA NAM
    ARRAY['a0000007-0000-0000-0000-000000000001','HOKA/Nam/Gia/Giay-Chay-Bo-Nam-HOKA-Mach-6-Wide---Xanh-Navy','webp'],
    ARRAY['a0000007-0000-0000-0000-000000000002','HOKA/Nam/Gia/Giay-Leo-Nui-Nam-HOKA-Hopara-2---Xanh-Duong','webp'],
    ARRAY['a0000007-0000-0000-0000-000000000003','HOKA/Nam/Gia/Giay-Leo-Nui-Nam-HOKA-Hopara-2---Xanh-Quan--oi','webp'],
    -- HOKA NỮ
    ARRAY['a0000008-0000-0000-0000-000000000001','HOKA/Nu/HOKA-Transport---Ho','webp'],
    ARRAY['a0000008-0000-0000-0000-000000000002','HOKA/Nu/Unisex-HOKA-Cielo-X1-2.0-Running-Shoes---Black','webp'],
    ARRAY['a0000008-0000-0000-0000-000000000003','HOKA/Nu/Women-s-Hiking-Transport-2','webp'],
    ARRAY['a0000008-0000-0000-0000-000000000004','HOKA/Nu/Women-s-Hiking-Transport-2-Beige','webp'],
    -- HOKA TRẺ EM
    ARRAY['a0000009-0000-0000-0000-000000000001','HOKA/Tre-em/Big-Kids-Footwear-Best-Seller-Clifton-10','webp'],
    ARRAY['a0000009-0000-0000-0000-000000000002','HOKA/Tre-em/Clifton-10-Pink','webp'],
    ARRAY['a0000009-0000-0000-0000-000000000003','HOKA/Tre-em/Transport-Freedom','webp'],
    -- NEW BALANCE NAM
    ARRAY['a0000010-0000-0000-0000-000000000001','New-Balance/Nam/GIA/GIAY-MKAIRCK1-2E----BLACK','webp'],
    ARRAY['a0000010-0000-0000-0000-000000000002','New-Balance/Nam/MKAIRCD1-2E----GRAY-BLACK','webp'],
    -- NEW BALANCE NỮ
    ARRAY['a0000011-0000-0000-0000-000000000001','New-Balance/Nu/New-Balance-Women-s-Fresh-Foam-Roav-Running-Shoe','jpg'],
    ARRAY['a0000011-0000-0000-0000-000000000002','New-Balance/Nu/New-Balance-Womens-574','jpg'],
    -- NEW BALANCE TRẺ EM
    ARRAY['a0000012-0000-0000-0000-000000000001','New-Balance/Tre-em/New-Balance-Kids--515-V1-Hook-and-Loop-Sneaker','jpg'],
    -- CONVERSE
    ARRAY['a0000013-0000-0000-0000-000000000001','Converse/Nam/Converse-Unisex-Adult-Chuck-Taylor-All-Star-High-Top-Sneaker','jpg'],
    ARRAY['a0000013-0000-0000-0000-000000000002','Converse/Nu/Converse-Unisex-Adult-Chuck-Taylor-All-Star-High-Top-Sneaker','jpg'],
    -- PUMA NAM
    ARRAY['a0000014-0000-0000-0000-000000000001','Puma/Nam/Gia/Giay--a-bong-VITORIA-II-FG-AG-danh-cho-nam-CAM','avif'],
    ARRAY['a0000014-0000-0000-0000-000000000002','Puma/Nam/Gia/Giay-Bong-Ro-Court-Pro-2-Marble','avif'],
    ARRAY['a0000014-0000-0000-0000-000000000003','Puma/Nam/Gia/Giay-Chay-Bo-FAST-R-NITRO--Elite-3-Nam','avif'],
    ARRAY['a0000014-0000-0000-0000-000000000004','Puma/Nam/Gia/Giay-Chay-Bo-Nam-Deviate-NITRO--4','avif'],
    ARRAY['a0000014-0000-0000-0000-000000000005','Puma/Nam/Gia/Giay-Chay-Bo-Velocity-NITRO--4-Nam','avif'],
    ARRAY['a0000014-0000-0000-0000-000000000006','Puma/Nam/Giay-bong-ro-Dagger-2-','avif'],
    -- PUMA NỮ
    ARRAY['a0000015-0000-0000-0000-000000000001','Puma/Nu/Gia/Giay-Chay-Bo-FAST-R-NITRO--Elite-3-Showtime-Nu','avif'],
    ARRAY['a0000015-0000-0000-0000-000000000002','Puma/Nu/Gia/Giay-Deviate-Elite-4-PUMA-x-HYROX-Nu','avif'],
    ARRAY['a0000015-0000-0000-0000-000000000003','Puma/Nu/Gia/Giay-NOVA-Smash-Padel-Nu','avif'],
    ARRAY['a0000015-0000-0000-0000-000000000004','Puma/Nu/Gia/Giay-golf-nu-IGNITE-Blaze-2','avif'],
    ARRAY['a0000015-0000-0000-0000-000000000005','Puma/Nu/Gia/Giay-golf-nu-IGNITE-Blaze-2-Trang-Xanh','avif']
  ];
  r TEXT[];
  i INT;
BEGIN
  FOREACH r SLICE 1 IN ARRAY rows LOOP
    FOR i IN 1..6 LOOP
      INSERT INTO product_images (product_id, image_url, is_primary, sort_order)
      VALUES (
        r[1]::uuid,
        base || r[2] || '/' || i || '.' || r[3],
        i = 1,
        i
      );
    END LOOP;
  END LOOP;
END $$;

-- =============================================
-- PRODUCT LABELS
-- =============================================
INSERT INTO product_labels (product_id, label, expires_at) VALUES
-- hot
('a0000001-0000-0000-0000-000000000010', 'hot', NOW() + INTERVAL '90 days'),   -- Air Max 90
('a0000002-0000-0000-0000-000000000005', 'hot', NOW() + INTERVAL '90 days'),   -- Kobe 9
('a0000004-0000-0000-0000-000000000002', 'hot', NOW() + INTERVAL '90 days'),   -- Pureboost Black
('a0000008-0000-0000-0000-000000000002', 'hot', NOW() + INTERVAL '90 days'),   -- HOKA Cielo X1
('a0000014-0000-0000-0000-000000000003', 'hot', NOW() + INTERVAL '90 days'),   -- FAST R NITRO
-- new
('a0000001-0000-0000-0000-000000000013', 'new', NOW() + INTERVAL '30 days'),   -- Nike Journey Run
('a0000002-0000-0000-0000-000000000007', 'new', NOW() + INTERVAL '30 days'),   -- Pegasus 42 Hồng
('a0000005-0000-0000-0000-000000000002', 'new', NOW() + INTERVAL '30 days'),   -- Adizero Adios 9 Nữ
('a0000007-0000-0000-0000-000000000001', 'new', NOW() + INTERVAL '30 days'),   -- HOKA Mach 6
('a0000015-0000-0000-0000-000000000002', 'new', NOW() + INTERVAL '30 days'),   -- Puma HYROX
-- best_seller
('a0000001-0000-0000-0000-000000000003', 'best_seller', NOW() + INTERVAL '60 days'),  -- Nike Downshifter
('a0000004-0000-0000-0000-000000000001', 'best_seller', NOW() + INTERVAL '60 days'),  -- Adizero Adios 9
('a0000009-0000-0000-0000-000000000001', 'best_seller', NOW() + INTERVAL '60 days'),  -- Clifton 10 Kids
('a0000013-0000-0000-0000-000000000001', 'best_seller', NOW() + INTERVAL '60 days'),  -- Converse Chuck Taylor
('a0000011-0000-0000-0000-000000000002', 'best_seller', NOW() + INTERVAL '60 days');  -- NB 574

-- =============================================
-- BANNERS
-- =============================================
INSERT INTO banners (image_url, subtitle, is_active, sort_order, start_date, end_date) VALUES
('https://zpjhtkmwtkgrkyptmovs.supabase.co/storage/v1/object/public/banners/banner/banner_primary.png', 'Bộ sưu tập mùa hè 2025 - Ưu đãi đến 30%', true, 1, NOW(), NOW() + INTERVAL '90 days'),
('https://zpjhtkmwtkgrkyptmovs.supabase.co/storage/v1/object/public/banners/banner/banner_1.png', 'Nike Air Max 90 - Huyền thoại tái sinh', true, 2, NOW(), NOW() + INTERVAL '90 days'),
('https://zpjhtkmwtkgrkyptmovs.supabase.co/storage/v1/object/public/banners/banner/banner_2.png', 'Adidas Adizero - Siêu nhẹ, siêu tốc', true, 3, NOW(), NOW() + INTERVAL '90 days'),
('https://zpjhtkmwtkgrkyptmovs.supabase.co/storage/v1/object/public/banners/banner/banner_3.png', 'HOKA - Đệm tối đa, chạy không giới hạn', true, 4, NOW(), NOW() + INTERVAL '90 days'),
('https://zpjhtkmwtkgrkyptmovs.supabase.co/storage/v1/object/public/banners/banner/banner_4.png', 'Puma NITRO - Công nghệ đệm thế hệ mới', true, 5, NOW(), NOW() + INTERVAL '90 days');
