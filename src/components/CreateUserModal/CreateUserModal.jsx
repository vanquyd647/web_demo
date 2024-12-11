import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAnnouncement } from "../../contexts/Announcement";

function CreateUserModal({ setShowModal }) {
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    password: "",
    re_password: "",
    email: "",
    phone: "",
    address: "",
    role_id: "", 
    epl_description: "", 
  });
// eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(false);
  const { setSuccess, setMessage } = useAnnouncement();
  const [errors, setErrors] = useState({});

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

  const handleChange = (e) => {
    const { id, value, name } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id || name]: value,
    }));

    validateField(id || name, value);
  };

  const validateField = (id, value) => {
    let errorMsg = "";

    switch (id) {
      case "username":
        if (!/^[a-zA-Z0-9]{10,30}$/.test(value)) {
          errorMsg =
            "Tên đăng nhập phải từ 10 đến 30 ký tự và chỉ chứa chữ cái và số.";
        }
        break;
      case "password":
        if (
          !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]).{8,12}$/.test(
            value
          )
        ) {
          errorMsg =
            "Mật khẩu phải từ 8 đến 12 ký tự, gồm chữ thường, chữ in, số và ký tự đặc biệt.";
        }
        break;
      case "re_password":
        if (value !== formData.password) {
          errorMsg = "Mật khẩu không khớp!";
        }
        break;
      case "email":
        if (!/^[\w.%+-]+@gmail\.com$/.test(value)) {
          errorMsg = "Email phải có đuôi @gmail.com.";
        }
        break;
      case "phone":
        if (!/^0\d{9}$/.test(value)) {
          errorMsg = "Số điện thoại phải có 10 chữ số và bắt đầu bằng số 0.";
        }
        break;
      case "address":
        if (value.trim() === "") {
          errorMsg = "Vui lòng nhập địa chỉ của người dùng.";
        }
        break;
      case "fullname":
        if (value.trim() === "") {
          errorMsg = "Vui lòng nhập họ và tên của người dùng.";
        }
        break;
      case "role_id":
        if (!value) {
          errorMsg = "Vui lòng chọn vai trò.";
        }
        break;
      case "epl_description":
        if (formData.role_id === "2" && value.trim() === "") {
          errorMsg = "Vui lòng nhập mô tả vai trò cho nhân viên.";
        }
        break;
      default:
        break;
    }

    setErrors((prevState) => ({
      ...prevState,
      [id]: errorMsg,
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    Object.keys(formData).forEach((field) => {
      const value = formData[field];

      if (!value.trim() && field !== "epl_description") {
        newErrors[field] = "Vui lòng điền thông tin vào trường này.";
        isValid = false;
      }

      validateField(field, value);
      if (errors[field]) {
        newErrors[field] = errors[field];
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { re_password, ...formDataToSend } = formData;
  
    if (!validateForm()) {
      return;
    }
  
    const jwt = findCookie("jwt");
    if (!jwt) {
      setMessage("Người dùng chưa đăng nhập!");
      setError(true);
      return;
    }
  
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
      PHPSESSID: findCookie("PHPSESSID"),
    };
  
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_LOCALHOST}/admin/account/add`,
        formDataToSend,
        { headers }
      );
  
      if (response.status === 200) {
        setSuccess(true);
        setMessage("Tạo tài khoản thành công.");
        setShowModal(false);
      } else {
        setMessage("Tạo tài khoản thất bại. Vui lòng thử lại sau.");
      }
    } catch (error) {
      console.error("Đã xảy ra lỗi khi tạo tài khoản!", error);
  
      if (error.response?.data?.error === "Tên đăng nhập đã tồn tại") {
        setErrors((prevState) => ({
          ...prevState,
          username: "Tên đăng nhập đã tồn tại. Vui lòng chọn tên khác.",
        }));
      } else {
        setErrors((prevState) => ({
          ...prevState,
          general: "Đã xảy ra lỗi khi tạo tài khoản. Vui lòng thử lại.",
        }));
      }
    }
  };
  
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1000,
      }}
    >
      <Box
        component="form"
        sx={{
          backgroundColor: "#fff",
          padding: "20px",
          width: "450px",
          borderRadius: "8px",
          boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.1)",
          position: "relative",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        onSubmit={handleSubmit}
      >
        <IconButton
          onClick={() => setShowModal(false)}
          sx={{ position: "absolute", top: 10, right: 10 }}
        >
          <FontAwesomeIcon icon={faXmark} />
        </IconButton>
        <Typography
          sx={{ marginBottom: "20px", textAlign: "center", fontSize: "20px" }}
        >
          Thêm tài khoản mới
        </Typography>

        <TextField
          id="fullname"
          label="Họ và tên"
          fullWidth
          margin="normal"
          value={formData.fullname}
          onChange={handleChange}
          error={!!errors.fullname}
          helperText={errors.fullname}
        />

        <TextField
          id="username"
          label="Tên đăng nhập"
          fullWidth
          margin="normal"
          value={formData.username}
          onChange={handleChange}
          error={!!errors.username}
          helperText={errors.username}
        />

        <TextField
          id="password"
          label="Mật khẩu"
          type="password"
          fullWidth
          margin="normal"
          value={formData.password}
          onChange={handleChange}
          error={!!errors.password}
          helperText={errors.password}
        />

        <TextField
          id="re_password"
          label="Nhập lại mật khẩu"
          type="password"
          fullWidth
          margin="normal"
          value={formData.re_password}
          onChange={handleChange}
          error={!!errors.re_password}
          helperText={errors.re_password}
        />

        <TextField
          id="email"
          label="Email"
          fullWidth
          margin="normal"
          value={formData.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
        />

        <TextField
          id="phone"
          label="Số điện thoại"
          fullWidth
          margin="normal"
          value={formData.phone}
          onChange={handleChange}
          error={!!errors.phone}
          helperText={errors.phone}
        />

        <TextField
          id="address"
          label="Địa chỉ"
          fullWidth
          margin="normal"
          value={formData.address}
          onChange={handleChange}
          error={!!errors.address}
          helperText={errors.address}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel id="role_id-label">Vai trò</InputLabel>
          <Select
            labelId="role_id-label"
            id="role_id"
            name="role_id"
            label="Vai trò"
            value={formData.role_id}
            onChange={handleChange}
            error={!!errors.role_id}
          >
            {/* <MenuItem value="1">Admin</MenuItem> */}
            <MenuItem value="2">Nhân viên</MenuItem>
            <MenuItem value="3">Khách hàng</MenuItem>
          </Select>
        </FormControl>
        {formData.role_id === "2" && (
          <TextField
            id="epl_description"
            label="Mô tả vai trò"
            fullWidth
            margin="normal"
            value={formData.epl_description}
            onChange={handleChange}
            error={!!errors.epl_description}
            helperText={errors.epl_description}
          />
        )}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ width: "100%", marginTop: "20px" }}
        >
          Tạo tài khoản
        </Button>
      </Box>
    </Box>
  );
}

export default CreateUserModal;
