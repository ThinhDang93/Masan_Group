# DoAnMonHoc — MasanHR: Hệ Thống Quản Trị Rủi Ro Nhân Sự

## Tổng Quan Dự Án

Đồ án môn học xây dựng hệ thống HR nội bộ cho **Masan Group**, tích hợp mô hình **Data Mining / AI** để dự báo rủi ro nghỉ việc của nhân viên (Employee Churn Prediction). Giao diện lấy nhận diện thương hiệu Masan (màu đỏ `#DA251D`).

---

## Cấu Trúc Thư Mục

```
DoAnMonHoc/
├── docker-compose.yml   # PostgreSQL 16 container
├── be/                  # Backend: Node.js + Express + Prisma
│   ├── .env
│   ├── package.json
│   ├── prisma.config.ts
│   └── prisma/schema.prisma
└── fe/                  # Frontend: React + TypeScript + Vite
    ├── src/
    │   ├── App.tsx            # Router chính
    │   ├── template/
    │   │   └── HomeTemplate.tsx   # Layout: Header + Outlet + Footer
    │   ├── components/
    │   │   ├── Header.tsx         # Navbar cố định, auth-aware
    │   │   └── Footer.tsx
    │   ├── pages/
    │   │   ├── HomePage/HomePage.tsx     # Landing page Masan
    │   │   ├── Login/Login.tsx           # Form đăng nhập (mock)
    │   │   ├── Register/Register.tsx     # Stub (chưa làm)
    │   │   ├── User/DetailUser.tsx       # Hồ sơ nhân viên chi tiết
    │   │   ├── HR/HRDashboard.tsx        # Nhúng PowerBI
    │   │   ├── HR/HRInformation.tsx      # Stub (chưa làm)
    │   │   └── HR/HRDemo.tsx             # Stub (chưa làm)
    │   ├── redux/
    │   │   ├── store.ts        # Redux store (chỉ có auth)
    │   │   ├── authSlice.ts    # isAuthenticated + UserInfo
    │   │   └── infoLogin.ts    # Mock data tài khoản
    │   └── models/User/User.ts # Interface UserInfo
    └── vite.config.ts
```

---

## Backend (be/)

| Mục | Chi tiết |
|-----|----------|
| Runtime | Node.js + Express 5 |
| ORM | Prisma 7 (`@prisma/client`) |
| Database | PostgreSQL 16 (Docker, port **5435**) |
| Auth | `bcrypt` + `jsonwebtoken` |
| Validation | `zod` |
| Middleware | `cors`, `helmet`, `morgan` |
| Dev | `nodemon` |

**Database:** tên `qlns_db` (Quản Lý Nhân Sự), user `admin_qlns`, kết nối qua `DATABASE_URL` trong `.env`.

**Khởi động DB:**
```bash
docker compose up -d
```

---

## Frontend (fe/)

| Mục | Chi tiết |
|-----|----------|
| Framework | React 19 + TypeScript + Vite 8 |
| UI | Ant Design 6 + Tailwind CSS 4 |
| State | Redux Toolkit (`authSlice`) |
| Forms | Formik + Yup |
| Data fetching | TanStack React Query 5 |
| Charts | Recharts |
| Routing | React Router DOM 7 |
| HTTP | Axios |

**Khởi động FE:**
```bash
cd fe && yarn dev
```

---

## Routing

| Route | Component | Ghi chú |
|-------|-----------|---------|
| `/` | `HomePage` | Landing page Masan Group |
| `/loginwithlove` | `Login` | Form đăng nhập (không phải `/login`) |
| `/userDetail` | `DetailUser` | Hồ sơ nhân viên, chỉ số HR Analytics |
| `/hr/dashboard` | `HRDashboard` | Mở PowerBI trong tab mới |
| `/hr/information` | `HRInformation` | Stub, chưa triển khai |
| `/hr/demo` | `HRDemo` | Stub, chưa triển khai |

---

## Xác Thực (Mock — Chưa Kết Nối API)

Đăng nhập hiện tại dùng dữ liệu hardcode, giả lập delay 1.5s:

| Username | Password | Role | Điều hướng sau login |
|----------|----------|------|----------------------|
| `admin01` | `Pass@123` | `administrator` | `/hr/dashboard` |
| `eployee01` | `Pass@123` | `user` | `/` |

Redux `authSlice` lưu `{ isAuthenticated, user: UserInfo }`. Password **không** được lưu vào store.

---

## Trang DetailUser — HR Analytics

Hiển thị hồ sơ chi tiết nhân viên với 2 tab:
- **Thông tin cá nhân**: tên, ngày sinh, email, điện thoại, địa chỉ (có chế độ chỉnh sửa)
- **Thông tin Công việc & HR**: mã NV, phòng ban, chức vụ, quản lý + các chỉ số phân tích:
  - Mức độ hài lòng (Progress bar)
  - Số dự án tham gia
  - Thâm niên (năm)
  - Khoảng cách đi làm (km)
  - **Churn Risk**: `Low` / `Medium` / `High` — kết quả từ model AI

---

## Bối Cảnh Kinh Doanh

**Masan Group** — tập đoàn tư nhân lớn nhất Việt Nam, 40,000+ nhân sự.

| Mảng kinh doanh | Mô tả |
|-----------------|-------|
| Masan Consumer | FMCG hàng đầu VN |
| WinCommerce | Chuỗi bán lẻ WinMart / WinMart+ |
| Masan MEATLife | Chuỗi thịt sạch có thương hiệu |
| Phúc Long | Chuỗi trà & cà phê |

---

## Trang Còn Chưa Làm

- `HRInformation` — chỉ render `<div>HRInformation</div>`
- `HRDemo` — chỉ render `<div>HRDemo</div>`
- `Register` — chỉ render `<div>Register</div>`
- Backend API hoàn toàn chưa được viết (chỉ có schema Prisma và config)
- Prisma schema chưa có model nào (file chỉ có phần `generator` và `datasource`)

---

## Lưu Ý Kỹ Thuật

- Route đăng nhập là `/loginwithlove`, **không phải** `/login`
- `HomeTemplate` dùng `pt-16` để tránh content bị Header (fixed, h-16) đè lên
- `HRDashboard` mở PowerBI bằng `window.open(..., '_blank')`, không nhúng iframe
- Màu thương hiệu chính: `#DA251D` (đỏ Masan)
