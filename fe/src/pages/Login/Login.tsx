import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  UserOutlined,
  LockOutlined,
  EyeTwoTone,
  EyeInvisibleOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { login } from "../../redux/authSlice"; // Import action login từ Redux của bạn

type Props = {};

// Định nghĩa type cho thông tin User theo dữ liệu mẫu của bạn
export interface UserInfo {
  name: string;
  role: string;
  userName: string;
  passWord?: string; // Optional vì khi lưu vào Redux ta không nên lưu password
}

// Khởi tạo mảng dữ liệu mẫu chuẩn TypeScript dùng để test đăng nhập
export const User: UserInfo[] = [
  {
    name: "Minh",
    role: "administrator",
    userName: "admin01",
    passWord: "Pass@123",
  },
  {
    name: "Tin",
    role: "user",
    userName: "employee01",
    passWord: "Pass@123",
  },
];

const Login: React.FC<Props> = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Schema Validation với Yup
  const validationSchema = Yup.object({
    username: Yup.string().required("Vui lòng nhập tên đăng nhập hoặc email"),
    password: Yup.string()
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
      .required("Vui lòng nhập mật khẩu"),
  });

  // Cấu hình Formik
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setFieldError }) => {
      setIsLoading(true);

      // Giả lập gọi API (delay 1.5s)
      setTimeout(() => {
        setIsLoading(false);

        // Kiểm tra thông tin đăng nhập từ form với mảng mock data
        const matchedUser = User.find(
          (u) =>
            u.userName === values.username && u.passWord === values.password,
        );

        if (matchedUser) {
          // Tách password ra, chỉ lưu các thông tin cần thiết vào Redux cho an toàn
          const { passWord, ...userPayload } = matchedUser;

          // Dispatch action lưu toàn bộ thông tin user vào Redux (sẵn sàng cho component DetailUser)
          dispatch(login(userPayload));

          // Điều hướng dựa trên role (ví dụ: 'user' thì vào trang Detail, admin thì vào Dashboard)
          if (userPayload.role === "user") {
            navigate("/"); // Bạn nhớ cấu hình route này trong App.tsx nhé
          } else {
            navigate("/hr/dashboard");
          }
        } else {
          // Trả về lỗi trực tiếp lên UI nếu sai tài khoản/mật khẩu
          setFieldError(
            "password",
            "Tên đăng nhập hoặc mật khẩu không chính xác!",
          );
        }
      }, 1500);
    },
  });

  return (
    <div className="min-h-screen flex font-sans bg-gray-50">
      {/* Nửa trái: Background Branding (Ẩn trên mobile, hiện trên màn hình lớn) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-linear-to-br from-[#1B2A4A] to-[#0D1F35] overflow-hidden items-center justify-center text-white">
        {/* Background Overlay Pattern (Tạo hiệu ứng chiều sâu) */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        ></div>

        <div className="relative z-10 px-12 max-w-lg text-center">
          <h1 className="text-5xl font-bold tracking-tight mb-6">
            MASAN<span className="font-light">HR</span>
          </h1>
          <p className="text-xl font-light leading-relaxed opacity-90 mb-8">
            Hệ thống Quản trị Rủi ro Nhân sự & Phân tích Dữ liệu Ứng dụng Trí
            tuệ Nhân tạo.
          </p>
          <div className="inline-block p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
            <p className="text-sm font-medium">
              ✨ Chào mừng bạn quay trở lại nền tảng
            </p>
          </div>
        </div>
      </div>

      {/* Nửa phải: Form Login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl shadow-xl lg:shadow-none lg:bg-transparent lg:p-0">
          {/* Nút quay lại trang chủ */}
          <button
            onClick={() => navigate("/")}
            type="button"
            className="flex items-center text-sm text-gray-500 hover:text-[#1B2A4A] transition-colors mb-8 group"
          >
            <ArrowLeftOutlined className="mr-2 transform group-hover:-translate-x-1 transition-transform" />
            Quay lại trang chủ
          </button>

          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Đăng nhập</h2>
            <p className="text-gray-500">
              Sử dụng tài khoản <span className="font-semibold">admin01</span>{" "}
              hoặc <span className="font-semibold">eployee01</span> để thử
              nghiệm.
            </p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Input Username */}
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="username"
              >
                Tên đăng nhập
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <UserOutlined
                    className={`text-lg ${formik.touched.username && formik.errors.username ? "text-red-500" : "text-gray-400"}`}
                  />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Nhập tên đăng nhập..."
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border ${
                    formik.touched.username && formik.errors.username
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-200 focus:ring-[#1B2A4A] focus:border-[#1B2A4A]"
                  } bg-gray-50 focus:bg-white outline-none transition-all`}
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.username && formik.errors.username ? (
                <p className="mt-2 text-sm text-red-500">
                  {formik.errors.username}
                </p>
              ) : null}
            </div>

            {/* Input Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="password"
                >
                  Mật khẩu
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-[#1B2A4A] hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <LockOutlined
                    className={`text-lg ${formik.touched.password && formik.errors.password ? "text-red-500" : "text-gray-400"}`}
                  />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`w-full pl-11 pr-12 py-3 rounded-xl border ${
                    formik.touched.password && formik.errors.password
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-200 focus:ring-[#1B2A4A] focus:border-[#1B2A4A]"
                  } bg-gray-50 focus:bg-white outline-none transition-all`}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {/* Nút Toggle Show/Hide Password */}
                <div
                  className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
                </div>
              </div>
              {formik.touched.password && formik.errors.password ? (
                <p className="mt-2 text-sm text-red-500">
                  {formik.errors.password}
                </p>
              ) : null}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-[#1B2A4A] hover:bg-[#243B5E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B2A4A] transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-8"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Đang xử lý...
                </>
              ) : (
                "Đăng nhập"
              )}
            </button>
          </form>

          {/* Footer Form (Register Link) */}
          <div className="mt-8 text-center text-sm text-gray-600">
            Bạn chưa có tài khoản?{" "}
            <Link
              to="/register"
              className="font-semibold text-[#1B2A4A] hover:underline"
            >
              Liên hệ Admin để cấp quyền
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
