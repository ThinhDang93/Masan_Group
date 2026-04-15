import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";

// Layout
import HomeTemplate from "./template/HomeTemplate";

// Pages (Import giả định, bạn cần tạo các file này)
import HomePage from "./pages/HomePage/HomePage";
import Login from "./pages/Login/Login";
import HRDashboard from "./pages/HR/HRDashboard";
import DetailUser from "./pages/User/DetailUser";
import HRInformation from "./pages/HR/HRInformation";
import HRDemo from "./pages/HR/HRDemo";
// Các page HR bạn tạo file rỗng chứa text tạm thời nhé

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* Main Layout */}
          <Route path="/" element={<HomeTemplate />}>
            <Route index element={<HomePage />} />
            <Route path="/userDetail" element={<DetailUser />}></Route>
            {/* HR Routes */}
            <Route path="hr">
              <Route path="dashboard" element={<HRDashboard />} />
              <Route path="information" element={<HRInformation />} />
              <Route path="demo" element={<HRDemo />} />
            </Route>
          </Route>

          {/* Blank Layout cho Auth */}
          <Route path="/loginwithlove" element={<Login />} />
          {/* <Route path="/register" element={<LoginPage />} /> */}
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
