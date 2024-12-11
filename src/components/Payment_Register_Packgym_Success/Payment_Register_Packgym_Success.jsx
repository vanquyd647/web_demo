import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DoneIcon from "@mui/icons-material/Done";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import axios from "axios";
import UserPackage from "../UserPackage/UserPackage";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const PaymentRegisterPTSuccess = ({ paymentStatus }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const orderCode = queryParams.get("orderCode");
  // const status = queryParams.get("status");

  const [paymentStatusFromApi, setPaymentStatusFromApi] = useState(
    paymentStatus || null
  );
  const [showPTModal, setShowPTModal] = useState(false);

  const steps = ["Chọn dịch vụ", "Nhập thông tin", "Hoàn tất đăng ký"];

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
        setPaymentStatusFromApi("ERROR");
        return;
      }

      try {
        const response = await axios.post(
          `${process.env.REACT_APP_LOCALHOST}/gympack/payment`,
          { orderCode },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwt}`,
              PHPSESSID: phpSessId,
            },
          }
        );

        const statusFromApi = response.data.status;
        setPaymentStatusFromApi(statusFromApi);
      } catch (error) {
        console.error("Lỗi khi lấy trạng thái thanh toán:", error);
        setPaymentStatusFromApi("ERROR");
      }
    };

    if (orderCode) {
      fetchPaymentStatus();
    }
  }, [orderCode]);

  const renderStatusMessage = () => {
    switch (paymentStatusFromApi) {
      case "PAID":
        return (
          <>
            <CheckCircleOutlineIcon sx={{ fontSize: 100, color: "green" }} />
            <Typography
              variant="h4"
              sx={{ marginTop: "13px", marginBottom: "10px" }}
            >
              Đăng ký thành công!
            </Typography>
            <Typography variant="body1">
              Chúc mừng bạn đã hoàn tất đăng ký gói tập thành công!
            </Typography>
            {/* <Typography variant="body1" sx={{ marginTop: '10px' }}>
          <strong>ID hóa đơn:</strong> {registrationId}<br />
          <strong>Hình thức thanh toán:</strong> {paymentStatus}
        </Typography>
        <Typography variant="body1" sx={{ marginTop: '10px' }}>
          Tên gói tập: <strong>{service}</strong><br />
          Giá: <strong>{rentalPrice}₫</strong>
        </Typography> */}
            <Typography variant="body2" sx={{ marginTop: "10px" }}>
              Bạn có thể theo dõi chi tiết trong mục{" "}
              <strong>Thông tin tài khoản / Thông tin gói tập</strong>. Để xem
              chi tiết hóa đơn thuê gói tập, vui lòng nhấn vào nút bên dưới.
            </Typography>
            <Typography
              variant="body2"
              sx={{ marginTop: "20px", marginBottom: "30px", fontSize: "20px" }}
            >
              <strong>GOAT FITNESS</strong> rất vinh hạnh được đồng hành cùng
              bạn trên hành trình rèn luyện sức khỏe!
            </Typography>
            <Box
              sx={{ display: "flex", justifyContent: "center", gap: "20px" }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/info")}
              >
                Tiếp tục tìm hiểu dịch vụ
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => setShowPTModal(true)}
              >
                Chi tiết hóa đơn thuê gói tập
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
            <Typography variant="body1">
              Đăng ký gói tập của quý khách không thể hoàn tất thanh toán.
            </Typography>
            {/* <Typography variant="body1" sx={{ marginTop: '10px' }}>
          Số thẻ hoặc tài khoản không hợp lệ.
        </Typography> */}
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
              onClick={() => navigate("/gympack")}
            >
              Quay lại trang gói tập
            </Button>
          </>
        );
      default:
        return (
          <>
            <ErrorOutlineIcon sx={{ fontSize: 100, color: "orange" }} />
            <Typography variant="h4" sx={{ mt: 2, mb: 1 }}>
              Xử lý thanh toán thất bại. Vui lòng thử lại.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
              onClick={() => navigate("/gympack")}
            >
              Quay lại trang gói tập
            </Button>
          </>
        );
    }
  };

  return (
    <Box sx={{ padding: "20px" }}>
      {/* <Stepper activeStep={2} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel
              StepIconComponent={() => (
                <DoneIcon sx={{ color: index === 2 ? 'green' : 'blue' }} />
              )}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper> */}
      <Stepper
        activeStep={
          paymentStatusFromApi === "PAID"
            ? 2
            : paymentStatusFromApi === "CANCELLED"
            ? 1
            : 0
        }
        alternativeLabel
      >
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel
              StepIconComponent={() => {
                if (index === 2) {
                  return paymentStatusFromApi === "PAID" ? (
                    <CheckCircleOutlineIcon sx={{ color: "green" }} />
                  ) : (
                    <ErrorOutlineIcon sx={{ color: "red" }} />
                  );
                }
                return <DoneIcon sx={{ color: index < 2 ? "blue" : "gray" }} />;
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
          marginTop: "20px",
          backgroundColor: "#f5f5f5",
          borderRadius: "8px",
        }}
      >
        {renderStatusMessage()}
        {/* <Typography variant="body2" sx={{ marginTop: '20px', marginBottom: '30px', fontSize: '20px' }}>
          <strong>GOAT FITNESS</strong> rất vinh hạnh được đồng hành cùng bạn trên hành trình rèn luyện sức khỏe!
        </Typography> */}
      </Box>

      {showPTModal && <UserPackage setShowModal={setShowPTModal} />}
    </Box>
  );
};

export default PaymentRegisterPTSuccess;
