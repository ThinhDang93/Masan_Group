import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const HomeTemplate: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {/* pt-16 để đẩy nội dung xuống không bị Header đè lên */}
      <main className="flex-grow pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default HomeTemplate;
