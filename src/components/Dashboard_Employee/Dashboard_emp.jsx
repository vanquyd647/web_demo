import React, { useEffect, useState } from "react";
import { Layout, Row, Col, Card, Table, Statistic, Select, DatePicker, Empty } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Bar, Line } from 'react-chartjs-2';
import { format } from 'date-fns';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from "axios";
import {
  PointElement, LineElement, BarController, LineController
} from 'chart.js';
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement, 
  LineElement,
  BarController,
  LineController,
  Title,
  Tooltip,
  Legend
);


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const {Content } = Layout;

const Dashboard = () => {
  const [checkins, setCheckins] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const { Option } = Select;
  
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

  useEffect(() => {
    const jwt = findCookie("jwt");
    if (jwt) {
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + jwt,
        PHPSESSID: findCookie("PHPSESSID"),
      };

      axios
        .get(`${process.env.REACT_APP_LOCALHOST}/employee/dashboard`, { headers })
        .then((response) => {
          const data = response.data;
          setCheckins(data.checkin || []); 
          setOrders(data.orders || []);   
        })
        .catch((error) => {
          console.error("Lỗi khi gọi API:", error);
        });
    }
  }, []);

  const columns = [
    {
      title: "ID đơn hàng",
      dataIndex: "IDDonHang",
      key: "IDDonHang",
    },
    {
      title: "Ngày đặt",
      dataIndex: "NgayDat",
      key: "NgayDat",
      render: (text) => format(new Date(text), 'dd-MM-yyyy'),
    },
    {
      title: "Ngày giao dự kiến",
      dataIndex: "NgayGiaoDuKien",
      key: "NgayGiaoDuKien",
      render: (text) => format(new Date(text), 'dd-MM-yyyy'),
    },
    {
      title: "Trạng thái thanh toán",
      dataIndex: "TrangThaiThanhToan",
      key: "TrangThaiThanhToan",
    },
    {
      title: "Tổng tiền",
      dataIndex: "ThanhTien",
      key: "ThanhTien",
      render: (text) => <span>{text.toLocaleString()} VND</span>,
    },
    {
      title: "Trạng thái",
      dataIndex: "TrangThai",
      key: "TrangThai",
      render: (text) => (
        <span
          style={{
            color: text === "Chưa xác nhận" ? "red" : "green",
          }}
        >
          {text}
        </span>
      ),
    },
  ];

  const orderStatusData = [
    { type: 'Chưa xác nhận', value: orders.filter(order => order.TrangThai === "Chưa xác nhận").length },
    { type: 'Đã xác nhận', value: orders.filter(order => order.TrangThai === "Đã xác nhận").length },
    // { type: 'Đã giao', value: orders.filter(order => order.TrangThai === "Đã giao").length }
  ];

  const paymentData = orders.reduce((acc, order) => {
    const date = order.NgayDat; 
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date] += order.ThanhTien; 
    return acc;
  }, {});
  
  const paymentChartData = Object.keys(paymentData).map(date => ({
    NgayDat: format(new Date(date), 'dd-MM-yyyy'),  
    ThanhTien: paymentData[date]
  }));


  // const handleDateChange = (date) => {
  //   setSelectedDate(date ? format(new Date(date), "yyyy-MM-dd") : null);
  // };

  const filteredCheckins = selectedDate
  ? checkins.filter((item) => {
      if (!item.ThoiGian) return false; 
      return item.ThoiGian === selectedDate; 
    })
  : checkins;

  const orderStatusChart = {
    labels: orderStatusData.map(item => item.type),
    datasets: [
      {
        label: 'Số lượng đơn hàng',
        data: orderStatusData.map(item => item.value),
        backgroundColor: ['#cf1322', '#3f8600', '#8c8c8c'],
      },
    ],
  };

    const [timeRange, setTimeRange] = useState("day");

    const getWeekOfYear = (date) => {
      const start = new Date(date.getFullYear(), 0, 1);
      const diff = (date - start + (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60000) / 86400000;
      return Math.ceil((diff + start.getDay() + 1) / 7);
    };

    const filterDataByTimeRange = (data, range) => {
      if (range === "day") {
        return data; 
      }
      if (range === "week") {
      
        const groupedByWeek = data.reduce((acc, item) => {
          const week = getWeekOfYear(new Date(item.NgayDat)); 
          acc[week] = acc[week] || { ThanhTien: 0, NgayDat: `Tuần ${week}` };
          acc[week].ThanhTien += item.ThanhTien;
          return acc;
        }, {});
        return Object.values(groupedByWeek);
      }
      if (range === "month") {
        
        const groupedByMonth = data.reduce((acc, item) => {
          const month = new Date(item.NgayDat).getMonth() + 1; 
          acc[month] = acc[month] || { ThanhTien: 0, NgayDat: `Tháng ${month}` };
          acc[month].ThanhTien += item.ThanhTien;
          return acc;
        }, {});
        return Object.values(groupedByMonth);
      }
      return data;
    };

    const filteredData = filterDataByTimeRange(paymentChartData, timeRange);
      const paymentChart = {
        labels: filteredData.map((item) => item.NgayDat),
        datasets: [
          {
            label: "Tổng tiền",
            data: filteredData.map((item) => item.ThanhTien),
            borderColor: "#1890ff",
            backgroundColor: "#1890ff",
            fill: false,
            tension: 0.1,
          },
        ],
      };

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  return (
    <Layout>
      <Content >
        <Row gutter={16}>
          <Col span={8}>
             <Card
              title={
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Số lượng check-in</span>
                  <DatePicker
                    onChange={(date, dateString) => {
                      if (date) setSelectedDate(dateString);
                      else setSelectedDate(null);
                    }}
                    format="YYYY-MM-DD"
                    placeholder="Chọn ngày"
                  />
                </div>
              }
              bordered={false}
              style={{ height: "250px" }}
            >
              {filteredCheckins.length > 0 ? (
                <>
                  <Statistic
                    title="Đã check-in"
                    value={filteredCheckins.filter((item) => item.CheckOut === 1).length}
                    prefix={<CheckCircleOutlined />}
                    valueStyle={{ color: "#3f8600" }}
                  />
                  <Statistic
                    title="Chưa check-out"
                    value={filteredCheckins.filter((item) => item.CheckOut === 0).length}
                    prefix={<CloseCircleOutlined />}
                    valueStyle={{ color: "#cf1322" }}
                  />
                </>
              ) : (
                <Empty description="Không có thông tin check-in, check-out" />
              )}
            </Card>
          </Col>

          
          <Col span={8}>
            <Card title="Trạng thái đơn hàng" bordered={false} style={{height:"250px"}}>
              <Bar
                data={orderStatusChart}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: true,
                      text: 'Trạng thái đơn hàng',
                    },
                  },
                }}
              />
            </Card>
          </Col>

          {/* <Col span={8}>
            <Card title="Thanh toán theo ngày" bordered={false} style={{height:"250px", marginBottom:"10px"}}>
              <Line
                data={paymentChart}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: true,
                      text: 'Thanh toán theo ngày',
                    },
                  },
                }}
              />
            </Card>
          </Col> */}
                <Col span={8}>
            <Card
              title={
                <>
                  Thanh toán theo {" "}
                  <Select
                    defaultValue="day"
                    style={{ marginLeft: "60px", width: "100px" }}
                    onChange={(value) => setTimeRange(value)}
                  >
                    <Option value="day">Ngày</Option>
                    <Option value="week">Tuần</Option>
                    <Option value="month">Tháng</Option>
                  </Select>
                </>
              }
              bordered={false}
              style={{ height: "250px", marginBottom: "10px" }}
            >
              <Line
                data={paymentChart}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: "top",
                    },
                    title: {
                      display: true,
                      text: `Thanh toán theo ${timeRange === "day" ? "ngày" : timeRange === "week" ? "tuần" : "tháng"}`,
                    },
                  },
                }}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Card title="Danh sách đơn hàng" bordered={false}>
              <Table columns={columns} dataSource={orders} rowKey="IDDonHang"  pagination={{ current: currentPage, pageSize: pageSize }}
                onChange={handleTableChange}/>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default Dashboard;
