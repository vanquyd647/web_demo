import React, { useState} from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  TextField,
  Select,
  MenuItem,
  IconButton,
  InputLabel,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import axios from "axios";

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

const UpdateScheduleModal = ({ data, setShowModal }) => {
  const [formData, setFormData] = useState({
    date: data.Ngay || "",
    shift: data.Ca || "",
    note: data.GhiChu || "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const jwt = findCookie("jwt");
    if (!jwt) {
      alert("Người dùng chưa đăng nhập!");
      setLoading(false);
      return;
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
      PHPSESSID: findCookie("PHPSESSID"),
    };

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_LOCALHOST}/employee/schedule/update`,
        formData,
        { headers }
      );
      if (response.status >= 200 && response.status < 300) {
        alert("Cập nhật lịch làm việc thành công!");
        setShowModal(false);
      } else {
        throw new Error("Cập nhật thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật lịch làm việc:", error);
      alert("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onClose={() => setShowModal(false)} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", fontSize: "20px" }}>
        Cập nhật lịch làm việc
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
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth margin="dense">
            <TextField
              label="Ngày làm việc"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </FormControl>
          <FormControl fullWidth margin="dense">
          <InputLabel id="shift-select-label">Ca làm việc</InputLabel>
            <Select
             labelId="shift-select-label"
              label="Ca làm việc"
              name="shift"
              value={formData.shift}
              onChange={handleChange}
              displayEmpty
            >
              <MenuItem value={1}>Ca 1: 8h00 - 12h00 (4 tiếng)</MenuItem>
              <MenuItem value={2}>Ca 2: 12h00 - 16h00 (4 tiếng)</MenuItem>
              <MenuItem value={3}>Ca 3: 16h00 - 22h00 (4 tiếng)</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <TextField
              label="Ghi chú"
              name="note"
              value={formData.note}
              onChange={handleChange}
              multiline
              rows={4}
            />
          </FormControl>
          <Box mt={2} textAlign="center">
            <Button variant="contained" color="primary" type="submit" disabled={loading}>
              Lưu
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateScheduleModal;
