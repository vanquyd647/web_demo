import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline"; 
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import UserPTPackage from "../UserPTPackage/UserPTPackage";
import axios from "axios";
import DoneIcon from "@mui/icons-material/Done";

const PaymentRegisterPTSuccess = ({ registrationId, jwt }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const orderCode = queryParams.get("orderCode");
  const navigate = useNavigate();
  const [showPTModal, setShowPTModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  // eslint-disable-next-line
  const [breadcrumbSteps, setBreadcrumbSteps] = useState([
    "Chọn dịch vụ",
    "Nhập thông tin",
    "Hoàn tất đăng ký",
  ]);

  const steps = ["Chọn dịch vụ", "Nhập thông tin", "Hoàn tất đăng ký"];

  useEffect(() => {
    const fetchPaymentStatus = async () => {
      const jwt = findCookie("jwt");
      const phpSessId = findCookie("PHPSESSID");

      if (!jwt || !phpSessId) {
        console.error("Không có JWT hoặc PHPSESSID. Vui lòng đăng nhập lại.");
        setPaymentStatus("ERROR");
        return;
      }

      try {
        const response = await axios.post(
          `${process.env.REACT_APP_LOCALHOST}/personalTrainer/payment`,
          { orderCode: orderCode },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwt}`,
              PHPSESSID: phpSessId,
            },
          }
        );
        setPaymentStatus(response.data.status);
        
        if (response.data.status === "PAID") {
          setBreadcrumbSteps([
            "Chọn dịch vụ",
            "Nhập thông tin",
            "Hoàn tất đăng ký",
          ]);
        } else if (response.data.status === "CANCELLED") {
          setBreadcrumbSteps([
            "Chọn dịch vụ",
            "Nhập thông tin",
            "Lỗi thanh toán",
          ]);
        }
      } catch (error) {
        console.error(error);
        setPaymentStatus("ERROR");
      }
    };

    fetchPaymentStatus();
  }, [orderCode]);

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

  const renderStatusMessage = () => {
    switch (paymentStatus) {
      case "PAID":
        return (
          <>
            <CheckCircleOutlineIcon sx={{ fontSize: 100, color: "green" }} />
            <Typography variant="h4" sx={{ mt: 2, mb: 1 }}>
              Thanh toán thành công!
            </Typography>
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
              Đăng ký thuê PT của quý khách không thể hoàn tất thanh toán.
            </Typography>
            {/* <Typography variant="body1" sx={{ mt: 2 }}>
              Số thẻ hoặc tài khoản không hợp lệ.
            </Typography> */}
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
              onClick={() => navigate("/PT")}
            >
              Quay lại trang thuê PT
            </Button>
          </>
        );
      default:
        return (
          <>
            <CloseIcon sx={{ fontSize: 70, color: "orange" }} />
            <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
              Xử lý thanh toán thất bại. Vui lòng thử lại.
            </Typography>
          </>
        );
    }
  };

  return (
    <Box sx={{ padding: "20px" }}>
      {/* <Stepper activeStep={2} alternativeLabel>
        {breadcrumbSteps.map((label, index) => (
          <Step key={label}>
            <StepLabel
              StepIconComponent={() => (
                <CheckCircleOutlineIcon sx={{ color: index === 2 ? 'green' : 'blue' }} />
              )}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper> */}
      <Stepper
        activeStep={
          paymentStatus === "PAID" ? 2 : paymentStatus === "CANCELLED" ? 1 : 0
        }
        alternativeLabel
      >
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel
              StepIconComponent={() => {
                if (index < 2) {
                  // Các bước trước hoàn tất
                  return <DoneIcon sx={{ color: "blue" }} />;
                } else if (index === 2) {
                  // Bước cuối xử lý trạng thái thanh toán
                  if (paymentStatus === "PAID") {
                    return <CheckCircleOutlineIcon sx={{ color: "green" }} />;
                  } else if (paymentStatus === "CANCELLED") {
                    return <ErrorOutlineIcon sx={{ color: "red" }} />;
                  } else {
                    return <ErrorOutlineIcon sx={{ color: "orange" }} />;
                  }
                }
                return null;
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
        {paymentStatus === "PAID" && (
          <>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Chúc mừng bạn đã hoàn tất đăng ký dịch vụ PT thành công!
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
              onClick={() => navigate("/info")}
            >
              Xem thông tin dịch vụ
            </Button>
          </>
        )}
      </Box>
      {showPTModal && <UserPTPackage setShowModal={setShowPTModal} />}
    </Box>
  );
};

export default PaymentRegisterPTSuccess;
