import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAnnouncement } from "../../contexts/Announcement";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
  Button,
  TablePagination,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContentText,
  Tooltip,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import UpdateEmployeeModal from "../Update_employee_info/Update_employee_info";
import { AddCircleOutline } from "@mui/icons-material";
import CreatShedule from "../Add_Shedule/Add_Shedule";
import { DatePicker } from 'antd';

const ManageEmployee = () => {
  // eslint-disable-next-line
  const [data, setData] = useState([]);
  const [modalAdd, setModalAdd] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  // eslint-disable-next-line
  const [selectedService, setSelectedService] = useState("");
  // const [uniqueServices, setUniqueServices] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [update, setUpdate] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const { setSuccess, setError, setMessage } = useAnnouncement();
  const [rerender, setRerender] = useState(false);
  const [selectedShift, setSelectedShift] = useState("");
  const [filterDate, setFilterDate] = useState(null);

  
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
        .get(`${process.env.REACT_APP_LOCALHOST}/admin/employee/schedule/all`, {
          headers: headers,
        })
        .then((response) => {
          if (response.status >= 200 && response.status < 300) {
            setData(response.data);
            setEmployees(response.data); 
            setLoading(false); 
          } else {
            throw new Error("Lấy thông tin nhân viên thất bại!");
          }
        })
        .catch((error) => {
          // setError(true);
          // setMessage(error.response?.data?.error || "Có lỗi xảy ra");
          setLoading(false); 
        });
    }
  }, [modalAdd]);
  
  
  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setUpdate(true);
  };

  const handleDeleteClick = (employeeId) => {
    setEmployeeToDelete(employeeId);
    setOpenConfirmDialog(true);
  };

  const handleConfirmDelete = () => {
    handleDelete(employeeToDelete);
    setOpenConfirmDialog(false);
  };
  
  const handleCancelDelete = () => {
    setOpenConfirmDialog(false);
  };

  const handleDelete = (id) => {
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
    const isLogin = findCookie("jwt");
    if (isLogin) {
      const jwt = findCookie("jwt");
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + jwt,
        PHPSESSID: findCookie("PHPSESSID"),
      };
      axios
        .delete(`${process.env.REACT_APP_LOCALHOST}/employee/delete`, {
          data: { TenDangNhap: id },
          headers: headers,
        })
        .then((response) => {
          if (response.status >= 200 && response.status < 300) {
            setSuccess(true);
            setMessage("Xóa nhân viên thành công");
            setRerender(!rerender);
          } else {
            throw new Error("Xóa thất bại");
          }
        })
        .catch((error) => {
          setError(true);
          setMessage(error.response.data.error);
        });
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // eslint-disable-next-line
  const handleServiceChange = (event) => {
    setSelectedService(event.target.value);
  };

  const handleShiftChange = (event) => {
    setSelectedShift(event.target.value);
  };

  // eslint-disable-next-line
  const uniqueShifts = [...new Set(employees.map((employee) => employee.Ca))];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch = employee.HoTen.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesShift = selectedShift ? employee.Ca === selectedShift : true;
    const matchesDate = filterDate
      ? new Date(employee.Ngay).toLocaleDateString("vi-VN") === new Date(filterDate).toLocaleDateString("vi-VN")
      : true;

    return matchesSearch && matchesShift && matchesDate;
  });


  const paginatedEmployees = filteredEmployees.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString); 
    const day = String(date.getDate()).padStart(2, '0'); 
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear(); 
  
    return `${day}-${month}-${year}`; 
  };

  const formatShift = (ca) => {
    switch (ca) {
      case 1:
        return 'Ca 1: 8h00 - 12h00 (4 tiếng)';
      case 2:
        return 'Ca 2: 12h00 - 16h00 (4 tiếng)';
      case 3:
        return 'Ca 3: 16h00 - 22h00 (4 tiếng)';
      default:
        return ''; 
    }
  };

  return (
    <div>
      <Grid
        container
        spacing={2}
        style={{ marginBottom: "15px"}}
      >
        <Grid item>
          <TextField
            label="Tìm kiếm theo tên"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{
              marginLeft: "10px",
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
        </Grid>
        <Grid item>
          <DatePicker
            value={filterDate}
            onChange={(date) => setFilterDate(date)}
            locale="vi"
            style={{ width: "200px", height: "40px", backgroundColor: "#F0F2F5" }}
            placeholder="Chọn ngày"
          />
        </Grid>
        <Grid item>
           <FormControl
        variant="outlined"
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
        <InputLabel>Ca làm việc</InputLabel>
        <Select
          value={selectedShift}
          onChange={handleShiftChange}
          label="Ca làm việc"
        >
          <MenuItem value="">
            <em>Tất cả</em>
          </MenuItem>
          <MenuItem value={1}>Ca 1</MenuItem>
          <MenuItem value={2}>Ca 2</MenuItem>
          <MenuItem value={3}>Ca 3</MenuItem>
        </Select>
      </FormControl>
          {modalAdd && <CreatShedule setShowModal={setModalAdd} />}
          {update && (
            <UpdateEmployeeModal
              data={selectedEmployee}
              setShowModal={setUpdate}
            />
          )}
         
        </Grid>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircleOutline />}
          onClick={() => setModalAdd(true)}
          sx={{ marginLeft: "26%",height:"40px",marginTop:"15px" }}
        >
          Thêm lịch làm việc
        </Button>
      </Grid>
      <TableContainer component={Paper} sx={{ margin: "10px", width: "98%", border: "1px solid #ddd" }}>
  <Table sx={{ width: "100%" }}>
    <TableHead>
      <TableRow>
        <TableCell sx={{ textAlign: "center", fontWeight: "bold"}}>STT</TableCell>
        <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>Họ tên</TableCell>
        <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>Ngày</TableCell>
        <TableCell sx={{ textAlign: "center",fontWeight: "bold"}}>Ca</TableCell>
        <TableCell sx={{ textAlign: "center",fontWeight: "bold"}}>Ghi chú</TableCell>
        <TableCell sx={{ textAlign: "center", fontWeight: "bold"}}>Hành động</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {filteredEmployees.length === 0 ? (
        <TableRow>
          <TableCell colSpan={6} sx={{ textAlign: "center", padding: "20px" }}>
            Không tìm thấy lịch làm việc của nhân viên.
          </TableCell>
        </TableRow>
      ) : (
        paginatedEmployees.map((employee, index) => (
          <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? "#f5f5f5" : "#ffffff" }}>
            <TableCell sx={{ textAlign: "center" }}>{page * rowsPerPage + index + 1}</TableCell>
            <TableCell sx={{ textAlign: "center" }}>{employee.HoTen}</TableCell>
            <TableCell sx={{ textAlign: "center" }}>{formatDate(employee.Ngay)}</TableCell>
            <TableCell sx={{ textAlign: "center" }}>{formatShift(employee.Ca)}</TableCell>
            <TableCell sx={{ textAlign: "center" }}>{employee.GhiChu}</TableCell>
            <TableCell sx={{ textAlign: "center" }}>
              <Tooltip title="Chỉnh sửa">
                <Button variant="outlined" color="primary" onClick={() => handleEdit(employee)} style={{ marginRight: "5px" }}>
                  <FontAwesomeIcon icon={faPenToSquare} />
                </Button>
              </Tooltip>
              <Tooltip title="Xóa">
                <Button variant="outlined" color="error" onClick={() => handleDeleteClick(employee.TenDangNhap)}>
                  <FontAwesomeIcon icon={faTrashCan} />
                </Button>
              </Tooltip>
            </TableCell>
          </TableRow>
        ))
      )}
    </TableBody>
  </Table>
</TableContainer>


      <Dialog
        open={openConfirmDialog}
        onClose={handleCancelDelete}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle
          id="confirm-dialog-title"
          sx={{ borderBottom: "1px solid #ddd" }}
        >
          Xác nhận xóa
        </DialogTitle>
        <DialogContentText
          id="confirm-dialog-description"
          style={{ padding: "20px" ,paddingTop:"15px"}}
        >
          Bạn có chắc chắn muốn xóa lịch làm việc của nhân viên này không?
        </DialogContentText>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Hủy
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredEmployees.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default ManageEmployee;
