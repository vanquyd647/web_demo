import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLogin, setIsLogin] = useState(false);

    // const login = async (credentials) => {
    //     try {
    //         console.log(credentials)
    //         const response = await axios.post('${process.env.REACT_APP_LOCALHOST}/login', credentials, {
    //             withCredentials: true,
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 // 'User-Agent': 'WEB'
    //             }
    //         });
    //         const data = response.data;
    //         console.log(data)
    //         // if(user){
    //         //     user.TrangThai = user.TrangThai === 0 ? 'offline' : 'online';
    //         // }
    //         const { user } = data;
    //         setUser(user);
    //         setIsLogin(true);
    //         return { success: true , roleID: user.IDVaiTro };
    //     } catch (error) {
    //         console.error('Error', error.message);
    //         return { success: false, message: 'Kiểm tra lại thông tin' };
    //     }
    // };

    const login = async (credentials) => {
        try {
            // console.log(credentials)
            const response = await axios.post(`${process.env.REACT_APP_LOCALHOST}/login`, credentials, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    // 'User-Agent': 'WEB'
                }
            });
            const data = response.data;
            // console.log(data)
            // if(user){
            //     user.TrangThai = user.TrangThai === 0 ? 'offline' : 'online';
            // }
            const { user } = data;
            setUser(user);
            setIsLogin(true);
            return { success: true , roleID: user.IDVaiTro };
        } catch (error) {
            console.error('Error', error.message);
            return { success: false, message: 'Kiểm tra lại thông tin' };
        }
    };

    const logout = async () => {
        const jwt = findCookie('jwt');
        const phpSessionId = findCookie('PHPSESSID');
        if (!jwt || !phpSessionId) {
            console.error("No valid session found.");
            return;
        }
    
        try {
            const response = await fetch(`${process.env.REACT_APP_LOCALHOST}/logout`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt}`,
                    'PHPSESSID': phpSessionId
                },
            });
    
            if (response.ok) {
                const data = await response.json();
                console.log(data.message); // Hiển thị thông báo từ server (nếu có)
                
                // Xóa cookie sau khi server phản hồi thành công
                document.cookie = 'jwt=; Max-Age=-1; path=/;';
                document.cookie = 'PHPSESSID=; Max-Age=-1; path=/;';
    
                // Cập nhật trạng thái người dùng
                setUser(null);
                setIsLogin(false);
    
                // Điều hướng sau khi đăng xuất thành công
                window.location.href = '/'; // Redirect về trang chủ hoặc trang login
            } else {
                throw new Error('Failed to logout.');
            }
        } catch (error) {
            console.error('Logout Error:', error.message);
        }
    };
    

    useEffect(() => {
        const jwt = findCookie('jwt');
        if (jwt && !user) {
            setIsLogin(true);
            fetchUserInfo();
        }
    }, [user]);
    
    const fetchUserInfo = () => {
        const jwt = findCookie('jwt');
        if (jwt) {
            const option = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + jwt,
                    'PHPSESSID': findCookie("PHPSESSID")
                }
            }
            fetch(`${process.env.REACT_APP_LOCALHOST}/user/Info`, option)
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error(response.error);
                    }
                })
                .then(data => {
                    // data.TrangThai = data.TrangThai === 0 ? 'offline' : 'online';
                    setUser(data);
                })
                .catch(error => {
                    console.error(error);
                });
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

    return (
        <AuthContext.Provider value={{ user, login, logout, isLogin,fetchUserInfo }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);