import React, { useState } from "react";
import {
  Button,
  Input,
  Upload,
  message,
  Form,
  Progress,
  type UploadProps,
} from "antd";
import {
  UserOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  UploadOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  IdcardOutlined,
  BankOutlined,
  CalendarOutlined,
  TeamOutlined,
  RiseOutlined,
  SafetyCertificateOutlined,
  CrownOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { useNavigate } from "react-router-dom";

// ─── Interfaces ────────────────────────────────────────────────────────────────
interface PersonalInfo {
  dob: string;
  gender: string;
  email: string;
  phone: string;
  address: string;
  avatarUrl: string;
}

interface WorkInfo {
  employeeId: string;
  department: string;
  position: string;
  joinDate: string;
  manager: string;
  status: "Active" | "On Leave" | "Resigned";
}

interface HRMetrics {
  salaryLevel: string;
  satisfactionScore: number;
  projectsCount: number;
  yearsAtCompany: number;
  distanceFromHome: number;
  churnRisk: "Low" | "Medium" | "High";
}

// ─── Mock work / metrics data (replace with API later) ─────────────────────────
const MOCK_BY_ROLE: Record<
  string,
  {
    personal: Omit<PersonalInfo, "avatarUrl">;
    work: WorkInfo;
    metrics: HRMetrics;
  }
> = {
  administrator: {
    personal: {
      dob: "12/05/1988",
      gender: "Nam",
      email: "minh.admin@masan.com",
      phone: "0912000001",
      address: "Quận 3, TP. Hồ Chí Minh",
    },
    work: {
      employeeId: "MSN-2018-001",
      department: "Quản lý & Điều hành (C-Suite)",
      position: "HR Administrator",
      joinDate: "01/01/2018",
      manager: "Ban Giám Đốc",
      status: "Active",
    },
    metrics: {
      salaryLevel: "Director (80M+)",
      satisfactionScore: 92,
      projectsCount: 12,
      yearsAtCompany: 6,
      distanceFromHome: 5.2,
      churnRisk: "Low",
    },
  },
  user: {
    personal: {
      dob: "15/08/1995",
      gender: "Nam",
      email: "tin.employee@masan.com",
      phone: "0901234567",
      address: "Quận 1, TP. Hồ Chí Minh",
    },
    work: {
      employeeId: "MSN-2021-084",
      department: "Công Nghệ Thông Tin (IT)",
      position: "Frontend Developer",
      joinDate: "01/03/2021",
      manager: "Lê Văn Minh",
      status: "Active",
    },
    metrics: {
      salaryLevel: "Senior (25M - 35M)",
      satisfactionScore: 85,
      projectsCount: 4,
      yearsAtCompany: 3.2,
      distanceFromHome: 8.5,
      churnRisk: "Low",
    },
  },
};

// ─── Helpers ───────────────────────────────────────────────────────────────────
const statusConfig: Record<
  WorkInfo["status"],
  { color: string; bg: string; label: string }
> = {
  Active: {
    color: "text-emerald-700",
    bg: "bg-emerald-50 border-emerald-200",
    label: "Đang làm việc",
  },
  "On Leave": {
    color: "text-amber-700",
    bg: "bg-amber-50   border-amber-200",
    label: "Tạm nghỉ",
  },
  Resigned: {
    color: "text-gray-500",
    bg: "bg-gray-100   border-gray-200",
    label: "Đã nghỉ việc",
  },
};

const churnConfig: Record<
  HRMetrics["churnRisk"],
  { color: string; bg: string; bar: string; label: string }
> = {
  Low: {
    color: "text-emerald-700",
    bg: "bg-emerald-50 border-emerald-200",
    bar: "#10b981",
    label: "Thấp",
  },
  Medium: {
    color: "text-amber-700",
    bg: "bg-amber-50   border-amber-200",
    bar: "#f59e0b",
    label: "Trung bình",
  },
  High: {
    color: "text-red-700",
    bg: "bg-red-50     border-red-200",
    bar: "#ef4444",
    label: "Cao",
  },
};

const roleLabel: Record<string, string> = {
  administrator: "HR Administrator",
  user: "Nhân viên",
};

// ─── InfoRow ───────────────────────────────────────────────────────────────────
const InfoRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
}> = ({ icon, label, value }) => (
  <div className="flex items-center gap-4 py-3.5 border-b border-gray-100 last:border-0">
    <div className="w-9 h-9 rounded-xl bg-[#EBF0F8] flex items-center justify-center text-[#1B2A4A] text-base shrink-0">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-xs text-gray-400 font-medium mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-gray-800 truncate">{value}</p>
    </div>
  </div>
);

