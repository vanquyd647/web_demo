import React, { useState } from "react";
import { IconButton, TextField, Button, Dialog, DialogTitle, DialogContent, FormControl, Box, MenuItem } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { useAnnouncement } from "../../contexts/Announcement";

function UpdateWorkEmployeeInfo({ data, setShowModal }) {
    const { setError, setMessage, setSuccess } = useAnnouncement();
    const [formData, setFormData] = useState({
        DichVu: data.DichVu || "",
        GiaThue: data.GiaThue || "",
        TrangThai: data.TrangThai || ""
    });

    const checkFormData = (formData) => {
        for (const key in formData) {
            if (formData[key] !== "" && formData[key] !== data[key]) {
                return true;
            }
        }
        return false;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isLogin = findCookie("jwt");
        if (isLogin) {
            if (checkFormData(formData)) {
                const jwt = findCookie("jwt");
                const headers = {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + jwt,
                    "PHPSESSID": findCookie("PHPSESSID")
                };
                axios.put(`${process.env.REACT_APP_LOCALHOST}/personalTrainer/update`, formData, { headers: headers })
                    .then(response => {
                        if (response.status >= 200 && response.status < 300) {
                            setSuccess(true);
                            setMessage("Cập nhật thành công");
                            setShowModal(false);
                        } else {
                            throw new Error("Cập nhật thất bại");
                        }
                    }).catch(error => {
                        setError(true);
                        setMessage(error.response ? error.response.data.error : "Đã xảy ra lỗi");
                    });
            } else {
                setError(true);
                setMessage("Không có thay đổi!");
                return;
            }
        }
    };

    return (
        <Dialog open onClose={() => setShowModal(false)}
                sx={{ "& .MuiDialog-paper": { width: "400px", maxWidth: "90%" } }}>
            <DialogTitle sx={{ fontWeight: "bold", textAlign: "center", fontSize: "20px", borderBottom: "1px solid #ddd", paddingBottom: "10px", marginBottom: "10px" }}>
                Cập nhật thông tin
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
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <FormControl fullWidth margin="normal">
                        <TextField
                            label="Dịch vụ"
                            id="DichVu"
                            name="DichVu"
                            value={formData.DichVu}
                            onChange={handleChange}
                            fullWidth
                        />
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <TextField
                            label="Giá thuê"
                            id="GiaThue"
                            name="GiaThue"
                            type="number"
                            value={formData.GiaThue}
                            onChange={handleChange}
                            fullWidth
                        />
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <TextField
                            label="Trạng thái"
                            id="TrangThai"
                            name="TrangThai"
                            value={formData.TrangThai}
                            onChange={handleChange}
                            select
                            fullWidth
                        >
                            <MenuItem value="0">Đang hoạt động</MenuItem>
                            <MenuItem value="1">Ngừng hoạt động</MenuItem>
                        </TextField>
                    </FormControl>
                    <Box mt={2} textAlign="center">
                        <Button variant="contained" color="primary" type="submit" sx={{ width: "150px" }}>
                            Lưu
                        </Button>
                    </Box>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default UpdateWorkEmployeeInfo;
