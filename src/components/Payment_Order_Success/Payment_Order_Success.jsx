import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import axios from "axios";

const OrderPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const orderCode = queryParams.get("orderCode");
  // eslint-disable-next-line
  const status = queryParams.get("status");
  // eslint-disable-next-line
  const cancel = queryParams.get("cancel") === "true";

  const [paymentStatus, setPaymentStatus] = useState(null);
  const [breadcrumbSteps, setBreadcrumbSteps] = useState([
    "Chọn phương thức thanh toán",
    "Nhập thông tin thanh toán",
    "Hoàn tất giao dịch",
  ]);

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
    const fetchPaymentStatus = async () => {
      const jwt = findCookie("jwt");
      const phpSessId = findCookie("PHPSESSID");

      if (!jwt) {
        console.error("Không có JWT. Vui lòng đăng nhập lại.");
        setPaymentStatus("ERROR");
        return;
      }

      try {
        const response = await axios.post(
          `${process.env.REACT_APP_LOCALHOST}/order/payment`,
          {
            orderCode: orderCode,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwt}`,
              PHPSESSID: phpSessId,
            },
          }
        );
        
        const statusFromApi = response.data.status;
        setPaymentStatus(statusFromApi);

        if (statusFromApi === "PAID") {
          setBreadcrumbSteps([
            "Chọn phương thức thanh toán",
            "Nhập thông tin thanh toán",
            "Hoàn tất giao dịch",
          ]);
        } else if (statusFromApi === "CANCELLED") {
          setBreadcrumbSteps([
            "Chọn phương thức thanh toán",
            "Nhập thông tin thanh toán",
            "Lỗi thanh toán",
          ]);
        } else
        {
          setBreadcrumbSteps([
            "Chọn phương thức thanh toán",
            "Nhập thông tin thanh toán",
            "Xử lý thanh toán thất bại",
          ]);
        }
      } catch (error) {
        console.error("Lỗi khi lấy trạng thái thanh toán:", error);
        setPaymentStatus("ERROR");
      }
    };

    if (orderCode) {
      fetchPaymentStatus();
    }
  }, [orderCode]);

  const renderStatusMessage = () => {
    if (!queryParams.toString()) {
      return (
        <>
          <CheckCircleOutlineIcon sx={{ fontSize: 100, color: "green" }} />
          <Typography variant="h4" sx={{ mt: 2, mb: 1 }}>
            Đặt hàng thành công!
          </Typography>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Đơn hàng của bạn đã đặt thành công. Hình thức thanh toán: <span style={{fontWeight:"bold"}}>Thanh toán khi nhận hàng</span>. Bạn có thể theo 
            dõi đơn hàng trong mục{" "}
            <strong>Thông tin tài khoản / Đơn hàng</strong>.
          </Typography>
          <Typography variant="body2" sx={{ marginTop: "20px", marginBottom: "30px", fontSize: "20px" }}>
            <b>GOAT FITNESS</b> luôn sẵn sàng phục vụ bạn!
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", gap: "20px" }}>
            <Button variant="contained" color="primary" onClick={() => navigate("/shop")}>
              Tiếp tục mua sắm
            </Button>
            <Button variant="outlined" color="secondary" onClick={() => navigate(`/PurchaseOrder`)}>
              Chi tiết đơn hàng
            </Button>
          </Box>
        </>
      );
    }
  
    switch (paymentStatus) {
      case "PAID":
        return (
          <>
            <CheckCircleOutlineIcon sx={{ fontSize: 100, color: "green" }} />
            <Typography variant="h4" sx={{ mt: 2, mb: 1 }}>
              Đặt hàng thành công!
            </Typography>
            <Typography variant="body2" sx={{ mt: 2 }}>
              Đơn hàng của bạn đã được thanh toán thành công. Bạn có thể theo
              dõi đơn hàng trong mục{" "}
              <strong>Thông tin tài khoản / Đơn hàng</strong>.
            </Typography>
            {/* <Button
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
              onClick={() => navigate("/shop")}
            >
              Tiếp tục mua sắm
            </Button> */}
            <Typography variant="body2" sx={{ marginTop: '20px', marginBottom: '30px', fontSize:'20px' }}>
          <b>GOAT FITNESS</b> luôn sẵn sàng phục vụ bạn!
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/shop')}
          >
            Tiếp tục mua sắm
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate(`/PurchaseOrder`)}
          >
            Chi tiết đơn hàng
          </Button>
        </Box>
          </>
        );
      case "CANCELLED":
        return (
          <>
            <ErrorOutlineIcon sx={{ fontSize: 100, color: "red" }} />
            <Typography variant="h4" sx={{ mt: 2, mb: 1 }}>
              Thanh toán thất bại
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Đơn hàng của bạn không thể hoàn tất thanh toán. Vui lòng kiểm tra
              lại thông tin và thử lại.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
              onClick={() => navigate("/shop")}
            >
              Quay lại mua hàng
            </Button>
          </>
        );
      default:
        return (
          <>
            <ErrorOutlineIcon sx={{ fontSize: 50, color: "orange" }} />
            <Typography variant="h4" sx={{ mt: 2, mb: 1 }}>
              Xử lý thanh toán thất bại. Vui lòng thử lại.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
              onClick={() => navigate("/shop")}
            >
              Quay lại mua hàng
            </Button>
          </>
        );
    }
  };

  return (
    <Box sx={{ padding: "20px" }}>
      <Stepper activeStep={2} alternativeLabel>
        {breadcrumbSteps.map((label, index) => (
          <Step key={label}>
            <StepLabel
              StepIconComponent={() => {
                if (label === "Hoàn tất giao dịch") {
                  return <CheckCircleOutlineIcon sx={{ color: "green" }} />;
                } else if (label === "Lỗi thanh toán") {
                  return <ErrorOutlineIcon sx={{ color: "red" }} />;
                } 
                else if (label === "Xử lý thanh toán thất bại") {
                  return <ErrorOutlineIcon sx={{ color: "orange" }} />;
                } 
                return <CheckCircleOutlineIcon sx={{ color: "blue" }} />;
              }}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box
        sx={{
          textAlign: "center",
          padding: "20px",
          mt: "20px",
          backgroundColor: "#f5f5f5",
          borderRadius: "8px",
        }}
      >
        {renderStatusMessage()}
      </Box>
    </Box>
  );
};

export default OrderPayment;
