import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle, TextField, Button, Select, MenuItem, InputLabel, FormControl, IconButton } from '@mui/material';
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useAnnouncement } from "../../contexts/Announcement";

function UpdateProductModal({ data, setShowModal }) {
    const [formData, setFormData] = useState({ ...data });
    const [changedData, setChangedData] = useState({});
    const [category, setCategory] = useState([]);
    const { setError, setMessage, setSuccess } = useAnnouncement();
    // eslint-disable-next-line no-unused-vars
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        if (!formData.TenSP) newErrors.TenSP = "Tên sản phẩm không được bỏ trống";
        if (!formData.IDLoaiSanPham) newErrors.IDLoaiSanPham = "Vui lòng chọn loại sản phẩm";
        if (!formData.Mota) newErrors.Mota = "Mô tả không được bỏ trống";
        if (!formData.DonGia || formData.DonGia <= 0) newErrors.DonGia = "Đơn giá phải lớn hơn 0";
        if (formData.Discount < 0 || formData.Discount > 100) newErrors.Discount = "Giảm giá phải trong khoảng 0 - 100%";
        if (!formData.SoLuong || formData.SoLuong <= 0) newErrors.SoLuong = "Số lượng tồn kho phải lớn hơn 0";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Trả về true nếu không có lỗi
    };

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_LOCALHOST}/categories`)
            .then(response => {
                if (response.status >= 200 && response.status < 300) {
                    setCategory(response.data);
                } else {
                    throw new Error("Lấy thông tin thất bại");
                }
            })
            .catch(error => {
                setError(true);
                setMessage(error.response?.data?.error || "Lỗi kết nối server");
            });
    }, [setError, setMessage]);

    const handleChange = (e) => {
        const { name, files, value } = e.target;
        if (files && files.length > 0) {
            const file = files[0];
            const imageUrl = URL.createObjectURL(file);
            setFormData({ ...formData, [name]: imageUrl });
            setChangedData({ ...changedData, [name]: file });
        } else {
            setFormData({ ...formData, [name]: value });
            setChangedData({ ...changedData, [name]: value });
        }
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

    const uploadImage = (file) => {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append('image', file);
            axios.post('https://api.imgbb.com/1/upload?key=abbbfc4dd8180b09d029902de59a5241', formData)
                .then(response => resolve(response.data.data.image.url))
                .catch(error => reject(error));
        });
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     const isLogin = findCookie("jwt");
    //     if (isLogin) {
    //         const jwt = findCookie('jwt');
    //         const headers = {
    //             'Content-Type': 'application/json',
    //             'Authorization': 'Bearer ' + jwt,
    //             'PHPSESSID': findCookie("PHPSESSID")
    //         };
    //         const file = document.getElementById("IMG").files[0];
    //         let newlink = '';
    //         if (file) {
    //             newlink = await uploadImage(file);
    //         }
    //         if (newlink) {
    //             changedData.IMG = newlink;
    //         }
    //         const data = {
    //             data: { ...changedData },
    //             IDSanPham: formData.IDSanPham
    //         };

    //         axios.put('${process.env.REACT_APP_LOCALHOST}/employee/products/update', data, { headers })
    //             .then(response => {
    //                 if (response.status >= 200 && response.status < 300) {
    //                     setSuccess(true);
    //                     setMessage("Cập nhật thông tin sản phẩm thành công");
    //                     setShowModal(false);
    //                 } else {
    //                     throw new Error("Lấy thông tin thất bại");
    //                 }
    //             })
    //             .catch(error => {
    //                 setError(true);
    //                 setMessage(error.response.data.error);
    //             });
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            setError(true);
            setMessage("Vui lòng điền đầy đủ thông tin");
            return;
        }

        const isLogin = findCookie("jwt");
        if (isLogin) {
            const jwt = findCookie('jwt');
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwt,
                'PHPSESSID': findCookie("PHPSESSID")
            };
            const file = document.getElementById("IMG").files[0];
            let newlink = '';
            if (file) {
                newlink = await uploadImage(file);
            }
            if (newlink) {
                changedData.IMG = newlink;
            }
            const data = {
                data: { ...changedData },
                IDSanPham: formData.IDSanPham
            };

            axios.put(`${process.env.REACT_APP_LOCALHOST}/employee/products/update`, data, { headers })
                .then(response => {
                    if (response.status >= 200 && response.status < 300) {
                        setSuccess(true);
                        setMessage("Cập nhật thông tin sản phẩm thành công");
                        setShowModal(false);
                    } else {
                        throw new Error("Lấy thông tin thất bại");
                    }
                })
                .catch(error => {
                    setError(true);
                    setMessage(error.response.data.error || "Cập nhật thất bại");
                });
        }
    };

    return (
        <Dialog open={true} onClose={() => setShowModal(false)} fullWidth maxWidth="sm">
            <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center', fontSize: '20px', borderBottom: '1px solid #ddd', paddingBottom: '10px', marginBottom: '10px' }}>
                Cập nhật sản phẩm
                <IconButton 
                    onClick={() => setShowModal(false)}
                    style={{ position: 'absolute', right: 8, top: 8 }}
                >
                    <FontAwesomeIcon icon={faXmark} />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Tên sản phẩm"
                        variant="outlined"
                        fullWidth
                        name="TenSP"
                        value={formData.TenSP}
                        onChange={handleChange}
                        margin="normal"
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Loại sản phẩm</InputLabel>
                        <Select
                            label="Loại sản phẩm"
                            name="IDLoaiSanPham"
                            value={formData.IDLoaiSanPham}
                            onChange={handleChange}
                        >
                            {category && category.map((value) => (
                                <MenuItem key={value.IDLoaiSanPham} value={value.IDLoaiSanPham}>
                                    {value.TenLoaiSanPham}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        label="Mô tả"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={4}
                        name="Mota"
                        value={formData.Mota}
                        onChange={handleChange}
                        margin="normal"
                    />
                    <TextField
                    label="Đơn giá"
                    variant="outlined"
                    fullWidth
                    type="number"
                    name="DonGia"
                    value={formData.DonGia}
                    onChange={(e) => {
                        const value = e.target.value >= 0 ? e.target.value : 0;
                        handleChange({ target: { name: "DonGia", value } });
                    }}
                    inputProps={{ min: 0 }}
                    margin="normal"
                    />

                    <TextField
                        label="Giảm giá (%)"
                        variant="outlined"
                        fullWidth
                        type="number"
                        name="Discount"
                        value={formData.Discount}
                        onChange={(e) => {
                            let value = e.target.value;
                            value = value < 0 ? 0 : value > 100 ? 100 : value;
                            handleChange({ target: { name: "Discount", value } });
                        }}
                        inputProps={{ min: 0,max:100 }}
                        margin="normal"
                    />
                    <FormControl fullWidth margin="normal">
                        <input
                            type="file"
                            id="IMG"
                            name="IMG"
                            style={{ display: 'none' }}
                            accept="image/*"
                            onChange={handleChange}
                        />
                        <label htmlFor="IMG">
                            <Button variant="contained" component="span" style={{ marginBottom: '10px' }}>
                                Chọn hình ảnh
                            </Button>
                        </label>
                        {formData.IMG && (
                            <img
                                src={formData.IMG}
                                alt="Product"
                                style={{ width: '100%', maxHeight: '300px', objectFit: 'contain' }}
                            />
                        )}
                    </FormControl>
                    {/* <TextField
                        label="Số lượng tồn kho"
                        variant="outlined"
                        fullWidth
                        type="number"
                        name="SoLuong"
                        value={formData.SoLuong}
                        onChange={handleChange}
                        margin="normal"
                    /> */}
                    <TextField
    label="Số lượng tồn kho"
    variant="outlined"
    fullWidth
    type="number"
    name="SoLuong"
    value={formData.SoLuong}
    onChange={(e) => {
        const value = e.target.value >= 0 ? e.target.value : 0;
        handleChange({ target: { name: "SoLuong", value } });
    }}
    inputProps={{ min: 0 }}
    margin="normal"
/>
                    <Button type="submit" variant="contained" color="primary" style={{ marginTop: '20px', width: '150px', marginLeft: '35%' }}>
                        Lưu
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default UpdateProductModal;
