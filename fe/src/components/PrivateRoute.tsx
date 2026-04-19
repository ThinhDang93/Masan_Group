import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Result } from "antd";
import { type RootState } from "../redux/store";

interface Props {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<Props> = ({ children }) => {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth,
  );

  if (!isAuthenticated) {
    return <Navigate to="/loginwithlove" replace />;
  }

  if (user?.role !== "administrator") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Result
          status="403"
          title="Truy cập bị từ chối"
          subTitle="Tài khoản của bạn không có quyền truy cập khu vực HR. Vui lòng liên hệ quản trị viên."
          extra={
            <Button
              type="primary"
              style={{ background: "#DA251D" }}
              href="/"
            >
              Về trang chủ
            </Button>
          }
        />
      </div>
    );
  }

  return <>{children}</>;
};

export default PrivateRoute;
