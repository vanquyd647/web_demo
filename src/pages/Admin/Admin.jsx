import React, { useState, useEffect } from "react";
import { Layout, Menu, Avatar, Typography } from "antd";
import { UserOutlined, LogoutOutlined, DashboardOutlined, UserAddOutlined  } from "@ant-design/icons";
import CalendarTodayTwoToneIcon from '@mui/icons-material/CalendarTodayTwoTone';
import BadgeTwoToneIcon from '@mui/icons-material/BadgeTwoTone';
import PermContactCalendarTwoToneIcon from '@mui/icons-material/PermContactCalendarTwoTone';
import { useAuth } from "../../contexts/AuthContext";
import { useAnnouncement } from "../../contexts/Announcement";
import Announcement from "../../components/Announcement/Announcement";
import DashboardAdmin from "../../components/Dashboard_admin/Dashboard_admin";
import ManageAccount from "../../components/ManageAccount/ManageAccount";
import ManageApply from "../../components/Management_apply/Management_apply";
import ManageEmployee from "../../components/Manage_Employee/Manage_employee";
// import ManageSalaryEmployee from "../../components/Manage_Salary_Employee/ManageSalaryEmployee";
import AccountSetting from "../AccountSetting/AccountSetting";
import ManageWorkEmployee from "../../components/Manage_Work_Employee/Manage_work_employee";

const { Sider, Content } = Layout;
const { Title, Text } = Typography;
// const { SubMenu } = Menu;

