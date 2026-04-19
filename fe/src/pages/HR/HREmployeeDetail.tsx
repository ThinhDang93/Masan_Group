import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Form,
  Input,
  Select,
  Button,
  Typography,
  Row,
  Col,
  Card,
  Tag,
  message,
  Breadcrumb,
} from "antd";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";

const { Title } = Typography;

interface Employee {
  key: string;
  Employee_ID: number;
  BU: string;
  SubBU: string;
  Function: string;
  SubGroup: string;
  Types: string;
  Gender: string;
  Category: string;
  Department: string;
  Birthday: string;
  Joining_date: string;
  Resigned_date: string;
  Location: string;
  Resignation_Type: string;
  Resignation_Reason: string;
  Position_EN: string;
  Approval_level: string;
  Job_Level: string;
  Province: string;
  Status: string;
}

const BU_OPTIONS = [
  "Masan MEATLife",
  "WinCommerce",
  "Phuc Long Heritage",
  "Masan High-Tech Materials",
  "Masan Group (Corporate)",
];

const HREmployeeDetail: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const employee = location.state as Employee | undefined;

  if (!employee) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[50vh]">
        <Title level={4} type="secondary">
          Không tìm thấy dữ liệu nhân viên #{id}
        </Title>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/hr/information")}
          className="mt-4"
        >
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  const handleFinish = (values: Partial<Employee>) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success({
        content: `Cập nhật thông tin nhân viên #${employee.Employee_ID} thành công!`,
        duration: 3,
      });
      // Update local state so form reflects new values
      form.setFieldsValue(values);
    }, 800);
  };

  const initialValues: Partial<Employee> = {
    BU: employee.BU,
    SubBU: employee.SubBU,
    Function: employee.Function,
    SubGroup: employee.SubGroup,
    Types: employee.Types,
    Gender: employee.Gender,
    Category: employee.Category,
    Department: employee.Department,
    Birthday: employee.Birthday,
    Joining_date: employee.Joining_date,
    Resigned_date: employee.Resigned_date,
    Location: employee.Location,
    Resignation_Type: employee.Resignation_Type,
    Resignation_Reason: employee.Resignation_Reason,
    Position_EN: employee.Position_EN,
    Approval_level: employee.Approval_level,
    Job_Level: employee.Job_Level,
    Province: employee.Province,
    Status: employee.Status,
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <Breadcrumb
        className="mb-4"
        items={[
          { title: <a onClick={() => navigate("/hr/information")}>Danh sách nhân viên</a> },
          { title: `Nhân viên #${employee.Employee_ID}` },
        ]}
      />

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/hr/information")}
        >
          Quay lại
        </Button>
        <div>
          <Title level={3} style={{ color: "#DA251D", margin: 0 }}>
            Cập nhật nhân viên #{employee.Employee_ID}
          </Title>
          <span className="text-gray-500 text-sm">{employee.Position_EN}</span>
        </div>
        <Tag
          color={employee.Status === "Active" ? "green" : "default"}
          className="ml-auto text-sm px-3 py-1"
        >
          {employee.Status}
        </Tag>
      </div>

      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={handleFinish}
        requiredMark={false}
      >
        {/* Thông tin định danh */}
        <Card
          title="Thông tin định danh"
          className="mb-4"
          styles={{ header: { color: "#DA251D", fontWeight: 600 } }}
        >
          <Row gutter={[16, 0]}>
            <Col xs={24} sm={8}>
              <Form.Item label="Employee ID">
                <Input value={employee.Employee_ID} disabled />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item name="Gender" label="Giới tính">
                <Select
                  options={[
                    { label: "Male", value: "Male" },
                    { label: "Female", value: "Female" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item name="Category" label="Phân loại">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item name="Birthday" label="Ngày sinh">
                <Input placeholder="dd/mm/yyyy" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item name="Province" label="Tỉnh / Thành phố">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item name="Location" label="Địa điểm làm việc">
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Thông tin tổ chức */}
        <Card
          title="Thông tin tổ chức"
          className="mb-4"
          styles={{ header: { color: "#DA251D", fontWeight: 600 } }}
        >
          <Row gutter={[16, 0]}>
            <Col xs={24} sm={8}>
              <Form.Item name="BU" label="Business Unit">
                <Select
                  options={BU_OPTIONS.map((b) => ({ label: b, value: b }))}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item name="SubBU" label="Sub-BU">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item name="Department" label="Phòng ban">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item name="Function" label="Function">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item name="SubGroup" label="Sub-Group">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item name="Types" label="Loại hợp đồng">
                <Select
                  options={[
                    { label: "Full-time", value: "Full-time" },
                    { label: "Contractor", value: "Contractor" },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Thông tin chức vụ */}
        <Card
          title="Chức vụ & Cấp bậc"
          className="mb-4"
          styles={{ header: { color: "#DA251D", fontWeight: 600 } }}
        >
          <Row gutter={[16, 0]}>
            <Col xs={24} sm={8}>
              <Form.Item name="Position_EN" label="Vị trí (EN)">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item name="Job_Level" label="Job Level">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item name="Approval_level" label="Approval Level">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item name="Joining_date" label="Ngày vào làm">
                <Input placeholder="dd/mm/yyyy" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item name="Status" label="Trạng thái">
                <Select
                  options={[
                    { label: "Active", value: "Active" },
                    { label: "Resigned", value: "Resigned" },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Thông tin nghỉ việc */}
        <Card
          title="Thông tin nghỉ việc"
          className="mb-6"
          styles={{ header: { color: "#DA251D", fontWeight: 600 } }}
        >
          <Row gutter={[16, 0]}>
            <Col xs={24} sm={8}>
              <Form.Item name="Resigned_date" label="Ngày nghỉ việc">
                <Input placeholder="dd/mm/yyyy" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item name="Resignation_Type" label="Loại nghỉ việc">
                <Select
                  allowClear
                  options={[
                    { label: "Voluntary", value: "Voluntary" },
                    { label: "Involuntary", value: "Involuntary" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item name="Resignation_Reason" label="Lý do nghỉ việc">
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Button onClick={() => navigate("/hr/information")}>Huỷ</Button>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            loading={loading}
            style={{ background: "#DA251D", borderColor: "#DA251D" }}
          >
            Lưu thay đổi
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default HREmployeeDetail;
