import React from "react";
import { Button } from "antd";
import { ExportOutlined } from "@ant-design/icons";

type Props = {};

const HRDashboard: React.FC<Props> = () => {
  // Thay thế URL này bằng link thực tế của trang chứa biểu đồ Data Mining của team bạn
  const dashboardUrl =
    "https://app.powerbi.com/groups/me/reports/5d848aae-7a95-43a7-926c-d99561265437/81986bb86970e0305813?ctid=2dff09ac-2b3b-4182-9953-2b548e0d0b39&experience=power-bi";

  // Hàm xử lý mở tab mới chứa Dashboard
  const handleNavigateToDashboard = () => {
    window.open(dashboardUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center p-6">
      {/* Khối Card nội dung chính được tối giản */}
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-lg border border-gray-100 text-center p-10 sm:p-14">
        {/* Chỉ giữ lại 1 tiêu đề */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 tracking-tight">
          Phân Tích Dữ Liệu Nhân Sự
        </h1>

        {/* Nút bấm chuyển hướng */}
        <Button
          type="primary"
          size="large"
          icon={<ExportOutlined />}
          className="bg-[#1B2A4A] hover:bg-[#0D1F35] border-none h-14 px-8 text-base md:text-lg font-semibold rounded-full w-full sm:w-auto shadow-md hover:shadow-lg transition-all"
          onClick={handleNavigateToDashboard}
        >
          Mở Dashboard
        </Button>
      </div>
    </div>
  );
};

export default HRDashboard;