// ─── MetricCard ────────────────────────────────────────────────────────────────
const MetricCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  highlight?: boolean;
}> = ({ icon, label, value, sub, highlight }) => (
  <div
    className={`rounded-2xl p-4 border flex flex-col gap-2 ${
      highlight
        ? "bg-[#1B2A4A] border-[#1B2A4A] text-white"
        : "bg-white border-gray-100"
    }`}
  >
    <div
      className={`w-8 h-8 rounded-lg flex items-center justify-center text-base ${
        highlight ? "bg-white/15 text-white" : "bg-[#EBF0F8] text-[#1B2A4A]"
      }`}
    >
      {icon}
    </div>
    <div>
      <p
        className={`text-xs font-medium mb-0.5 ${highlight ? "text-white/60" : "text-gray-400"}`}
      >
        {label}
      </p>
      <p
        className={`text-xl font-bold leading-tight ${highlight ? "text-white" : "text-gray-900"}`}
      >
        {value}
      </p>
      {sub && (
        <p
          className={`text-xs mt-0.5 ${highlight ? "text-white/50" : "text-gray-400"}`}
        >
          {sub}
        </p>
      )}
    </div>
  </div>
);

// ─── Main Component ────────────────────────────────────────────────────────────
const DetailUser: React.FC = () => {
  const navigate = useNavigate();
  const reduxUser = useSelector((state: RootState) => state.auth.user);
  const [form] = Form.useForm();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"personal" | "work" | "analytics">(
    "personal",
  );

  // Redirect if not logged in
  if (!reduxUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Bạn chưa đăng nhập.</p>
          <Button
            type="primary"
            className="bg-[#1B2A4A]! border-none! rounded-full!"
            onClick={() => navigate("/loginwithlove")}
          >
            Đăng nhập
          </Button>
        </div>
      </div>
    );
  }

  const mockKey = reduxUser.role in MOCK_BY_ROLE ? reduxUser.role : "user";
  const { personal: mockPersonal, work, metrics } = MOCK_BY_ROLE[mockKey];

  const [personalData, setPersonalData] = useState<PersonalInfo>({
    ...mockPersonal,
    avatarUrl: "",
  });

  const handleAvatarChange: UploadProps["onChange"] = (info) => {
    if (info.file.originFileObj) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPersonalData((p) => ({
          ...p,
          avatarUrl: e.target?.result as string,
        }));
        message.success("Đã cập nhật ảnh đại diện!");
      };
      reader.readAsDataURL(info.file.originFileObj);
    }
  };

  const startEdit = () => {
    form.setFieldsValue({
      phone: personalData.phone,
      address: personalData.address,
      dob: personalData.dob,
    });
    setIsEditMode(true);
  };

  const cancelEdit = () => {
    form.resetFields();
    setIsEditMode(false);
  };

  const saveEdit = async () => {
    try {
      const values = await form.validateFields();
      setIsSaving(true);
      setTimeout(() => {
        setPersonalData((p) => ({ ...p, ...values }));
        setIsSaving(false);
        setIsEditMode(false);
        message.success("Đã lưu thông tin!");
      }, 800);
    } catch {
      message.error("Vui lòng kiểm tra lại các trường thông tin!");
    }
  };

  const status = statusConfig[work.status];
  const churn = churnConfig[metrics.churnRisk];

  const tabs: { key: typeof activeTab; label: string }[] = [
    { key: "personal", label: "Cá nhân" },
    { key: "work", label: "Công việc" },
    { key: "analytics", label: "HR Analytics" },
  ];

  return (
    <div className="min-h-screen bg-[#F4F6FB] font-sans py-8 px-4">
      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(12px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .fade-up { animation: fadeUp 0.4s ease-out both; }
      `}</style>

      <div className="max-w-5xl mx-auto space-y-5">
        {/* ── Top banner / hero card ─────────────────────────────── */}
        <div className="relative rounded-3xl overflow-hidden shadow-sm fade-up">
          {/* Cover gradient */}
          <div className="h-36 bg-linear-to-r from-[#1B2A4A] via-[#243B5E] to-[#1B2A4A] relative">
            {/* Dot texture */}
            <div
              className="absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage:
                  "radial-gradient(circle, white 1px, transparent 0)",
                backgroundSize: "28px 28px",
              }}
            />
          </div>

          {/* White info bar */}
          <div className="bg-white px-6 pb-5">
            {/* Avatar — chỉ kéo avatar lên, không kéo text */}
            <div className="flex items-end justify-between -mt-12 ">
              <div className="relative shrink-0">
                <div className="w-24 h-24 rounded-2xl border-4 border-white bg-[#EBF0F8] overflow-hidden shadow-lg flex items-center justify-center">
                  {personalData.avatarUrl ? (
                    <img
                      src={personalData.avatarUrl}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl font-bold text-[#1B2A4A]">
                      {reduxUser.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <Upload
                  showUploadList={false}
                  beforeUpload={() => false}
                  onChange={handleAvatarChange}
                  accept="image/*"
                >
                  <button className="absolute -bottom-1 -right-3 w-8 h-8 rounded-lg bg-[#1B2A4A] text-white flex items-center justify-center shadow hover:bg-[#243B5E] transition-colors">
                    <UploadOutlined style={{ fontSize: 14 }} />
                  </button>
                </Upload>
              </div>

              {/* Edit button — góc phải, ngang hàng avatar */}
              <div className="shrink-0">
                {isEditMode ? (
                  <div className="flex gap-2">
                    <Button
                      icon={<CloseOutlined />}
                      onClick={cancelEdit}
                      className="rounded-xl"
                    >
                      Hủy
                    </Button>
                    <Button
                      type="primary"
                      icon={<SaveOutlined />}
                      loading={isSaving}
                      onClick={saveEdit}
                      className="bg-[#1B2A4A]! border-none! rounded-xl! font-semibold!"
                    >
                      Lưu
                    </Button>
                  </div>
                ) : (
                  <Button
                    icon={<EditOutlined />}
                    onClick={startEdit}
                    className="rounded-xl font-medium text-gray-600 hover:text-[#1B2A4A]! hover:border-[#1B2A4A]!"
                  >
                    Chỉnh sửa
                  </Button>
                )}
              </div>
            </div>

            {/* Name + role + badges — hoàn toàn trong vùng trắng */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                  {reduxUser.name}
                </h1>
                {reduxUser.role === "administrator" && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-[#1B2A4A] text-white">
                    <CrownOutlined style={{ fontSize: 10 }} />
                    Admin
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mb-3">
                {work.position} · {work.department}
              </p>
              <div className="flex flex-wrap gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${status.bg} ${status.color}`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {status.label}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-500 border border-gray-200">
                  <IdcardOutlined style={{ fontSize: 11 }} />
                  {work.employeeId}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-500 border border-gray-200">
                  @{reduxUser.userName}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Quick stat strip ───────────────────────────────────── */}
        <div
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 fade-up"
          style={{ animationDelay: "60ms" }}
        >
          {[
            {
              icon: <ClockCircleOutlined />,
              label: "Thâm niên",
              value: `${metrics.yearsAtCompany} năm`,
            },
            {
              icon: <TeamOutlined />,
              label: "Dự án",
              value: `${metrics.projectsCount} dự án`,
            },
            {
              icon: <RiseOutlined />,
              label: "Mức lương",
              value: metrics.salaryLevel.split(" ")[0],
            },
            {
              icon: <SafetyCertificateOutlined />,
              label: "Hài lòng",
              value: `${metrics.satisfactionScore}%`,
            },
          ].map((s, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3.5 flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-[#EBF0F8] text-[#1B2A4A] flex items-center justify-center text-base shrink-0">
                {s.icon}
              </div>
              <div>
                <p className="text-xs text-gray-400">{s.label}</p>
                <p className="text-sm font-bold text-gray-900">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Tab + content ──────────────────────────────────────── */}
        <div
          className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden fade-up"
          style={{ animationDelay: "120ms" }}
        >
          {/* Tab bar */}
          <div className="flex border-b border-gray-100 px-6">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`relative py-4 px-1 mr-7 text-sm font-semibold transition-colors duration-150 ${
                  activeTab === t.key
                    ? "text-[#1B2A4A]"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {t.label}
                {activeTab === t.key && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#1B2A4A]" />
                )}
              </button>
            ))}
          </div>

          {/* ── Personal Tab ── */}
          {activeTab === "personal" && (
            <div className="p-6 fade-up">
              {isEditMode ? (
                <Form
                  form={form}
                  layout="vertical"
                  className="grid grid-cols-1 sm:grid-cols-2 gap-x-6"
                >
                  <Form.Item name="dob" label="Ngày sinh">
                    <Input
                      size="large"
                      placeholder="DD/MM/YYYY"
                      className="rounded-xl"
                    />
                  </Form.Item>
                  <Form.Item name="phone" label="Số điện thoại">
                    <Input size="large" className="rounded-xl" />
                  </Form.Item>
                  <Form.Item
                    name="address"
                    label="Địa chỉ"
                    className="sm:col-span-2"
                  >
                    <Input size="large" className="rounded-xl" />
                  </Form.Item>
                  <div className="sm:col-span-2 bg-[#EBF0F8] rounded-2xl px-4 py-3 text-sm text-[#1B2A4A] font-medium">
                    ℹ️ Email và tên đăng nhập không thể thay đổi.
                  </div>
                </Form>
              ) : (
                <div className="divide-y divide-gray-100">
                  <InfoRow
                    icon={<UserOutlined />}
                    label="Họ và tên"
                    value={reduxUser.name}
                  />
                  <InfoRow
                    icon={<IdcardOutlined />}
                    label="Tên đăng nhập"
                    value={`@${reduxUser.userName}`}
                  />
                  <InfoRow
                    icon={<CrownOutlined />}
                    label="Phân quyền"
                    value={roleLabel[reduxUser.role] ?? reduxUser.role}
                  />
                  <InfoRow
                    icon={<CalendarOutlined />}
                    label="Ngày sinh"
                    value={personalData.dob}
                  />
                  <InfoRow
                    icon={<MailOutlined />}
                    label="Email công ty"
                    value={personalData.email}
                  />
                  <InfoRow
                    icon={<PhoneOutlined />}
                    label="Số điện thoại"
                    value={personalData.phone}
                  />
                  <InfoRow
                    icon={<EnvironmentOutlined />}
                    label="Địa chỉ"
                    value={personalData.address}
                  />
                </div>
              )}
            </div>
          )}

          {/* ── Work Tab ── */}
          {activeTab === "work" && (
            <div className="p-6 fade-up">
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  {
                    icon: <IdcardOutlined />,
                    label: "Mã nhân viên",
                    value: work.employeeId,
                  },
                  {
                    icon: <BankOutlined />,
                    label: "Phòng ban",
                    value: work.department,
                  },
                  {
                    icon: <UserOutlined />,
                    label: "Chức vụ",
                    value: work.position,
                  },
                  {
                    icon: <TeamOutlined />,
                    label: "Quản lý trực tiếp",
                    value: work.manager,
                  },
                  {
                    icon: <CalendarOutlined />,
                    label: "Ngày vào làm",
                    value: work.joinDate,
                  },
                  {
                    icon: <SafetyCertificateOutlined />,
                    label: "Trạng thái",
                    value: status.label,
                    custom: (
                      <span className={`text-sm font-bold ${status.color}`}>
                        {status.label}
                      </span>
                    ),
                  },
                ].map((row, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 bg-gray-50/60"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#EBF0F8] text-[#1B2A4A] flex items-center justify-center text-base shrink-0">
                      {row.icon}
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">
                        {row.label}
                      </p>
                      {row.custom ?? (
                        <p className="text-sm font-semibold text-gray-800">
                          {row.value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Analytics Tab ── */}
          {activeTab === "analytics" && (
            <div className="p-6 fade-up space-y-6">
              {/* Churn risk banner */}
              <div
                className={`rounded-2xl border p-5 flex items-center justify-between gap-4 ${churn.bg}`}
              >
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">
                    Đánh giá rủi ro nghỉ việc (AI Model)
                  </p>
                  <p className={`text-2xl font-bold ${churn.color}`}>
                    {churn.label}
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {metrics.churnRisk === "Low"
                      ? "Nhân viên có xu hướng gắn bó tốt với tổ chức."
                      : metrics.churnRisk === "Medium"
                        ? "Cần theo dõi và có biện pháp giữ chân phù hợp."
                        : "Khuyến nghị can thiệp sớm từ phòng HR."}
                  </p>
                </div>
                <div className="shrink-0 text-5xl">
                  {metrics.churnRisk === "Low"
                    ? "🟢"
                    : metrics.churnRisk === "Medium"
                      ? "🟡"
                      : "🔴"}
                </div>
              </div>

              {/* Satisfaction bar */}
              <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-700">
                      Mức độ hài lòng công việc
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Dựa trên khảo sát định kỳ
                    </p>
                  </div>
                  <span className="text-2xl font-bold text-[#1B2A4A]">
                    {metrics.satisfactionScore}%
                  </span>
                </div>
                <Progress
                  percent={metrics.satisfactionScore}
                  strokeColor={
                    metrics.satisfactionScore >= 80
                      ? "#10b981"
                      : metrics.satisfactionScore >= 60
                        ? "#f59e0b"
                        : "#ef4444"
                  }
                  strokeWidth={10}
                  showInfo={false}
                  className="[&_.ant-progress-inner]:bg-[#EBF0F8] [&_.ant-progress-inner]:rounded-full"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1.5">
                  <span>Thấp</span>
                  <span>Trung bình</span>
                  <span>Cao</span>
                </div>
              </div>

              {/* Metric grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <MetricCard
                  icon={<TeamOutlined />}
                  label="Số dự án"
                  value={metrics.projectsCount}
                  sub="dự án"
                  highlight
                />
                <MetricCard
                  icon={<ClockCircleOutlined />}
                  label="Thâm niên"
                  value={`${metrics.yearsAtCompany}`}
                  sub="năm"
                />
                <MetricCard
                  icon={<EnvironmentOutlined />}
                  label="Khoảng cách"
                  value={`${metrics.distanceFromHome}`}
                  sub="km đi làm"
                />
                <MetricCard
                  icon={<RiseOutlined />}
                  label="Mức lương"
                  value={metrics.salaryLevel.split(" ")[0]}
                  sub={metrics.salaryLevel.split(" ").slice(1).join(" ")}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailUser;
