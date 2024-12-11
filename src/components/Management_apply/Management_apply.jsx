import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Pagination,
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";


const ManageRegisterPT = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [message, setMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

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
    const isLogin = findCookie("jwt");
    if (isLogin) {
      const jwt = findCookie("jwt");
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + jwt,
        PHPSESSID: findCookie("PHPSESSID"),
      };
      axios
        .get(`${process.env.REACT_APP_LOCALHOST}/admin/personalTrainer/request`, {
          headers: headers,
        })
        .then((response) => {
          if (response.status >= 200 && response.status < 300) {
    
            const updatedData = response.data.map(row => ({
              ...row,
              XacNhan: row.XacNhan !== undefined ? row.XacNhan : 0, 
            }));
            setData(updatedData);
          } else {
            throw new Error("Lấy thông tin đơn hàng thất bại!");
          }
        })
        .catch((error) => {
          setError(true);
          setMessage(error.response?.data?.error || "Có lỗi xảy ra");
        });
    }
  }, []);


  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value); 
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const filteredData = data.filter((row) =>
    row.HoTen.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredByStatus = statusFilter
    ? filteredData.filter(
        (row) =>
          row.XacNhan !== undefined && row.XacNhan.toString() === statusFilter
      )
    : filteredData;

  const noDataFound = filteredByStatus.length === 0;

  const handleOpenDialog = (id, action) => {
    setSelectedId(id);
    setSelectedAction(action);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedId(null);
    setSelectedAction(null);
  };

  const handleConfirmAction = () => {
    if (selectedId && selectedAction) {
      handleRequest(selectedId, selectedAction);
      handleCloseDialog();
    }
  };

  const paginatedData = filteredByStatus.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleRequest = (id, action) => {
    const jwt = findCookie("jwt");
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + jwt,
      PHPSESSID: findCookie("PHPSESSID"),
    };
  
    const url =
      action === "accept"
        ? `${process.env.REACT_APP_LOCALHOST}/admin/personalTrainer/request/accept?id=${id}`
        : `${process.env.REACT_APP_LOCALHOST}/admin/personalTrainer/request/reject?id=${id}`;
  
    const method = action === "accept" ? "put" : "delete"; 
  
    axios({
      method, 
      url, 
      headers,
    })
      .then(() => {
        setData((prevData) =>
          prevData.map((row) =>
            row.IDHLV === id
              ? {
                  ...row,
                  XacNhan: action === "accept" ? 1 : 2,
                  hideActions: true,
                }
              : row
          )
        );
      })
      .catch((error) => {
        setError(true);
        setMessage(
          error.response?.data?.error || "Có lỗi xảy ra khi thực hiện hành động"
        );
      });
  };
  

  return (
    <div>
      <Box sx={{ marginBottom: 3, marginTop: 2 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems="center"
        >
          <TextField
            label="Tìm kiếm đơn đăng ký"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearch}
            sx={{
              marginLeft: "10px",
              marginRight: "20px",
              "& .MuiInputBase-root": {
                height: "40px !important",
                display: "flex",
                alignItems: "center",
              },
              "& .MuiInputLabel-root": {
                top: "-4px",
                fontSize: "14px",
              },
              "& .MuiOutlinedInput-input": {
                padding: "10px 14px",
                height: "40px",
              },
            }}
          />
          <FormControl
            sx={{
              marginRight: "20px",
              "& .MuiInputBase-root": {
                height: "40px",
                width: "180px",
              },
              "& .MuiInputLabel-root": {
                top: "-6px",
                fontSize: "14px",
              },
              "& .MuiSelect-select": {
                padding: "10px 14px",
                height: "40px",
                display: "flex",
                alignItems: "center",
              },
            }}
          >
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={statusFilter}
              label="Trạng thái"
              onChange={handleStatusFilterChange}
            >
              <MenuItem value="">
                <em>Tất cả</em>
              </MenuItem>
              <MenuItem value="0">Chờ xử lý</MenuItem>
              <MenuItem value="1">Đã chấp nhận</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Box>

      <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                STT
              </TableCell>
              <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                Họ và tên
              </TableCell>
              <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                Dịch vụ đăng ký
              </TableCell>
              <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                Giá thuê mong muốn
              </TableCell>
              <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                Chứng chỉ liên quan
              </TableCell>
              <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                Số điện thoại
              </TableCell>
              <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                Trạng thái
              </TableCell>
              <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                Hành động
              </TableCell>
            </TableRow>
          </TableHead>
        
          <TableBody>
  {noDataFound ? (
    <TableRow>
      <TableCell colSpan={8} sx={{ textAlign: "center", padding: "20px" }}>
        Không tìm thấy đơn đăng ký.
      </TableCell>
    </TableRow>
  ) : (
    paginatedData.map((row, index) => (
      <TableRow key={row.IDHLV}>
        <TableCell sx={{ textAlign: "center" }}>
          {(currentPage - 1) * rowsPerPage + index + 1}
        </TableCell>
        <TableCell sx={{ textAlign: "center" }}>{row.HoTen}</TableCell>
        <TableCell sx={{ textAlign: "center" }}>{row.DichVu}</TableCell>
        <TableCell sx={{ textAlign: "center" }}>
          {new Intl.NumberFormat("vi-VN").format(row.GiaThue)} VND
        </TableCell>
        <TableCell sx={{ textAlign: "center" }}>
          {row.ChungChi.split("\n").map((text, index) => (
            <div key={index}>{text}</div>
          ))}
        </TableCell>
        <TableCell sx={{ textAlign: "center" }}>{row.SDT}</TableCell>
        <TableCell sx={{ textAlign: "center" }}>
          <Chip
            label={
              row.XacNhan === 0
                ? "Chờ xác nhận"
                : row.XacNhan === 1
                ? "Đã chấp nhận"
                : "Đã từ chối"
            }
            color={
              row.XacNhan === 0
                ? "warning"
                : row.XacNhan === 1
                ? "success"
                : "error"
            }
          />
        </TableCell>
        <TableCell sx={{ textAlign: "center" }}>
          {!row.hideActions && row.XacNhan === 0 && (
            <>
              <Button
                color="success"
                sx={{ marginRight: "10px" }}
                onClick={() => handleOpenDialog(row.IDHLV, "accept")}
              >
                Chấp nhận
              </Button>
              <Button
                color="error"
                onClick={() => handleOpenDialog(row.IDHLV, "reject")}
              >
                Từ chối
              </Button>
            </>
          )}
        </TableCell>
      </TableRow>
    ))
  )}
</TableBody>

        </Table>
      </TableContainer>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle
          id="confirm-dialog-title"
          sx={{ borderBottom: "1px solid #ddd", fontSize: "20px" }}
        >
          Xác nhận hành động
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="confirm-dialog-description"
            style={{ paddingTop: "20px" }}
          >
            {selectedAction === "accept"
              ? "Bạn có chắc chắn muốn chấp nhận đăng ký này không?"
              : "Bạn có chắc chắn muốn từ chối đăng ký này không?"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="error">
            Hủy
          </Button>
          <Button onClick={handleConfirmAction} color="primary" autoFocus>
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>

      <Pagination
        count={Math.ceil(filteredByStatus.length / rowsPerPage)}
        page={currentPage}
        onChange={handlePageChange}
        sx={{ marginTop: 2, float: "right" }}
      />
    </div>
  );
};

export default ManageRegisterPT;
