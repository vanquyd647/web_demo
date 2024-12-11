import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  FormControl,
  Box,
  IconButton,
  Select,
  MenuItem,
  InputLabel
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const UpdateSalaryEmp = ({ open, onClose, employee, onSave }) => {
  const [salaryData, setSalaryData] = useState({
    salary: 0,
    bonus: 0,
    status: "unpaid", // Trạng thái mặc định
  });

  useEffect(() => {
    if (employee) {
      setSalaryData({
        salary: employee.salary,
        bonus: employee.bonus,
        status: employee.status || "unpaid", // Giá trị mặc định nếu không có
      });
    }
  }, [employee]);

  const handleSalaryChange = (e) => {
    const { name, value } = e.target;
    setSalaryData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onSave(salaryData);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{ "& .MuiDialog-paper": { width: "400px", maxWidth: "90%" } }}
    >
      <DialogTitle
        sx={{
          textAlign: "center",
          fontSize: "20px",
          borderBottom: "1px solid #ddd",
          paddingBottom: "10px",
        }}
      >
        Chỉnh sửa lương nhân viên
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="dense">
          <TextField
            label="Lương tháng"
            type="number"
            name="salary"
            value={salaryData.salary}
            onChange={handleSalaryChange}
            fullWidth
            sx={{ marginBottom: "15px", marginTop: "20px" }}
          />
        </FormControl>
        <FormControl fullWidth margin="dense">
          <TextField
            label="Thưởng thêm"
            type="number"
            name="bonus"
            value={salaryData.bonus}
            onChange={handleSalaryChange}
            fullWidth
          />
        </FormControl>
        <FormControl fullWidth margin="dense" sx={{ marginTop: "20px" }}>
        <InputLabel>Trạng thái thanh toán</InputLabel>
          <Select
            label="Trạng thái thanh toán"
            name="status"
            value={salaryData.status}
            onChange={handleSalaryChange}
            fullWidth
          >
            <MenuItem value="unpaid">Chưa thanh toán</MenuItem>
            <MenuItem value="paid">Đã thanh toán</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions sx={{ padding: "16px", textAlign: "center" }}>
        <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <Button
            onClick={handleSave}
            variant="contained"
            color="primary"
            sx={{ width: "150px" }}
          >
            Lưu
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateSalaryEmp;
