import React, { useState, useMemo } from "react";
import {
  Table,
  Input,
  Select,
  Tag,
  Space,
  Typography,
  Row,
  Col,
  Button,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { SearchOutlined, EditOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

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

const RAW_DATA: Employee[] = [
  {
    key: "1",
    Employee_ID: 136355,
    BU: "Masan MEATLife",
    SubBU: "Food Safety",
    Function: "Production",
    SubGroup: "Production Worker",
    Types: "Full-time",
    Gender: "Male",
    Category: "Local",
    Department: "Manufacturing",
    Birthday: "23/04/2002",
    Joining_date: "27/04/2025",
    Resigned_date: "15/10/2024",
    Location: "Binh Duong",
    Resignation_Type: "Voluntary",
    Resignation_Reason: "Low Compensation",
    Position_EN: "L10 - Frontliner",
    Approval_level: "MANAGER009",
    Job_Level: "Worker",
    Province: "Hai Phong",
    Status: "Resigned",
  },
  {
    key: "2",
    Employee_ID: 172644,
    BU: "WinCommerce",
    SubBU: "Store Management",
    Function: "Operations Support",
    SubGroup: "Support Staff",
    Types: "Full-time",
    Gender: "Male",
    Category: "Local",
    Department: "EHS",
    Birthday: "16/04/1997",
    Joining_date: "21/06/2024",
    Resigned_date: "20/06/2025",
    Location: "Dong Nai",
    Resignation_Type: "Voluntary",
    Resignation_Reason: "Personal/Family Reasons",
    Position_EN: "L9 - Staff",
    Approval_level: "MANAGER068",
    Job_Level: "Staff",
    Province: "Thai Binh",
    Status: "Resigned",
  },
  {
    key: "3",
    Employee_ID: 133009,
    BU: "Phuc Long Heritage",
    SubBU: "Customer Engagement",
    Function: "Agriculture",
    SubGroup: "Production Worker",
    Types: "Contractor",
    Gender: "Male",
    Category: "Local",
    Department: "Farm Management",
    Birthday: "08/03/2007",
    Joining_date: "15/10/2025",
    Resigned_date: "",
    Location: "Binh Duong",
    Resignation_Type: "",
    Resignation_Reason: "",
    Position_EN: "L8 - Executive",
    Approval_level: "MANAGER055",
    Job_Level: "Executive",
    Province: "Vinh Phuc",
    Status: "Active",
  },
  {
    key: "4",
    Employee_ID: 149252,
    BU: "WinCommerce",
    SubBU: "Digital Marketing",
    Function: "Production",
    SubGroup: "Production Worker",
    Types: "Full-time",
    Gender: "Female",
    Category: "Local",
    Department: "Meat Production",
    Birthday: "20/11/2004",
    Joining_date: "26/11/2022",
    Resigned_date: "28/12/2022",
    Location: "Binh Duong",
    Resignation_Type: "Voluntary",
    Resignation_Reason: "Heavy Workload/Shift Work",
    Position_EN: "L10 - Frontliner",
    Approval_level: "MANAGER050",
    Job_Level: "Worker",
    Province: "Quang Ninh",
    Status: "Resigned",
  },
  {
    key: "5",
    Employee_ID: 159098,
    BU: "WinCommerce",
    SubBU: "Promotion Management",
    Function: "Commercial",
    SubGroup: "Production Worker",
    Types: "Full-time",
    Gender: "Male",
    Category: "Local",
    Department: "Meat Trading",
    Birthday: "13/11/1997",
    Joining_date: "26/02/2021",
    Resigned_date: "15/10/2024",
    Location: "Binh Duong",
    Resignation_Type: "Voluntary",
    Resignation_Reason: "Heavy Workload/Shift Work",
    Position_EN: "L8 - Executive",
    Approval_level: "MANAGER005",
    Job_Level: "Executive",
    Province: "Quang Ninh",
    Status: "Resigned",
  },
  {
    key: "6",
    Employee_ID: 166729,
    BU: "Masan High-Tech Materials",
    SubBU: "Refining",
    Function: "Commercial",
    SubGroup: "Production Worker",
    Types: "Contractor",
    Gender: "Female",
    Category: "Local",
    Department: "Meat Trading",
    Birthday: "08/03/1997",
    Joining_date: "17/12/2024",
    Resigned_date: "01/10/2026",
    Location: "Ha Noi",
    Resignation_Type: "Involuntary",
    Resignation_Reason: "Policy Violation",
    Position_EN: "L8 - Executive",
    Approval_level: "MANAGER035",
    Job_Level: "Executive",
    Province: "Quang Ninh",
    Status: "Resigned",
  },
  {
    key: "7",
    Employee_ID: 105513,
    BU: "WinCommerce",
    SubBU: "Store Management",
    Function: "Production",
    SubGroup: "Production Worker",
    Types: "Full-time",
    Gender: "Female",
    Category: "Local",
    Department: "Meat Production",
    Birthday: "23/08/2006",
    Joining_date: "19/11/2024",
    Resigned_date: "03/11/2025",
    Location: "Ha Noi",
    Resignation_Type: "Voluntary",
    Resignation_Reason: "Heavy Workload/Shift Work",
    Position_EN: "L8 - Executive",
    Approval_level: "MANAGER081",
    Job_Level: "Executive",
    Province: "Ha Noi",
    Status: "Resigned",
  },
  {
    key: "8",
    Employee_ID: 154235,
    BU: "Phuc Long Heritage",
    SubBU: "Store Operations",
    Function: "Mining",
    SubGroup: "Production Worker",
    Types: "Contractor",
    Gender: "Female",
    Category: "Local",
    Department: "Mining Operations",
    Birthday: "21/06/2001",
    Joining_date: "12/05/2023",
    Resigned_date: "17/04/2024",
    Location: "Ha Noi",
    Resignation_Type: "Voluntary",
    Resignation_Reason: "Low Compensation",
    Position_EN: "L10 - Frontliner",
    Approval_level: "MANAGER063",
    Job_Level: "Worker",
    Province: "Vinh Phuc",
    Status: "Resigned",
  },
  {
    key: "9",
    Employee_ID: 188557,
    BU: "Masan High-Tech Materials",
    SubBU: "Safety Compliance",
    Function: "Support Function",
    SubGroup: "Staff",
    Types: "Full-time",
    Gender: "Male",
    Category: "Local",
    Department: "HR",
    Birthday: "06/11/1998",
    Joining_date: "19/07/2020",
    Resigned_date: "15/10/2024",
    Location: "Ho Chi Minh",
    Resignation_Type: "Voluntary",
    Resignation_Reason: "Personal/Family Reasons",
    Position_EN: "L10 - Frontliner",
    Approval_level: "MANAGER073",
    Job_Level: "Worker",
    Province: "Bac Ninh",
    Status: "Resigned",
  },
  {
    key: "10",
    Employee_ID: 170599,
    BU: "Masan MEATLife",
    SubBU: "Distribution",
    Function: "Mining",
    SubGroup: "Production Worker",
    Types: "Full-time",
    Gender: "Male",
    Category: "Local",
    Department: "Mining Operations",
    Birthday: "14/01/1996",
    Joining_date: "08/11/2022",
    Resigned_date: "20/06/2023",
    Location: "Long An",
    Resignation_Type: "Involuntary",
    Resignation_Reason: "Poor Performance",
    Position_EN: "L7 - Senior Executive",
    Approval_level: "MANAGER061",
    Job_Level: "Senior Specialist",
    Province: "Long An",
    Status: "Resigned",
  },
  {
    key: "11",
    Employee_ID: 117886,
    BU: "Masan Group (Corporate)",
    SubBU: "Compliance",
    Function: "Production",
    SubGroup: "Production Worker",
    Types: "Full-time",
    Gender: "Male",
    Category: "Local",
    Department: "Manufacturing",
    Birthday: "22/08/1999",
    Joining_date: "16/01/2022",
    Resigned_date: "",
    Location: "Dong Nai",
    Resignation_Type: "",
    Resignation_Reason: "",
    Position_EN: "L8 - Executive",
    Approval_level: "MANAGER093",
    Job_Level: "Executive",
    Province: "Can Tho",
    Status: "Active",
  },
  {
    key: "12",
    Employee_ID: 163637,
    BU: "Masan Group (Corporate)",
    SubBU: "Accounting",
    Function: "Commercial",
    SubGroup: "Production Worker",
    Types: "Full-time",
    Gender: "Female",
    Category: "Local",
    Department: "Meat Trading",
    Birthday: "24/05/2007",
    Joining_date: "04/08/2025",
    Resigned_date: "28/01/2026",
    Location: "Long An",
    Resignation_Type: "Voluntary",
    Resignation_Reason: "Better Opportunity",
    Position_EN: "L10 - Frontliner",
    Approval_level: "MANAGER073",
    Job_Level: "Worker",
    Province: "Ho Chi Minh",
    Status: "Resigned",
  },
  {
    key: "13",
    Employee_ID: 167946,
    BU: "Masan MEATLife",
    SubBU: "Meat Processing",
    Function: "Mining",
    SubGroup: "Production Worker",
    Types: "Full-time",
    Gender: "Male",
    Category: "Local",
    Department: "Mining Operations",
    Birthday: "13/02/2006",
    Joining_date: "10/02/2024",
    Resigned_date: "18/04/2024",
    Location: "Long An",
    Resignation_Type: "Voluntary",
    Resignation_Reason: "Personal/Family Reasons",
    Position_EN: "L8 - Executive",
    Approval_level: "MANAGER093",
    Job_Level: "Executive",
    Province: "Nam Dinh",
    Status: "Resigned",
  },
  {
    key: "14",
    Employee_ID: 169082,
    BU: "Phuc Long Heritage",
    SubBU: "Product Innovation",
    Function: "Retail Operations",
    SubGroup: "Production Worker",
    Types: "Full-time",
    Gender: "Male",
    Category: "Local",
    Department: "Store Operations",
    Birthday: "21/10/2001",
    Joining_date: "24/03/2025",
    Resigned_date: "",
    Location: "Ho Chi Minh",
    Resignation_Type: "",
    Resignation_Reason: "",
    Position_EN: "L9 - Staff",
    Approval_level: "MANAGER019",
    Job_Level: "Staff",
    Province: "Ho Chi Minh",
    Status: "Active",
  },
  {
    key: "15",
    Employee_ID: 155057,
    BU: "Masan Group (Corporate)",
    SubBU: "Accounting",
    Function: "Commercial",
    SubGroup: "Production Worker",
    Types: "Full-time",
    Gender: "Female",
    Category: "Local",
    Department: "Meat Trading",
    Birthday: "24/08/1995",
    Joining_date: "02/02/2023",
    Resigned_date: "",
    Location: "Dong Nai",
    Resignation_Type: "",
    Resignation_Reason: "",
    Position_EN: "L6 - Supervisor",
    Approval_level: "MANAGER050",
    Job_Level: "Supervisor",
    Province: "Binh Duong",
    Status: "Active",
  },
  {
    key: "16",
    Employee_ID: 184437,
    BU: "Masan Group (Corporate)",
    SubBU: "FP&A",
    Function: "Mining",
    SubGroup: "Production Worker",
    Types: "Full-time",
    Gender: "Female",
    Category: "Local",
    Department: "Mining Operations",
    Birthday: "15/09/2000",
    Joining_date: "26/06/2025",
    Resigned_date: "15/10/2024",
    Location: "Binh Duong",
    Resignation_Type: "Voluntary",
    Resignation_Reason: "Better Opportunity",
    Position_EN: "L6 - Supervisor",
    Approval_level: "MANAGER059",
    Job_Level: "Supervisor",
    Province: "Hai Duong",
    Status: "Resigned",
  },
  {
    key: "17",
    Employee_ID: 149587,
    BU: "WinCommerce",
    SubBU: "Fresh Food Merchandising",
    Function: "Production",
    SubGroup: "Production Worker",
    Types: "Full-time",
    Gender: "Male",
    Category: "Local",
    Department: "Meat Production",
    Birthday: "22/01/1991",
    Joining_date: "05/06/2025",
    Resigned_date: "",
    Location: "Dong Nai",
    Resignation_Type: "",
    Resignation_Reason: "",
    Position_EN: "L7 - Senior Executive",
    Approval_level: "MANAGER069",
    Job_Level: "Senior Specialist",
    Province: "Binh Duong",
    Status: "Active",
  },
  {
    key: "18",
    Employee_ID: 142829,
    BU: "Masan MEATLife",
    SubBU: "Meat Processing",
    Function: "Agriculture",
    SubGroup: "Production Worker",
    Types: "Full-time",
    Gender: "Female",
    Category: "Local",
    Department: "Farm Management",
    Birthday: "27/05/2005",
    Joining_date: "06/07/2023",
    Resigned_date: "",
    Location: "Ha Noi",
    Resignation_Type: "",
    Resignation_Reason: "",
    Position_EN: "L10 - Frontliner",
    Approval_level: "MANAGER079",
    Job_Level: "Worker",
    Province: "Ha Noi",
    Status: "Active",
  },
  {
    key: "19",
    Employee_ID: 147975,
    BU: "WinCommerce",
    SubBU: "Promotion Management",
    Function: "Production",
    SubGroup: "Production Worker",
    Types: "Contractor",
    Gender: "Male",
    Category: "Local",
    Department: "Meat Production",
    Birthday: "16/04/1992",
    Joining_date: "14/01/2022",
    Resigned_date: "15/10/2024",
    Location: "Binh Duong",
    Resignation_Type: "Involuntary",
    Resignation_Reason: "Policy Violation",
    Position_EN: "L6 - Supervisor",
    Approval_level: "MANAGER004",
    Job_Level: "Supervisor",
    Province: "Quang Ninh",
    Status: "Resigned",
  },
  {
    key: "20",
    Employee_ID: 158835,
    BU: "Phuc Long Heritage",
    SubBU: "Brand Marketing",
    Function: "Mining",
    SubGroup: "Production Worker",
    Types: "Contractor",
    Gender: "Male",
    Category: "Local",
    Department: "Mining Operations",
    Birthday: "06/12/1998",
    Joining_date: "19/03/2023",
    Resigned_date: "06/11/2023",
    Location: "Binh Duong",
    Resignation_Type: "Voluntary",
    Resignation_Reason: "Low Compensation",
    Position_EN: "L9 - Staff",
    Approval_level: "MANAGER011",
    Job_Level: "Staff",
    Province: "Quang Ninh",
    Status: "Resigned",
  },
];

const BU_OPTIONS = [...new Set(RAW_DATA.map((e) => e.BU))];
const STATUS_OPTIONS = ["Active", "Resigned"];
const GENDER_OPTIONS = ["Male", "Female"];
const TYPES_OPTIONS = ["Full-time", "Contractor"];

const HRInformation: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filterBU, setFilterBU] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterGender, setFilterGender] = useState<string | null>(null);
  const [filterTypes, setFilterTypes] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return RAW_DATA.filter((e) => {
      if (
        q &&
        ![
          String(e.Employee_ID),
          e.BU,
          e.SubBU,
          e.Department,
          e.Position_EN,
          e.Province,
          e.Location,
          e.Job_Level,
        ]
          .join(" ")
          .toLowerCase()
          .includes(q)
      )
        return false;
      if (filterBU && e.BU !== filterBU) return false;
      if (filterStatus && e.Status !== filterStatus) return false;
      if (filterGender && e.Gender !== filterGender) return false;
      if (filterTypes && e.Types !== filterTypes) return false;
      return true;
    });
  }, [search, filterBU, filterStatus, filterGender, filterTypes]);

  const columns: ColumnsType<Employee> = [
    {
      title: "Employee ID",
      dataIndex: "Employee_ID",
      key: "Employee_ID",
      fixed: "left",
      width: 120,
      sorter: (a, b) => a.Employee_ID - b.Employee_ID,
    },
    {
      title: "BU",
      dataIndex: "BU",
      key: "BU",
      width: 200,
      sorter: (a, b) => a.BU.localeCompare(b.BU),
    },
    {
      title: "Sub-BU",
      dataIndex: "SubBU",
      key: "SubBU",
      width: 200,
    },
    {
      title: "Function",
      dataIndex: "Function",
      key: "Function",
      width: 150,
    },
    {
      title: "Sub-Group",
      dataIndex: "SubGroup",
      key: "SubGroup",
      width: 160,
    },
    {
      title: "Types",
      dataIndex: "Types",
      key: "Types",
      width: 120,
      render: (val: string) => (
        <Tag color={val === "Full-time" ? "blue" : "orange"}>{val}</Tag>
      ),
    },
    {
      title: "Gender",
      dataIndex: "Gender",
      key: "Gender",
      width: 100,
      render: (val: string) => (
        <Tag color={val === "Male" ? "geekblue" : "magenta"}>{val}</Tag>
      ),
    },
    {
      title: "Category",
      dataIndex: "Category",
      key: "Category",
      width: 110,
    },
    {
      title: "Department",
      dataIndex: "Department",
      key: "Department",
      width: 160,
    },
    {
      title: "Birthday",
      dataIndex: "Birthday",
      key: "Birthday",
      width: 120,
    },
    {
      title: "Joining Date",
      dataIndex: "Joining_date",
      key: "Joining_date",
      width: 130,
    },
    {
      title: "Resigned Date",
      dataIndex: "Resigned_date",
      key: "Resigned_date",
      width: 130,
      render: (val: string) => val || <span className="text-gray-400">—</span>,
    },
    {
      title: "Location",
      dataIndex: "Location",
      key: "Location",
      width: 130,
    },
    {
      title: "Resignation Type",
      dataIndex: "Resignation_Type",
      key: "Resignation_Type",
      width: 150,
      render: (val: string) =>
        val ? (
          <Tag color={val === "Voluntary" ? "gold" : "red"}>{val}</Tag>
        ) : (
          <span className="text-gray-400">—</span>
        ),
    },
    {
      title: "Resignation Reason",
      dataIndex: "Resignation_Reason",
      key: "Resignation_Reason",
      width: 210,
      render: (val: string) => val || <span className="text-gray-400">—</span>,
    },
    {
      title: "Position (EN)",
      dataIndex: "Position_EN",
      key: "Position_EN",
      width: 180,
    },
    {
      title: "Approval Level",
      dataIndex: "Approval_level",
      key: "Approval_level",
      width: 140,
    },
    {
      title: "Job Level",
      dataIndex: "Job_Level",
      key: "Job_Level",
      width: 150,
    },
    {
      title: "Province",
      dataIndex: "Province",
      key: "Province",
      width: 130,
    },
    {
      title: "Status",
      dataIndex: "Status",
      key: "Status",
      fixed: "right",
      width: 110,
      render: (val: string) => (
        <Tag color={val === "Active" ? "green" : "default"}>{val}</Tag>
      ),
      sorter: (a, b) => a.Status.localeCompare(b.Status),
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: 110,
      render: (_: unknown, record: Employee) => (
        <Button
          type="primary"
          size="small"
          icon={<EditOutlined />}
          style={{
            background: "#FFD700",
            borderColor: "#FFFF00",
            color: "black",
            padding: 5,
          }}
          onClick={() =>
            navigate(`/hr/information/${record.Employee_ID}`, { state: record })
          }
        >
          Update
        </Button>
      ),
    },
  ];

  const handleReset = () => {
    setSearch("");
    setFilterBU(null);
    setFilterStatus(null);
    setFilterGender(null);
    setFilterTypes(null);
  };

  return (
    <div className="p-6">
      <Title level={3} style={{ color: "#DA251D", marginBottom: 24 }}>
        Danh Sách Nhân Viên
      </Title>

      {/* Search & Filter Bar */}
      <div
        className="mb-4 p-4 rounded-lg"
        style={{ background: "#fafafa", border: "1px solid #f0f0f0" }}
      >
        <Row gutter={[12, 12]} align="middle">
          <Col xs={24} sm={24} md={6}>
            <Input
              placeholder="Tìm theo ID, BU, phòng ban, tỉnh thành..."
              prefix={<SearchOutlined style={{ color: "#DA251D" }} />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              placeholder="Lọc BU"
              value={filterBU}
              onChange={setFilterBU}
              allowClear
              style={{ width: "100%" }}
              options={BU_OPTIONS.map((bu) => ({ label: bu, value: bu }))}
            />
          </Col>
          <Col xs={12} sm={6} md={3}>
            <Select
              placeholder="Trạng thái"
              value={filterStatus}
              onChange={setFilterStatus}
              allowClear
              style={{ width: "100%" }}
              options={STATUS_OPTIONS.map((s) => ({ label: s, value: s }))}
            />
          </Col>
          <Col xs={12} sm={6} md={3}>
            <Select
              placeholder="Giới tính"
              value={filterGender}
              onChange={setFilterGender}
              allowClear
              style={{ width: "100%" }}
              options={GENDER_OPTIONS.map((g) => ({ label: g, value: g }))}
            />
          </Col>
          <Col xs={12} sm={6} md={3}>
            <Select
              placeholder="Loại HĐ"
              value={filterTypes}
              onChange={setFilterTypes}
              allowClear
              style={{ width: "100%" }}
              options={TYPES_OPTIONS.map((t) => ({ label: t, value: t }))}
            />
          </Col>
          <Col xs={24} sm={6} md={2}>
            <Space>
              <span
                className="cursor-pointer text-sm"
                style={{ color: "#DA251D" }}
                onClick={handleReset}
              >
                Xoá bộ lọc
              </span>
            </Space>
          </Col>
          <Col xs={24} sm={24} md={3} className="text-right">
            <span className="text-gray-500 text-sm">
              {filtered.length} nhân viên
            </span>
          </Col>
        </Row>
      </div>

      {/* Table */}
      <Table<Employee>
        columns={columns}
        dataSource={filtered}
        scroll={{ x: 2800 }}
        pagination={{
          pageSize: 10,
          showSizeChanger: false,
          showTotal: (total, range) =>
            `${range[0]}–${range[1]} / ${total} nhân viên`,
          style: { marginTop: 16 },
        }}
        size="middle"
        bordered
        rowClassName={(_, index) =>
          index % 2 === 0 ? "bg-white" : "bg-gray-50"
        }
      />
    </div>
  );
};

export default HRInformation;
