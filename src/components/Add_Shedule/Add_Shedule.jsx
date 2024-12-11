import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Backdrop,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  TextField,
  IconButton,
  Select,
  MenuItem,
  InputLabel,
  Stack,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import axios from "axios";
import { format } from "date-fns";

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

const AddSchedule = ({ setShowModal }) => {
  // eslint-disable-next-line no-unused-vars
  const [open, setOpen] = useState(true);
  const [employeeLogin, setEmployeeLogin] = useState(""); 
  const [employeeId, setEmployeeId] = useState(null); 
  const [date, setDate] = useState("");
  const [shift, setShift] = useState("");
  const [note, setNote] = useState("");
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const jwt = findCookie("jwt");
    if (jwt) {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
        PHPSESSID: findCookie("PHPSESSID"),
      };

      axios
        .get("http://localhost:8080/Backend/admin/employee/all", { headers })
        .then((response) => {
          if (response.status >= 200 && response.status < 300) {
            setEmployees(response.data);
          } else {
            throw new Error("Lấy thông tin nhân viên thất bại!");
          }
        })
        .catch((error) => {
          console.error("Lỗi khi lấy danh sách nhân viên:", error);
          setError(true);
          setMessage(error.response?.data?.error || "Có lỗi xảy ra khi tải dữ liệu.");
        });
    } else {
      setError(true);
      setMessage("Người dùng chưa đăng nhập!");
    }
  }, []);

  const handleEmployeeChange = (e) => {
    const selectedEmployeeLogin = e.target.value;
    setEmployeeLogin(selectedEmployeeLogin);

    const selectedEmployee = employees.find(emp => emp.TenDangNhap === selectedEmployeeLogin);
    if (selectedEmployee) {
      setEmployeeId(selectedEmployee.TenDangNhap); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const jwt = findCookie("jwt");

    if (!jwt) {
      setMessage("Người dùng chưa đăng nhập!");
      setLoading(false);
      return;
    }

    if (!employeeLogin || !date || !shift) {
      setMessage("Vui lòng điền đầy đủ thông tin!");
      setLoading(false);
      return;
    }

    const dateFormatted = format(new Date(date), "dd-MM-yyyy");

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
      PHPSESSID: findCookie("PHPSESSID"),
    };

    const payload = {
      employee_username: employeeId,  // Sử dụng tên đăng nhập của nhân viên
      date: dateFormatted,
      shift,
      note,
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/Backend/admin/employee/schedule/add",
        payload,
        { headers }
      );

      if (response.data.success === "Thêm thành công") {
        setMessage(response.data.success);
        setShowModal(false);
      } else {
        setMessage("Có lỗi xảy ra. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi khi thêm lịch làm việc:", error);
      setMessage("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  
  return (
    <Dialog open={open} onClose={() => setShowModal(false)} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", fontSize: "20px" }}>
        Thêm lịch làm việc
        <IconButton
          aria-label="close"
          onClick={() => setShowModal(false)}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {message && (
          <Box mb={2} color={error ? "red" : "green"}>
            {message}
          </Box>
        )}
        <Stack spacing={2}>
           <FormControl fullWidth>
            <InputLabel id="employee-select-label">Chọn nhân viên</InputLabel>
            <Select
              labelId="employee-select-label"
              value={employeeLogin || ""}
              onChange={handleEmployeeChange}  
              label="Chọn nhân viên"
            >
              {employees.map((employee) => (
                <MenuItem key={employee.TenDangNhap} value={employee.TenDangNhap}>
                  {employee.HoTen} - {employee.TenDangNhap}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Ngày làm việc"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />

          <FormControl fullWidth>
            <InputLabel id="shift-select-label">Chọn ca làm việc</InputLabel>
            <Select
              labelId="shift-select-label"
              value={shift}
              onChange={(e) => setShift(e.target.value)}
              label="Chọn ca làm việc"
            >
              <MenuItem value={1}>Ca 1: 8h00 - 12h00 (4 tiếng)</MenuItem>
              <MenuItem value={2}>Ca 2: 12h00 - 16h00 (4 tiếng)</MenuItem>
              <MenuItem value={3}>Ca 3: 16h00 - 22h00 (4 tiếng)</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Ghi chú"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            fullWidth
            multiline
            rows={4}
          />
        </Stack>
        <Box mt={2} textAlign="center">
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading}
            sx={{ width: "120px" }}
          >
            Lưu
          </Button>
        </Box>
      </DialogContent>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Dialog>
  );
};

export default AddSchedule;
