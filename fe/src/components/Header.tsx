import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Dropdown, type MenuProps, Avatar } from "antd";
import { DownOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { type RootState } from "../redux/store";
import { logout } from "../redux/authSlice";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth,
  );

  const hrMenuItems: MenuProps["items"] = [
    { key: "1", label: <Link to="/hr/dashboard">Dashboard</Link> },
    { key: "2", label: <Link to="/hr/information">Information</Link> },
    { key: "3", label: <Link to="/hr/demo">Demo</Link> },
  ];

  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      label: "Hồ sơ cá nhân",
      icon: <UserOutlined />,
      onClick: () => {
        navigate("/userDetail");
      },
    },
    { type: "divider" },
    {
      key: "logout",
      label: "Đăng xuất",
      icon: <LogoutOutlined />,
      danger: true,
      onClick: () => {
        localStorage.removeItem("masanhr_user");
        dispatch(logout());
        navigate("/loginwithlove");
      },
    },
  ];

  // Hàm scroll mượt đến các section trên HomePage
  const scrollToSection = (id: string) => {
    navigate("/");
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-sm z-50 transition-all">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="text-2xl font-bold text-[#1B2A4A] tracking-tight"
          >
            MASAN<span className="text-gray-800">HR</span>
          </Link>

          {/* Nav Menu */}
          <nav className="hidden md:flex items-center gap-6 font-medium text-gray-600">
            <Link to="/" className="hover:text-[#1B2A4A] transition-colors">
              Home Page
            </Link>
            <button
              onClick={() => scrollToSection("about")}
              className="hover:text-[#1B2A4A] transition-colors cursor-pointer"
            >
              About Us
            </button>
            <button
              onClick={() => scrollToSection("business")}
              className="hover:text-[#1B2A4A] transition-colors cursor-pointer"
            >
              Our Business
            </button>
            <button
              onClick={() => scrollToSection("people")}
              className="hover:text-[#1B2A4A] transition-colors cursor-pointer"
            >
              Our People
            </button>

            <Dropdown
              menu={{ items: hrMenuItems }}
              trigger={["hover", "click"]}
            >
              <a
                onClick={(e) => e.preventDefault()}
                className="hover:text-[#1B2A4A] transition-colors flex items-center gap-1 cursor-pointer"
              >
                HR <DownOutlined className="text-[10px]" />
              </a>
            </Dropdown>
          </nav>
        </div>

        {/* Right Auth Area */}
        <div className="flex items-center gap-3">
          {!isAuthenticated ? (
            <>
              <Button
                type="text"
                className="font-medium"
                onClick={() => navigate("/loginwithlove")}
              >
                Đăng nhập
              </Button>
            </>
          ) : (
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              trigger={["click"]}
            >
              <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                <Avatar icon={<UserOutlined />} className="bg-[#1B2A4A]" />
                <span className="font-semibold text-gray-700">
                  {user?.name}
                </span>
                <DownOutlined className="text-xs text-gray-400" />
              </div>
            </Dropdown>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
