import React, { useEffect, useState } from "react";
import axios from "axios";
import { Row, Col, Card, Statistic, Table } from "antd";
import { Line, Pie } from "react-chartjs-2";
import { UserOutlined, ShoppingCartOutlined, DollarOutlined } from '@ant-design/icons';
import dayjs from "dayjs"; 

import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);
  const [selectedDate] = useState(null); 

  useEffect(() => {
    const findCookie = (name) => {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(name + "=")) {
          return cookie.substring(name.length + 1);
        }
      }
      return null;
    };

    const isLogin = findCookie("jwt");
    if (isLogin) {
      const jwt = findCookie("jwt");
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + jwt,
        PHPSESSID: findCookie("PHPSESSID"),
      };

      axios
        .get(`${process.env.REACT_APP_LOCALHOST}/admin/dashboard`, { headers })
        .then((response) => {
          setData(response.data);
        })
        .catch((error) => {
          console.error("Lỗi khi gọi API:", error);
        });
    }
  }, []);

  if (!data) {
    return <p>Đang tải...</p>;
  }

  const filterOrdersByDate = (orders, startDate, endDate) => {
    if (!startDate || !endDate) return orders;

    return orders.filter((order) => {
      const orderDate = dayjs(order.NgayDat);
      return orderDate.isBetween(startDate, endDate, null, "[]"); 
    });
  };

  const userRoles = data.user_data.map((item) => item.VaiTro);
  const userQuantities = data.user_data.map((item) => item.SoLuong);

  const updatedUserRoles = userRoles.map((role) => {
    switch(role) {
      case 'KhachHang':
        return 'Khách hàng';
      case 'Employee':
        return 'Nhân viên';
      case 'HLV':
        return 'HLV (PT)';
      default:
        return role;
    }
  });

  const userRoleChartData = {
    labels: updatedUserRoles,
    datasets: [
      {
        data: userQuantities,
        backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
        hoverOffset: 4,
      },
    ],
  };

  // const orderDates = data.order_data.map((item) => item.NgayDat);
  // const orderRevenue = data.order_data.map((item) => parseFloat(item.DoanhThu));

  const filteredOrderData = filterOrdersByDate(data.order_data, selectedDate?.[0], selectedDate?.[1]);
  const filteredOrderRevenue = filteredOrderData.map((item) => parseFloat(item.DoanhThu));

  const orderRevenueChartData = {
    labels: filteredOrderData.map((item) => item.NgayDat),
    datasets: [
      {
        label: "Doanh thu",
        data: filteredOrderRevenue,
        borderColor: "#42A5F5",
        backgroundColor: "rgba(66, 165, 245, 0.2)",
      },
    ],
  };

  const gympackDates = data.gympack_data.map((item) => item.NgayDangKy);
  const gympackValues = data.gympack_data.map((item) => parseFloat(item.TongThanhTien));

  const gympackChartData = {
    labels: gympackDates,
    datasets: [
      {
        label: "Doanh thu khách hàng thuê PT",
        data: gympackValues,
        borderColor: "#FF9800",
        backgroundColor: "rgba(255, 152, 0, 0.2)",
      },
    ],
  };

  const orderColumns = [
    {
      title: "Ngày đặt",
      dataIndex: "NgayDat",
      key: "NgayDat",
      render: (text) => {
        const [year, month, day] = text.split("-");
        return `${day}-${month}-${year}`;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "TrangThai",
      key: "TrangThai",
      render: (text) => {
        const color = text === "Chưa xác nhận" ? "red" : "green";
        return <span style={{ color }}>{text}</span>;
      },
    },
    {
      title: "Số lượng đơn hàng",
      dataIndex: "SoLuongDonHang",
      key: "SoLuongDonHang",
    },
    {
      title: "Doanh thu",
      dataIndex: "DoanhThu",
      key: "DoanhThu",
      render: (value) => {
        return `${value.toLocaleString()} VNĐ`;
      },
    },
  ];

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const orderTableData = filteredOrderData.map((item, index) => ({
    key: index,
    ...item,
    DoanhThu: item.DoanhThu.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
  }));

  return (
    <div>
      <Row gutter={16}>
        <Col span={8}>
          <Card style={{ marginTop: "5px", marginBottom: "5px", marginLeft: "3px" }}>
            <Statistic
              title="Số người dùng"
              value={data.user_data.reduce((sum, item) => sum + item.SoLuong, 0)}
              prefix={<UserOutlined style={{ color: "red", fontSize: "24px" }} />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card style={{ marginTop: "5px", marginBottom: "5px" }}>
            <Statistic
              title="Số lượng đơn hàng"
              value={filteredOrderData.length}
              prefix={<ShoppingCartOutlined style={{ color: "green", fontSize: "24px" }} />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card style={{ marginTop: "5px", marginBottom: "5px", marginRight: "3px" }}>
            <Statistic
              title="Tổng doanh thu"
              value={`${filteredOrderRevenue.reduce((sum, item) => sum + item, 0).toLocaleString()} VNĐ`}
              prefix={<DollarOutlined style={{ color: "#1890ff", fontSize: "24px" }} />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="Phân bổ người dùng theo vai trò" style={{ height: "400px", marginLeft: "3px", marginBottom: "5px" }}>
            <div style={{ width: "100%", height: "300px" }}>
              <Pie data={userRoleChartData} />
            </div>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Doanh thu theo ngày" style={{ height: "400px", marginRight: "3px" }}>
            <div style={{ width: "100%", height: "300px" }}>
              <Line
                data={orderRevenueChartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: "top",
                    },
                    title: {
                      display: true,
                      text: "Doanh thu theo ngày",
                    },
                  },
                  scales: {
                    x: {
                      ticks: {
                        callback: function (value) {
                          const dateValue = this.getLabelForValue(value);
                          const [year, month, day] = dateValue.split("-");
                          return `${day}-${month}-${year}`;
                        },
                      },
                    },
                  },
                }}
              />
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="Khách hàng thuê PT(HLV)" style={{ height: "444px", marginLeft: "3px", marginBottom: "5px" }}>
            <div style={{ width: "100%", height: "300px" }}>
              <Line
                data={gympackChartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: "top",
                    },
                    title: {
                      display: true,
                      text: "Khách hàng thuê PT(HLV) theo ngày",
                    },
                  },
                  scales: {
                    x: {
                      ticks: {
                        callback: function (value) {
                          const dateValue = this.getLabelForValue(value);
                          const [year, month, day] = dateValue.split("-");
                          return `${day}-${month}-${year}`;
                        },
                      },
                    },
                  },
                }}
              />
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Danh sách đơn hàng" style={{ marginRight: "3px",height: "444px" }}>
            <Table
              columns={orderColumns}
              dataSource={orderTableData}
              pagination={{
                current: currentPage,
                pageSize: pageSize,
              }}
              onChange={handleTableChange}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
