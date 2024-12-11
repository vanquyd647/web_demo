import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  TablePagination,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContentText,
  Tooltip,
} from "@mui/material";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import CreateUserModal from "../CreateUserModal/CreateUserModal";
import UpdateRoleModal from "../UpdateRoleModal/UpdateRoleModal";
import { useAnnouncement } from "../../contexts/Announcement";
import { AddCircleOutline } from "@mui/icons-material";

function ManageAccount({ data }) {
  const [accounts, setAccounts] = useState([]);
  const [modalAdd, setModalAdd] = useState(false);
  const [sortBy, setSortBy] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalUpdate, setModalUpdate] = useState(false);
  const [selectedUser] = useState(null);
  const { setSuccess, setError, setMessage } = useAnnouncement();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [accountToDelete] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [rerender, setRerender] = useState(false);

  useEffect(() => {
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
        .get(`${process.env.REACT_APP_LOCALHOST}/admin/account/all`, {
          headers: headers,
        })
        .then((response) => {
          if (response.status >= 200 && response.status < 300) {
            setAccounts(response.data);
          } else {
            throw new Error("Lấy thông tin thất bại");
          }
        })
        .catch((error) => {
          setError(true);
          setMessage(error.response.data.error);
        });
    }
  }, [modalUpdate, modalAdd, rerender, setError, setMessage]);


  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const filteredAccounts = accounts.filter((account) =>
    account.TenDangNhap.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (sortBy === "name") {
    filteredAccounts.sort((a, b) => a.TenDangNhap.localeCompare(b.TenDangNhap));
  } else if (sortBy === "name_desc") {
    filteredAccounts.sort((a, b) => b.TenDangNhap.localeCompare(a.TenDangNhap));
  }

  // const handleClickUpdate = (user) => {
  //   setSelectedUser(user);
  //   setModalUpdate(true);
  // };

  // const handleDeleteClick = (tendangnhap) => {
  //   setAccountToDelete(tendangnhap);
  //   setOpenConfirmDialog(true);
  // };

  const handleConfirmDelete = () => {
    handleDelete(accountToDelete);
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
        .delete(`${process.env.REACT_APP_LOCALHOST}/admin/account/delete`, {
          data: { TenDangNhap: id },
          headers: headers,
        })
        .then((response) => {
          if (response.status >= 200 && response.status < 300) {
            setSuccess(true);
            setMessage("Xóa tài khoản thành công");
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const roleMapping = {
    admin: "Quản trị viên",
    employee: "Nhân viên",
    user: "Khách hàng",
  };

  return (
    <div>
      {modalAdd && <CreateUserModal setShowModal={setModalAdd} />}
      {modalUpdate && (
        <UpdateRoleModal setShowModal={setModalUpdate} data={selectedUser} />
      )}

      <div style={{ display: "flex", marginTop: "20px", marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <TextField
            type="text"
            id="search"
            label="Tìm kiếm tài khoản"
            value={searchTerm}
            onChange={handleSearchChange}
            variant="outlined"
            size="small"
            sx={{ marginRight: "20px", marginLeft: "10px" }}
          />
        </div>

        <FormControl variant="outlined" size="small" style={{ width: "200px" }}>
          <InputLabel id="sort_label">Sắp xếp theo</InputLabel>
          <Select
            labelId="sort_label"
            id="sort"
            value={sortBy}
            label="Sắp xếp theo"
            onChange={handleSortChange}
          >
            <MenuItem value="">Sắp xếp theo...</MenuItem>
            <MenuItem value="name">Tên từ A-Z</MenuItem>
            <MenuItem value="name_desc">Tên từ Z-A</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircleOutline />}
          onClick={() => setModalAdd(true)}
          sx={{ marginLeft: "43%" }}
        >
          Thêm tài khoản mới
        </Button>
      </div>
      <TableContainer
        component={Paper}
        sx={{ border: "1px solid #ddd", margin: "10px", width: "98%" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>
                STT
              </TableCell>
              <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>
                Tên đăng nhập
              </TableCell>
              <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>
                Loại tài khoản
              </TableCell>
              <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>
                Hành động
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAccounts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} style={{ textAlign: "center" }}>
                  Không tìm thấy tài khoản.
                </TableCell>
              </TableRow>
            ) : (
              filteredAccounts
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((value, index) => (
                  <TableRow
                    key={value.TenDangNhap}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#f5f5f5" : "#ffffff", 
                    }}
                  >
                    <TableCell style={{ textAlign: "center" }}>
                      {page * rowsPerPage + index + 1}
                    </TableCell>
                    <TableCell style={{ textAlign: "center" }}>
                      {value.TenDangNhap}
                    </TableCell>
                    <TableCell style={{ textAlign: "center" }}>
                      {value.TenVaiTro === "user" 
                        ? (value.IDHLV === null 
                            ? roleMapping[value.TenVaiTro] 
                            : `${roleMapping[value.TenVaiTro]} (HLV)` 
                          )
                        : roleMapping[value.TenVaiTro] || value.TenVaiTro 
                      }
                    </TableCell>
                    <TableCell style={{ textAlign: "center" }}>
                    <Tooltip title="Chỉnh sửa">
                      <Button
                        variant="outlined"
                        color="primary"
                        // onClick={() => handleClickUpdate(value)}
                        style={{ marginRight: "5px" }}
                      >
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </Button>
                    </Tooltip>
                    <Tooltip title="Chức năng này chỉ thực hiện được ở app">
                      <Button
                        variant="outlined"
                        color="error"
                        // onClick={() => handleDeleteClick(value.TenDangNhap)}
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
          style={{ padding: "20px" }}
        >
          Bạn có chắc chắn muốn xóa tài khoản này không?
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
        count={filteredAccounts.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
}

export default ManageAccount;
