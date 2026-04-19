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
import HREmployeeDetail from "./pages/HR/HREmployeeDetail";
import HRDemo from "./pages/HR/HRDemo";
import PrivateRoute from "./components/PrivateRoute";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* Main Layout */}
          <Route path="/" element={<HomeTemplate />}>
            <Route index element={<HomePage />} />
            <Route path="/userDetail" element={<DetailUser />}></Route>
            {/* HR Routes — requires administrator role */}
            <Route path="hr">
              <Route path="dashboard" element={<PrivateRoute><HRDashboard /></PrivateRoute>} />
              <Route path="information" element={<PrivateRoute><HRInformation /></PrivateRoute>} />
              <Route path="information/:id" element={<PrivateRoute><HREmployeeDetail /></PrivateRoute>} />
              <Route path="demo" element={<PrivateRoute><HRDemo /></PrivateRoute>} />
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
