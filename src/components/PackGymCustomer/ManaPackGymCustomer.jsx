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
  Stack,
  Pagination,
  Button,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogActions,
  Tooltip,
} from "@mui/material";
import { faMoneyBill1, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UpdateInvoiceModal from "../UpdateInvoiceGympack/UpdateInvoiceGympack";
import RegisterPackModal from "../RegisterPackModal/RegisterPackModal";
import { AddCircleOutline } from "@mui/icons-material";

function ManaPackGymCustomer() {
  const [gympack, setGymPack] = useState([]);
  const [filteredGymPack, setFilteredGymPack] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("");
  const [update, setUpdate] = useState(false);
  const [selectedPack, setSelectedPack] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [gympackToDelete, setGymPackToDelete] = useState(null);
  const { setSuccess, setError, setMessage } = useAnnouncement();
  const [rerender, setRerender] = useState(false);

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
    const fetchGymPack = async () => {
      try {
        const jwt = findCookie("jwt");
        if (!jwt) throw new Error("Vui lòng đăng nhập!");

        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
          PHPSESSID: findCookie("PHPSESSID"),
        };

        const response = await axios.get(
          `${process.env.REACT_APP_LOCALHOST}/employee/user/gympack`,
          { headers }
        );

        if (response.status === 200) {
          setGymPack(response.data);
          setFilteredGymPack(response.data);
        } else {
          throw new Error("Không thể truy cập dữ liệu");
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };

    fetchGymPack();
  }, [update, rerender, showModal]);

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);
    setCurrentPage(1);

    const filteredData = gympack.filter((pack) => {
      return pack.HoTen?.toLowerCase().includes(searchValue);
    });

    setFilteredGymPack(filteredData);
  };

  const handleEdit = (pack) => {
    setSelectedPack(pack);
    setUpdate(true);
  };

  const handleDeleteClick = (gympackId) => {
    setGymPackToDelete(gympackId);
    setOpenConfirmDialog(true);
  };

  const handleConfirmDelete = () => {
    handleDelete(gympackToDelete);
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
        .delete(`${process.env.REACT_APP_LOCALHOST}/invoice_gympack/delete`, {
          data: { IDHoaDon: id },
          headers: headers,
        })
        .then((response) => {
          if (response.status >= 200 && response.status < 300) {
            setSuccess(true);
            setMessage("Xóa hóa đơn thuê gói tập thành công");
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

  const handleSort = (e) => {
    const sortOption = e.target.value;
    setSortType(sortOption);

    let sortedData = [...gympack];

    if (sortOption === "unpaid") {
      sortedData = sortedData.filter(
        (item) => item.TrangThaiThanhToan === "Chưa Thanh Toán"
      );
    } else if (sortOption === "paid") {
      sortedData = sortedData.filter(
        (item) => item.TrangThaiThanhToan === "Đã Thanh Toán"
      );
    } else if (sortOption === "expiring") {
    }
    setFilteredGymPack(sortedData);
  };

  const calculateDaysLeft = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const timeDifference = expiry - today;
    const daysLeft = Math.ceil(timeDifference / (1000 * 3600 * 24));

    if (daysLeft > 0) {
      return `${daysLeft} ngày`;
    } else if (daysLeft === 0) {
      return "Hết hạn hôm nay";
    } else {
      return "Đã hết hạn";
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const paginatedGymPack = filteredGymPack.slice(startIndex, endIndex);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };

  return (
    <div>
      {showModal && (
        <RegisterPackModal
          data={gympack}
          setShowModal={setShowModal}
          onPackAdded={(newPack) =>
            setGymPack((prevGymPack) => [...prevGymPack, newPack])
          }
        />
      )}

      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <TextField
            label="Tìm kiếm khách hàng"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearch}
            sx={{
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
            <Select
              value={sortType}
              onChange={handleSort}
              displayEmpty
              inputProps={{ "aria-label": "Sắp xếp theo" }}
            >
              <MenuItem value="">Sắp xếp theo</MenuItem>
              <MenuItem value="unpaid">Chưa thanh toán</MenuItem>
              <MenuItem value="paid">Đã thanh toán</MenuItem>
            </Select>
          </FormControl>
          {update && (
            <UpdateInvoiceModal data={selectedPack} setShowModal={setUpdate} />
          )}
        </div>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowModal(true)}
          startIcon={<AddCircleOutline fontSize="small" />}
        >
          Thêm đăng ký mới
        </Button>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>
                Khách hàng
              </TableCell>
              <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>
                Tên gói tập
              </TableCell>
              <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>
                Ngày đăng ký
              </TableCell>
              <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>
                Ngày hết hạn
              </TableCell>
              <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>
                Trạng thái thanh toán
              </TableCell>
              <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>
                Số ngày còn lại
              </TableCell>
              <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>
                Hành động
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedGymPack.length > 0 ? (
              paginatedGymPack.map((value, index) => (
                <TableRow
                  key={value.TenDangNhap}
                  sx={{
                    backgroundColor: index % 2 === 0 ? "white" : "#f5f5f5",
                  }}
                >
                  <TableCell align="center">
                    {value.HoTen || "Không có"}
                  </TableCell>
                  <TableCell align="center">
                    {value.TenGoiTap || "Không có"}
                  </TableCell>
                  <TableCell align="center">
                    {value.NgayDangKy
                      ? formatDate(value.NgayDangKy)
                      : "Không có"}
                  </TableCell>
                  <TableCell align="center">
                    {value.NgayHetHan
                      ? formatDate(value.NgayHetHan)
                      : "Không có"}
                  </TableCell>
                  <TableCell align="center">
                    {value.TrangThaiThanhToan || "Không có"}
                  </TableCell>
                  <TableCell align="center">
                    {calculateDaysLeft(value.NgayHetHan)}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    <Tooltip title="Cập nhật thanh toán">
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleEdit(value)}
                        style={{ marginRight: "5px" }}
                      >
                        <FontAwesomeIcon icon={faMoneyBill1} />
                      </Button>
                    </Tooltip>
                    <Tooltip title="Xóa">
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDeleteClick(value.IDHoaDon)}
                      >
                        <FontAwesomeIcon icon={faTrashCan} />
                      </Button>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Không tìm thấy hóa đơn thuê gói tập.
                </TableCell>
              </TableRow>
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
          Bạn có chắc chắn muốn xóa hóa đơn thuê gói tập này không?
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
      <Stack spacing={2} style={{ marginTop: "20px", float: "right" }}>
        <Pagination
          count={Math.ceil(filteredGymPack.length / itemsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Stack>
    </div>
  );
}

export default ManaPackGymCustomer;
