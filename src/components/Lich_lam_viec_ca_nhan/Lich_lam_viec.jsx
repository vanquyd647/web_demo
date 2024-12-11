import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, CircularProgress, Typography, Select, MenuItem, FormControl, InputLabel, Button,
  TablePagination
} from '@mui/material';
import { DatePicker } from 'antd';

const WorkScheduleTable = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");

  const [filterDate, setFilterDate] = useState(null);
  const [filterShift, setFilterShift] = useState("");
  const [filterMonth, setFilterMonth] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const resetFilters = () => {
    setFilterDate(null);
    setFilterShift("");
    setFilterMonth(null);
  };

  useEffect(() => {
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

    const isLogin = findCookie("jwt");
    if (isLogin) {
      const jwt = findCookie('jwt');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + jwt,
        'PHPSESSID': findCookie("PHPSESSID")
      };

      axios
        .get(`${process.env.REACT_APP_LOCALHOST}/employee/schedule`, { headers: headers })
        .then((response) => {
          if (response.status >= 200 && response.status < 300) {
            const data = response.data.map((item) => ({
              date: item.Ngay,
              shift: item.desc,
              shiftNumber: getShiftNumber(item.desc),
              note: item.GhiChu,
            }));
            setRows(data);
          }
        })
        .catch((error) => {
          setError(true);
          setMessage(error.response?.data?.error || "Có lỗi xảy ra trong quá trình lấy dữ liệu");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setError(true);
      setMessage("Người dùng chưa đăng nhập");
      setLoading(false);
    }
  }, []);

  const getShiftNumber = (desc) => {
    if (desc.includes('Ca 1')) return 1;
    if (desc.includes('Ca 2')) return 2;
    if (desc.includes('Ca 3')) return 3;
    return null;
  };

  const filteredRows = rows.filter((row) => {
    const matchDate = filterDate
      ? new Date(row.date).toLocaleDateString('vi-VN') ===
        new Date(filterDate).toLocaleDateString('vi-VN')
      : true;
    const matchShift = filterShift ? row.shiftNumber === parseInt(filterShift) : true;
    const matchMonth = filterMonth
      ? new Date(row.date).getMonth() === filterMonth.getMonth() &&
        new Date(row.date).getFullYear() === filterMonth.getFullYear()
      : true;

    return matchDate && matchShift && matchMonth;
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedRows = filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
      <DatePicker
        value={filterDate}
        onChange={(date) => setFilterDate(date)}
        locale="vi"
        style={{ marginRight: "20px", width: "200px", height: "40px", backgroundColor: "#F0F2F5" }}
        placeholder="Chọn ngày"
      />

      <FormControl
        sx={{
          minWidth: "200px",
          height: "70px",
          marginRight: "20px",
          marginLeft: "20px",
          "& .MuiInputBase-root": {
            height: "40px",
          },
          "& .MuiSelect-select": {
            display: "flex",
            alignItems: "center",
          },
        }}
      >
        <InputLabel sx={{ top: "-4px", fontSize: "14px" }}>
          Ca làm việc
        </InputLabel>
        <Select
          value={filterShift}
          onChange={(e) => setFilterShift(e.target.value)}
          label='Ca làm việc'
          inputProps={{ "aria-label": "Ca làm việc" }}
          sx={{
            height: "40px",
            "& .MuiSelect-select": {
              display: "flex",
              alignItems: "center",
              padding: "10px 14px",
            },
          }}
        >
          <MenuItem value="">Tất cả</MenuItem>
          <MenuItem value={1}>Ca 1</MenuItem>
          <MenuItem value={2}>Ca 2</MenuItem>
          <MenuItem value={3}>Ca 3</MenuItem>
        </Select>
      </FormControl>

      <Button
        variant="outlined"
        color="primary"
        onClick={resetFilters}
        sx={{
          height: "40px",
          marginTop: { xs: 2, sm: 0 },
          marginLeft: { sm: 2 },
          textTransform: "none",
          minWidth: "120px",
          "&.MuiButton-root": {
            padding: "10px 20px",
          },
          backgroundColor: "transparent",
          border: "1px solid #0070f3",
          "&:hover": {
            backgroundColor: "#f0f0f0",
          },
        }}
      >
        Đặt lại
      </Button>

      <TableContainer component={Paper}>
        {loading ? (
          <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />
        ) : error ? (
          <Typography sx={{ textAlign: 'center', color: 'red', margin: '20px' }}>
            {message}
          </Typography>
        ) : filteredRows.length === 0 ? (
          <Typography sx={{ textAlign: 'center', color: 'gray', margin: '20px' }}>
            Không có lịch làm việc
          </Typography>
        ) : (
          <>
            <Table sx={{ minWidth: 650 }} aria-label="Work Schedule Table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>STT</TableCell>
                  <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>Ngày</TableCell>
                  <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>Ca làm việc</TableCell>
                  <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>Ghi chú</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedRows.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ textAlign: "center" }}>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(row.date))}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>{row.shift}</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>{row.note || "Không có ghi chú"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={filteredRows.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 15]}
            />
          </>
        )}
      </TableContainer>
    </>
  );
};

export default WorkScheduleTable;
