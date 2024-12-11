import React, { useEffect, useState } from "react";
import { Layout, Menu, Avatar, Typography } from "antd";
import { faDumbbell, faList, faFolderOpen, faAddressCard, faClipboard, faUserGear, faGears, faArrowRightFromBracket,faCalendar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "../../contexts/AuthContext";
import { useAnnouncement } from "../../contexts/Announcement";
import Announcement from "../../components/Announcement/Announcement";
import DashboardEmp from "../../components/Dashboard_Employee/Dashboard_emp";
import ManageProduct from "../../components/ManegeProduct/ManegeProduct";
import CategoryIcon from "@mui/icons-material/Category";
import ManageCategoryProduct from "../../components/ManageCategoryProduct/Manage_category_product";
import AccountSetting from "../AccountSetting/AccountSetting";
import ManagePackGym from "../../components/ManagePackGym/ManagePackGym";
import ManaPackGymCustomer from "../../components/PackGymCustomer/ManaPackGymCustomer";
import ManagePurchaseOrder from "../../components/ManagePurchaseOrder/ManagePurchaseOrder";
import CalendarWork from "../../components/Lich_lam_viec_ca_nhan/Lich_lam_viec"

const { Sider, Content } = Layout;
const { Title, Text } = Typography;

function Employee() {
  const [currentPage, setCurrentPage] = useState("Dashboard");
  const { user, logout } = useAuth();
  const { success, warning, error } = useAnnouncement();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    // Ensure the user's information is fetched on initial render
  }, []);

  const handleMenuClick = ({ key }) => {
    if (key === "logout") {
      logout();
    } else if (key === "account") {
      setCurrentPage("Cài đặt tài khoản");
    } else {
      setCurrentPage(key);
    }
  };

  const menuItems = [
    { 
      key: "Dashboard", 
      icon: <FontAwesomeIcon icon={faDumbbell} style={{ fontSize: '16px' }} />, 
      label: <span style={{ fontSize: '16px' }}>Thống kê</span> 
    },
    { 
      key: "Quản lý sản phẩm", 
      icon: <FontAwesomeIcon icon={faList} style={{ fontSize: '16px' }} />, 
      label: <span style={{ fontSize: '16px' }}>Quản lý sản phẩm</span> 
    },
    { 
      key: "Quản lý danh mục sản phẩm", 
      icon: <CategoryIcon style={{ fontSize: '16px' }} />, 
      label: <span style={{ fontSize: '16px' }}>Quản lý loại sản phẩm</span> 
    },
    { 
      key: "Quản lý gói tập", 
      icon: <FontAwesomeIcon icon={faFolderOpen} style={{ fontSize: '16px' }} />, 
      label: <span style={{ fontSize: '16px' }}>Quản lý gói tập</span> 
    },
    { 
      key: "Gói tập của khách hàng", 
      icon: <FontAwesomeIcon icon={faAddressCard} style={{ fontSize: '16px' }} />, 
      label: <span style={{ fontSize: '16px' }}>Gói tập của khách hàng</span> 
    },
    { 
      key: "Đơn hàng", 
      icon: <FontAwesomeIcon icon={faClipboard} style={{ fontSize: '16px' }} />, 
      label: <span style={{ fontSize: '16px' }}>Đơn hàng</span> 
    },
    {
      key: "account-dropdown",
      icon: <FontAwesomeIcon icon={faUserGear} style={{ fontSize: '16px' }} />,
      label: <span style={{ fontSize: '16px' }}>Tài khoản của bạn</span>,
      children: [
        { 
          key: "account", 
          icon: <FontAwesomeIcon icon={faGears} style={{ fontSize: '16px' }} />, 
          label: <span style={{ fontSize: '16px' }}>Cài đặt tài khoản</span> 
        },
        { 
          key: "Lịch làm việc cá nhân", 
          icon: <FontAwesomeIcon icon={faCalendar} style={{ fontSize: '16px' }} />, 
          label: <span style={{ fontSize: '16px' }}>Lịch làm việc</span> 
        },
        { 
          key: "logout", 
          icon: <FontAwesomeIcon icon={faArrowRightFromBracket} style={{ fontSize: '16px' }} />, 
          label: <span style={{ fontSize: '16px' }}>Đăng xuất</span> 
        },
      ],
    },
  ];
  

  return (
    <Layout style={{ height: "100vh" }}>
      <Sider theme="dark" collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} width={280} collapsedWidth={80}>
        <div style={{ textAlign: "center", padding: "20px 0", transition: "all 0.3s" }}>
          <Avatar size={collapsed ? 40 : 80} src={user.avt} style={{ border: "2px solid #0cb90c", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)" }} />
          {!collapsed && (
            <>
              <Title level={4} style={{ color: "white", marginTop: 10 }}>
                {user.HoTen}
              </Title>
              <Text style={{ color: "#0cb90c" }}>
                ● {user.TrangThai === "0" ? "Đang hoạt động" : user.TrangThai}
              </Text>
            </>
          )}
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["Dashboard"]} onClick={handleMenuClick} items={menuItems} />
      </Sider>

      <Layout>
        <Content style={{ padding: "20px", background: "#f0f2f5", overflowY: "auto" }}>
          <Title level={2} style={{ marginBottom: "20px",fontSize: "24px" }}>
            {currentPage}
          </Title>
          {error || success || warning ? <Announcement /> : null}
          {currentPage === "Dashboard" && <DashboardEmp />}
          {currentPage === "Quản lý sản phẩm" && <ManageProduct />}
          {currentPage === "Quản lý danh mục sản phẩm" && <ManageCategoryProduct />}
          {currentPage === "Quản lý gói tập" && <ManagePackGym />}
          {currentPage === "Gói tập của khách hàng" && <ManaPackGymCustomer />}
          {currentPage === "Đơn hàng" && <ManagePurchaseOrder />}
          {currentPage === "Lịch làm việc cá nhân" && <CalendarWork />}
          {currentPage === "Cài đặt tài khoản" && <AccountSetting changeForm={true} />}
        </Content>
      </Layout>
    </Layout>
  );
}

export default Employee;
