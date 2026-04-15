import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8 text-center text-sm border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <p>© 2026 Masan Group. Employee Churn Prediction Project.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-white transition-colors">
            Chính sách bảo mật
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Điều khoản dịch vụ
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
