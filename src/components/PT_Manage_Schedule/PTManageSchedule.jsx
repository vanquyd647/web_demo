import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

function PTManageSchedule({ setShowModal }) {
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [buttonsHidden, setButtonsHidden] = useState(false); 
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(null); 

  const findCookie = (name) => {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(name + '=')) {
            return cookie.substring(name.length + 1);
        }
    }
    return null;
};

useEffect(() => {
    const jwt = findCookie('jwt');
    const option = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + jwt,
            'PHPSESSID': findCookie('PHPSESSID'),
        },
    };

    fetch(`${process.env.REACT_APP_LOCALHOST}/personalTrainer/schedule`, option)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Lỗi server');
            } else {
                return response.json();
            }
        })
        .then((data) => {
          setSchedules(data);
            setLoading(false);
        })
        .catch((error) => {
            console.error('Lỗi khi lấy dữ liệu:', error);
            setLoading(false);
        });
}, []);




  const handleViewDetails = (schedule) => {
    setSelectedSchedule(schedule);
    setButtonsHidden(false); 
  };

  const handleBackToList = () => {
    setSelectedSchedule(null);
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const jwt = findCookie("jwt");
      const response = await axios.post(
        `${process.env.REACT_APP_LOCALHOST}/personalTrainer/schedule/update`, 
        { id, TrangThai: status }, 
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json",
            PHPSESSID: findCookie("PHPSESSID"),
          },
        }
      );
  
      if (response.data.success) {
    
        setSchedules((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, TrangThai: status } : item
          )
        );
        setButtonsHidden(true); 
      } else {
        console.error("Cập nhật thất bại:", response.data.message);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
    }
  };
  

  return (
    <Dialog open={true} onClose={() => setShowModal(false)} maxWidth="md" fullWidth>
      <DialogTitle>
        <FontAwesomeIcon
          icon={faXmark}
          onClick={() => setShowModal(false)}
          style={{ cursor: "pointer" }}
        />
        <span
          style={{
            textAlign: "center",
            width: "100%",
            display: "inline-block",
            marginLeft: "30px",
            fontWeight: "bold",
          }}
        >
          {selectedSchedule ? "Chi tiết lịch dạy" : "Danh sách lịch dạy"}
        </span>
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <p>Đang tải dữ liệu...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : selectedSchedule ? (
          <TableContainer component={Paper} sx={{ paddingBottom: 2, backgroundColor: "#f5f5f5" }}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell align="center">Khách hàng</TableCell>
                  <TableCell align="center">{selectedSchedule.TenKhachHang}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="center">Số điện thoại</TableCell>
                  <TableCell align="center">{selectedSchedule.SoDienThoai}</TableCell>
                </TableRow>
               
                <TableRow>
                  <TableCell align="center">Thời gian</TableCell>
                  <TableCell align="center">
                          {`${new Date(selectedSchedule.NgayDangKy).toLocaleString("vi-VN")} - ${new Date(selectedSchedule.NgayHetHan).toLocaleString("vi-VN")}`}
                      </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="center">Trạng thái thanh toán</TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      color: selectedSchedule.TrangThaiThanhToan === "Chưa Thanh Toán" ? "red" : "green",
                    }}
                  >
                    {selectedSchedule.TrangThaiThanhToan}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="center">Trạng thái</TableCell>
                  <TableCell align="center">
                        {selectedSchedule.TrangThai === 0 ? "Chưa hoàn thành" : "Đã hoàn thành"}
                      </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <DialogActions
              sx={{
                marginTop: "20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {!buttonsHidden && (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleUpdateStatus(selectedSchedule.id, 1)} 
                  >
                    Xác nhận hoàn thành
                  </Button>
                </>
              )}
              <Button variant="contained" color="secondary" onClick={handleBackToList}>
                Quay lại
              </Button>
            </DialogActions>
          </TableContainer>
        ) : (
          <TableContainer component={Paper} sx={{ paddingBottom: 5, backgroundColor: "#f5f5f5" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    STT
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Khách hàng
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Thời gian
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
                {schedules.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ color: "gray" }}>
                      Không có lịch dạy nào
                    </TableCell>
                  </TableRow>
                ) : (
                  schedules.map((item, index) => (
                    <TableRow key={item.IDHoaDon}>
                      <TableCell align="center">{index + 1}</TableCell>
                      <TableCell align="center">{item.TenKhachHang}</TableCell>
                      <TableCell align="center">
                          {`${new Date(item.NgayDangKy).toLocaleString("vi-VN")} - ${new Date(item.NgayHetHan).toLocaleString("vi-VN")}`}
                      </TableCell>
                      <TableCell align="center">
                        {item.TrangThai === 0 ? "Chưa hoàn thành" : "Đã hoàn thành"}
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleViewDetails(item)}
                        >
                          Xem chi tiết
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default PTManageSchedule;
