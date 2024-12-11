import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  TablePagination,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Tooltip,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import UpdateSalaryEmp from "../Modal_Update_Salary/Update_Salary_Emp";
import AddSalaryEmp from "../Add_Salary_Emp/Add_salary_emp";
import { AddCircleOutline } from "@mui/icons-material";

const mockEmployeeData = [
  { id: 1, name: "Hứa Long Vỹ", position: "Lễ tân", salary: 5000000, bonus: 500000,status: "Chưa thanh toán" },
  { id: 2, name: "Hồng Long Vỹ", position: "Phục vụ", salary: 4500000, bonus: 300000,status: "Chưa thanh toán"  },
  {
    id: 3,
    name: "Nguyễn Thành Lộc",
    position: "PT",
    salary: 6000000,
    bonus: 700000,
    status: "Chưa thanh toán" 
  },
  { id: 4, name: "Nguyễn Duy Tài", position: "Boxing", salary: 4800000, bonus: 400000,status: "Chưa thanh toán"  },
  { id: 5, name: "Hồ Trần Chí Tâm", position: "Yoga", salary: 4700000, bonus: 350000,status: "Chưa thanh toán" },
  // Add more mock employees if needed for testing pagination
];

const ManageEmployeeSalary = () => {
  const [employees, setEmployees] = useState(mockEmployeeData);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [update, setUpdate] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setUpdate(true);
  };

  const handleSaveSalary = (newSalaryData) => {
    // Lưu dữ liệu mới vào danh sách nhân viên (có thể thông qua API hoặc trực tiếp trong state)
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === selectedEmployee.id
          ? { ...emp, salary: newSalaryData.salary, bonus: newSalaryData.bonus }
          : emp
      )
    );
  };

  const handleAddEmployee = (newEmployee) => {
    setEmployees((prev) => [...prev, newEmployee]);
  };

  const handleDeleteClick = (employeeId) => {
    setSelectedEmployee(employeeId);
    setOpenConfirmDialog(true);
  };

  const handleConfirmDelete = () => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== selectedEmployee));
    setOpenConfirmDialog(false);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedEmployees = filteredEmployees.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div>
      <TextField
        label="Tìm kiếm theo tên"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearchChange}
        sx={{
          marginBottom: "15px",
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
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddCircleOutline />}
        onClick={() => setOpenAddDialog(true)}
        sx={{ marginBottom: "15px",float:"right",marginRight:"10px" }}
      >
        Thêm bản ghi lương mới
      </Button>

      <AddSalaryEmp
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        onSave={handleAddEmployee}
      />
      {update && (
        <UpdateSalaryEmp
          open={update}
          onClose={() => setUpdate(false)}
          employee={selectedEmployee}
          onSave={handleSaveSalary}
        />
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                STT
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Họ và tên
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Vị trí
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Lương tháng
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Thưởng thêm
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Trạng thái
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Hành động
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedEmployees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Không tìm thấy lương nhân viên.
                </TableCell>
              </TableRow>
            ) : (
              paginatedEmployees.map((employee, index) => (
                <TableRow key={employee.id}>
                  <TableCell align="center">
                    {page * rowsPerPage + index + 1}
                  </TableCell>
                  <TableCell align="center">{employee.name}</TableCell>
                  <TableCell align="center">{employee.position}</TableCell>
                  <TableCell align="center">
                    {new Intl.NumberFormat('vi-VN').format(employee.salary)} VND
                  </TableCell>
                  <TableCell align="center">
                    {new Intl.NumberFormat('vi-VN').format(employee.bonus)} VND
                  </TableCell>
                  <TableCell align="center">{employee.status}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Chỉnh sửa">
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleEdit(employee)}
                        style={{ marginRight: "5px" }}
                      >
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </Button>
                    </Tooltip>
                    <Tooltip title="Xóa">
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDeleteClick(employee.id)}
                      >
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
        onClose={() => setOpenConfirmDialog(false)}
      >
        <DialogTitle sx={{ borderBottom: "1px solid #ddd" }}>
          Xác nhận xóa
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ paddingTop: "15px" }}>
            Bạn có chắc chắn muốn xóa bản ghi lương của nhân viên này không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)} color="primary">
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
        onPageChange={(e, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) =>
          setRowsPerPage(parseInt(e.target.value, 10))
        }
      />
    </div>
  );
};

export default ManageEmployeeSalary;