function Admin() {
  const [currentPage, setCurrentPage] = useState("Dashboard");
  const { user, logout } = useAuth();
  const [update, setUpdate] = useState(false);
  const { success, warning, error } = useAnnouncement();
  const [collapsed, setCollapsed] = useState(false);  

  useEffect(() => {
    setUpdate(false);
  }, [success, warning, error, update]);

  const handleMenuClick = ({ key }) => {
    if (key === "logout") {
      logout();
    } else if (key === "account") {
      setCurrentPage("Cài đặt tài khoản");
    } else if (key === "Đăng ký làm PT") {
      setCurrentPage("Đăng ký làm PT");
    } else if (key === "Lịch dạy của PT") {
      setCurrentPage("Lịch dạy của PT");
    } else {
      setCurrentPage(key);
    }
  };

//   const userMenuItems = [
//     { key: "account", label: "Cài đặt tài khoản", icon: <UserOutlined /> },
//     { key: "logout", label: "Đăng xuất", icon: <LogoutOutlined /> }
//   ];

//   const menuItems = [
//     { key: "Dashboard", icon: <DashboardOutlined />, label: "Thống kê" },
//     { key: "Đăng ký làm PT", icon: <CalendarTodayTwoToneIcon />, label: "Danh sách đăng ký làm PT" },
//     { key: "Quản lý người dùng", icon: <BadgeTwoToneIcon />, label: "Quản lý người dùng" },
//     { key: "Quản lý nhân viên", icon: <PermContactCalendarTwoToneIcon />, label: "Quản lý nhân viên" },
//     { key: "Lương nhân viên", icon: <MoneyCollectOutlined />, label: "Lương nhân viên" },
//     {
//       key: "account-dropdown",
//       icon: <UserOutlined />,
//       label: "Tài khoản của bạn",
//       children: [
//         { key: "account", icon: <UserOutlined />, label: "Cài đặt tài khoản" },
//         { key: "logout", icon: <LogoutOutlined />, label: "Đăng xuất" }
//       ]
//     }
//   ];

const menuItems = [
    {
      key: "Dashboard", 
      icon: <DashboardOutlined style={{ fontSize: "16px" }} />, 
      label: <span style={{ fontSize: "16px" }}>Thống kê</span>
    },
    {
      key: "Quản lý người dùng", 
      icon: <BadgeTwoToneIcon style={{ fontSize: "16px" }} />, 
      label: <span style={{ fontSize: "16px" }}>Quản lý người dùng</span>
    },
    {
      key: "Quản lý lịch làm việc", 
      icon: <PermContactCalendarTwoToneIcon style={{ fontSize: "16px" }} />, 
      label: <span style={{ fontSize: "16px" }}>Quản lý lịch làm việc</span>
    },
    {
      key: "Quản lý PT",
      icon: <UserAddOutlined style={{ fontSize: "16px" }} />,
      label: <span style={{ fontSize: "16px" }}>Quản lý PT</span>,
      children: [
        {
          key: "Đăng ký làm PT",
          icon: <CalendarTodayTwoToneIcon style={{ fontSize: "16px" }} />,
          label: <span style={{ fontSize: "16px" }}>Danh sách đăng ký</span>
        },
        {
          key: "Lịch dạy của PT",
          icon: <PermContactCalendarTwoToneIcon style={{ fontSize: "16px" }} />,
          label: <span style={{ fontSize: "16px" }}>Lịch dạy của PT</span>
        }
      ]
    },
    // {
    //   key: "Lương nhân viên", 
    //   icon: <MoneyCollectOutlined style={{ fontSize: "16px" }} />, 
    //   label: <span style={{ fontSize: "16px" }}>Lương nhân viên</span>
    // },
    {
      key: "account-dropdown",
      icon: <UserOutlined style={{ fontSize: "16px" }} />,
      label: <span style={{ fontSize: "16px" }}>Tài khoản của bạn</span>,
      children: [
        { key: "account", icon: <UserOutlined style={{ fontSize: "16px" }} />, label: "Cài đặt tài khoản" },
        { key: "logout", icon: <LogoutOutlined style={{ fontSize: "16px" }} />, label: "Đăng xuất" }
      ]
    }
  ];
  

  return (
    <Layout style={{ height: "100vh" }}>
      <Sider 
        theme="dark" 
        collapsible 
        collapsed={collapsed} 
        onCollapse={(value) => setCollapsed(value)} 
        width={270} 
        collapsedWidth={80}  
      >
        <div style={{ textAlign: "center", padding: "20px 0", transition: "all 0.3s" }}>
          <Avatar 
            size={collapsed ? 40 : 80}  
            src={user.avt} 
            style={{
              border: "2px solid #0cb90c",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)"
            }} 
          />
          {!collapsed && (
            <>
              <Title level={4} style={{ color: "white", marginTop: 10 }}>
                {user.HoTen}
              </Title>
              <Text style={{ color: "#0cb90c" }}>
                ● {user.TrangThai}
              </Text>
            </>
          )}
        </div>
        <Menu 
          theme="dark" 
          mode="inline" 
          defaultSelectedKeys={["Dashboard"]} 
          onClick={handleMenuClick}
          items={menuItems}  
        />
      </Sider>
      <Layout>
        <Content style={{ padding: "20px", background: "#f0f2f5", overflowY: "auto" }}>
          {currentPage === "Dashboard" && (
            <div style={{ fontSize: "17px", float: "right",marginRight:"5px" }}>
              Xin chào, {user?.TenVaiTro} {user?.HoTen}
            </div>
          )}
          <Title level={2} style={{ marginBottom: "20px", fontSize: "24px" }}>
            {currentPage}
          </Title>
          {error || success || warning ? <Announcement /> : null}
          {currentPage === "Dashboard" && <DashboardAdmin />}
          {currentPage === "Quản lý người dùng" && <ManageAccount />}
          {currentPage === "Đăng ký làm PT" && <ManageApply />}
          {currentPage === "Quản lý lịch làm việc" && <ManageEmployee />}
          {currentPage === "Lịch dạy của PT" && <ManageWorkEmployee />}
          {/* {currentPage === "Lương nhân viên" && <ManageSalaryEmployee />} */}
          {currentPage === "Cài đặt tài khoản" && (
            <AccountSetting changeForm={true} setRefresh={setUpdate} />
          )}
        </Content>
      </Layout>
    </Layout>
  );
}

export default Admin;
