---

# 🏃 Sprint Shop

> Giày thể thao chính hãng — Step Into Your Best

## 🔗 Links
- **Demo:** [https://sprint-shop-project-23651831.vercel.app](https://sprint-shop-project-23651831.vercel.app)
- **GitHub:** [https://github.com/TranSon-code/sprint-shop-project-23651831](https://github.com/TranSon-code/sprint-shop-project-23651831)

## 📋 Mô tả
Sprint Shop là web thương mại điện tử chuyên bán giày thể thao chính hãng từ các thương hiệu hàng đầu thế giới: Nike, Adidas, HOKA, New Balance, Puma, Converse.

## ⚙️ Tech Stack

| Phần | Công nghệ |
|------|-----------|
| Framework | Next.js 14 App Router |
| Database | PostgreSQL (Supabase) |
| Storage | Supabase Storage |
| Styling | CSS thuần + Dark mode |
| Auth | NextAuth.js + bcryptjs |
| State | Zustand (giỏ hàng) |
| Charts | Recharts |
| Icons | Lucide React |

## ✨ Tính năng

### Phía người dùng
- Trang chủ: banner carousel, logo thương hiệu, sản phẩm nổi bật, bộ sưu tập mới
- Danh sách sản phẩm: filter theo brand/category/gender/giá, sort, pagination 16 SP/trang
- Chi tiết sản phẩm: gallery ảnh, chọn size, chọn số lượng, kiểm tra tồn kho
- Giỏ hàng: thêm/sửa số lượng/xóa sản phẩm
- Thanh toán: auto-fill địa chỉ từ profile, Server Action bảo mật, trừ tồn kho tự động
- Lịch sử đơn hàng: xem đơn đã mua, mua lại
- Đăng ký / Đăng nhập / Đăng xuất
- Phân quyền: admin / user

### Phía admin
- Dashboard: tổng đơn hàng, doanh thu, sản phẩm
- Quản lý sản phẩm: thêm/sửa/xóa, đồng thời cập nhật images và variants
- Quản lý đơn hàng: xem danh sách, cập nhật trạng thái đơn

## 🚀 Cài đặt local

### Yêu cầu
- Node.js 18+
- npm

### Các bước

```bash
# Clone repo
git clone https://github.com/TranSon-code/sprint-shop-project-23651831.git
cd sprint-shop-project-23651831

# Cài dependencies
npm install

# Tạo file môi trường
cp .env.example .env.local
```

### Điền biến môi trường vào .env.local

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
```

### Chạy dev server

```bash
npm run dev
```

Mở http://localhost:3000

## 👤 Tài khoản demo

| Role | Email | Mật khẩu |
|------|-------|----------|
| Admin | admin@gmail.com | 123456 |
| User | user1@gmail.com | 123456 |

## 🗄️ Database

- **Platform:** Supabase (PostgreSQL)
- **Schema:** sneaker_shop
- **Số bảng:** 16

| Bảng | Mô tả |
|------|-------|
| users | Tài khoản + địa chỉ + phân quyền |
| brands | Thương hiệu (Nike, Adidas...) |
| categories | Danh mục (Chạy bộ, Bóng rổ...) |
| products | Thông tin giày |
| product_variants | Size + tồn kho |
| product_images | URL ảnh sản phẩm |
| product_labels | Nhãn new/hot/best_seller |
| carts | Giỏ hàng |
| cart_items | Sản phẩm trong giỏ |
| orders | Đơn hàng |
| order_items | Chi tiết đơn hàng |
| payments | Thanh toán |
| reviews | Đánh giá sản phẩm |
| promotions | Chương trình khuyến mãi |
| promotion_targets | Đối tượng khuyến mãi |
| banners | Banner trang chủ |

## 📁 Cấu trúc thư mục

```
sneaker-shop/
├── src/
│   ├── app/                # Next.js App Router (pages & layouts)
│   │   ├── (main)/         # Giao diện User (Trang chủ, SP, Giỏ hàng)
│   │   ├── admin/          # Giao diện Admin Dashboard
│   │   ├── api/            # API Routes (NextAuth)
│   │   ├── actions/        # Server Actions (Xử lý form & DB bảo mật)
│   │   └── globals.css     # CSS toàn cục
│   ├── components/         # UI Components dùng chung (Navbar, Footer, ProductCard)
│   ├── lib/                # Cấu hình thư viện (Supabase, Auth)
│   ├── store/              # Zustand Store quản lý State (Giỏ hàng)
│   └── middleware.js       # Middleware phân quyền & bảo vệ route
├── public/                 # Ảnh, fonts, tài nguyên tĩnh
├── .env.local              # File chứa biến môi trường (Git ignored)
├── next.config.mjs         # Cấu hình Next.js
├── package.json            # Thông tin dependencies
└── README.md               # Tài liệu dự án
```

## 📝 Scripts

```bash
npm run dev      # Development server
npm run build    # Build production  
npm run start    # Production server
npm run lint     # Kiểm tra ESLint
```

## 🗓️ Sprint Report

| Sprint | Thời gian | Nội dung |
|--------|-----------|----------|
| Sprint 1 | Tuần 1-2 | Setup project, database, design system |
| Sprint 2 | Tuần 3-4 | Auth, trang chủ, navbar, footer |
| Sprint 3 | Tuần 5-6 | Danh sách SP, filter, pagination |
| Sprint 4 | Tuần 7-8 | Chi tiết SP, giỏ hàng, checkout |
| Sprint 5 | Tuần 9-10 | Admin dashboard, CRUD sản phẩm |
| Sprint 6 | Tuần 11-12 | Quản lý đơn hàng, deploy, bugfix |

## 🌐 Deploy

Deploy trên **Vercel**.  
Tự động CI/CD khi push lên nhánh main.

## ⚠️ Lưu ý

- Giỏ hàng lưu tạm trên trình duyệt (Zustand), tắt tab sẽ không bị mất dữ liệu ngay, nhưng nếu đổi trình duyệt thì sẽ mất (vì chạy trên LocalStorage).
- Upload ảnh sản phẩm hiện nhập URL thủ công
- Thanh toán là giả lập, chưa tích hợp cổng thanh toán thật

---

Made with ❤️ by [TranSon]
