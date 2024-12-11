import React, { useState, useEffect } from "react";
import { Modal, Box, TextField, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 5,
  p: 4,
};

function ManagePTRegistration({ setShowModal }) {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);

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
    const option = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + jwt,
        PHPSESSID: findCookie("PHPSESSID"),
      },
    };

    fetch(`${process.env.REACT_APP_LOCALHOST}/user/register_pt/see`, option)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Lỗi server");
        } else {
          return response.json();
        }
      })
      .then((data) => {
        setFormData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu:", error);
        setLoading(false);
      });
  }, []);

  const getStatusColor = (status) => {
    if (status === "Đang chờ xử lý") return "warning.main";
    if (status === "Từ chối") return "error.main";
    if (status === "Chấp nhận") return "success.main";
    return "text.primary";
  };

  if (loading) {
    return (
      <Modal
        open={true}
        onClose={() => setShowModal(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={modalStyle}>
          <Typography variant="h6" textAlign="center">
            Đang tải dữ liệu...
          </Typography>
        </Box>
      </Modal>
    );
  }

  if (!formData) {
    return (
      <Modal
        open={true}
        onClose={() => setShowModal(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={modalStyle}>
          <IconButton
            onClick={() => setShowModal(false)}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              cursor: "pointer",
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography
            variant="h6"
            id="modal-title"
            textAlign="center"
            mb={8}
            sx={{ fontWeight: "bold" }}
          >
            Quản lý thông tin đăng ký HLV
          </Typography>
          <Typography sx={{ fontSize: "16px" }} textAlign="center" mb={8}>
            Không có dữ liệu để hiển thị.
          </Typography>
        </Box>
      </Modal>
    );
  }

  return (
    <Modal
      open={true}
      onClose={() => setShowModal(false)}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={modalStyle}>
        <IconButton
          onClick={() => setShowModal(false)}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            cursor: "pointer",
          }}
        >
          <CloseIcon />
        </IconButton>

        <Typography
          variant="h6"
          id="modal-title"
          textAlign="center"
          mb={2}
          sx={{ fontWeight: "bold" }}
        >
          Quản lý thông tin đăng ký HLV
        </Typography>

        <form>
          <TextField
            id="fullName"
            label="Họ và tên"
            fullWidth
            margin="normal"
            value={formData.HoTen || ""}
          />
          <TextField
            id="serviceID"
            label="Dịch vụ"
            value={formData.DichVu || ""}
            fullWidth
            margin="normal"
          />
          <TextField
            id="certificates"
            label="Chứng chỉ"
            multiline
            rows={4}
            fullWidth
            margin="normal"
            value={formData.ChungChi || ""}
          />
          <TextField
            id="desiredRent"
            label="Giá thuê mong muốn"
            fullWidth
            margin="normal"
            value={formData.GiaThue || ""}
          />
          <Typography
            id="status"
            variant="body1"
            sx={{
              fontWeight: "bold",
              paddingTop: 2,
              color: (theme) =>
                getStatusColor(
                  formData.XacNhan === 0 ? "Đang chờ xử lý" : "Chấp nhận"
                ),
            }}
          >
            Trạng thái đơn đăng ký:{" "}
            {formData.XacNhan === 0 ? "Đang chờ xử lý" : "Chấp nhận"}
          </Typography>
        </form>
      </Box>
    </Modal>
  );
}

export default ManagePTRegistration;
