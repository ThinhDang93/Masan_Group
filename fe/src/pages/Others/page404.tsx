import React from "react";
import { Button } from "antd";
import { HomeOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

type Props = {};

const Page404: React.FC<Props> = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-10 sm:p-14 relative overflow-hidden">
        {/* Background Overlay Pattern nhẹ */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#EBF0F8] rounded-full blur-3xl opacity-60"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#EBF0F8] rounded-full blur-3xl opacity-60"></div>

        <div className="relative z-10">
          {/* Chữ 404 nổi bật */}
          <h1 className="text-8xl sm:text-9xl font-extrabold text-[#1B2A4A] tracking-tighter drop-shadow-sm mb-4">
            404
          </h1>

          {/* Tiêu đề lỗi */}
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 tracking-tight">
            Không tìm thấy trang
          </h2>

          {/* Mô tả chi tiết */}
          <p className="text-base sm:text-lg text-gray-500 mb-10 leading-relaxed max-w-sm mx-auto">
            Xin lỗi, trang bạn đang cố gắng truy cập không tồn tại, đã bị gỡ bỏ
            hoặc bạn không có quyền truy cập vào đường dẫn này.
          </p>

          {/* Các nút hành động */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="large"
              icon={<ArrowLeftOutlined />}
              className="h-12 px-6 text-base font-medium rounded-full w-full sm:w-auto text-gray-600 hover:text-[#1B2A4A] hover:border-[#1B2A4A] transition-colors"
              onClick={() => navigate(-1)}
            >
              Quay lại
            </Button>
            <Button
              type="primary"
              size="large"
              icon={<HomeOutlined />}
              className="bg-[#1B2A4A] hover:bg-[#0D1F35] border-none h-12 px-8 text-base font-semibold rounded-full w-full sm:w-auto shadow-md hover:shadow-lg transition-all"
              onClick={() => navigate("/")}
            >
              Về Trang chủ
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page404;
