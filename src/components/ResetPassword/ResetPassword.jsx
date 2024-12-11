import React, { useState } from "react";
import style from "./style.module.css";
import axios from "axios";
import { useAnnouncement } from "../../contexts/Announcement";

function ResetPassword(){
    const [currentPW, setCurrentPW] = useState("");
    const [newPW, setNewPW] = useState("");
    const [confirmPW, setConfirmPW] = useState("");
    const [dataChanged, setDataChanged] = useState(false); 
    const { setError ,setMessage ,setSuccess } = useAnnouncement();
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
    const updateUser = () => {
        if (!dataChanged) return false;
        const jwt = findCookie('jwt');
        const data = {
            currentPW: currentPW,
            newPW: newPW,
        };
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + jwt,
            'PHPSESSID': findCookie("PHPSESSID")
        };
        axios.put(`${process.env.REACT_APP_LOCALHOST}/user/updatePW`,  data, { headers: headers 
        }).then(response => {
            if(response.status >= 200 && response.status < 300){
                setSuccess(true);
                setMessage(response.data.message);
            }else{
                throw new Error(response.data.message);
            }
        }).catch(error => {
            setError(true);
            setMessage(error.response.data.message);
        });
    };
    const handleUpdateClick = () => {
        if (currentPW.trim() === "" || newPW.trim() === "" || confirmPW.trim() === "") {
            setError(true);
            setMessage('Vui lòng nhập đầy đủ thông tin.');
            return false;
        }

        if (newPW !== confirmPW) {
            setError(true);
            setMessage('Mật khẩu không khớp.');
            return false;
        }

        updateUser();
    }

    const handleResetClick = () => {
        setCurrentPW("");
        setNewPW("");
        setConfirmPW("");
    }

    const handleCurrentPWChange = (e) => {
        setCurrentPW(e.target.value);
        setDataChanged(true);
    }

    const handleNewPWChange = (e) => {
        const password = e.target.value;
        setNewPW(password);
        setDataChanged(true);
    
        const passwordRequirements = [
            { regex: /.{8,}/, message: "Mật khẩu phải có ít nhất 8 ký tự." },
            { regex: /[A-Z]/, message: "Mật khẩu phải có ít nhất một chữ cái viết hoa." },
            { regex: /[a-z]/, message: "Mật khẩu phải có ít nhất một chữ cái thường." },
            { regex: /\d/, message: "Mật khẩu phải có ít nhất một chữ số." },
            { regex: /[@$!%*?&]/, message: "Mật khẩu phải có ít nhất một ký tự đặc biệt (@, $, !, %, *, ?, &)." },
        ];
    
        for (let requirement of passwordRequirements) {
            if (!requirement.regex.test(password)) {
                setError(true);
                setMessage(requirement.message);
                return;
            }
        }
    
        setError(false); 
    };
    

    const handleConfirmPWChange = (e) => {
        setConfirmPW(e.target.value);
        setDataChanged(true);
    }
    return (
        <div className={style.container}>
        <div className={style.group}>
            <label htmlFor="currentPW">Mật khẩu hiện tại</label>
            <input id="currentPW" type="password" value={currentPW} onChange={handleCurrentPWChange} />
        </div>
        <div className={style.group}>
            <label htmlFor="newPW">Mật khẩu mới</label>
            <input id="newPW" type="password" value={newPW} onChange={handleNewPWChange} />
        </div>
        <div className={style.group}>
            <label htmlFor="confirmPW">Xác nhận mật khẩu mới</label>
            <input id="confirmPW" type="password" value={confirmPW} onChange={handleConfirmPWChange} />
        </div>

        <div className={style.action}>
            <div className={style.submit}>
                <button onClick={handleUpdateClick}>
                    Cập nhật thay đổi
                </button>
            </div>
            <div className={style.reset}>
                <button onClick={handleResetClick}>
                    Reset
                </button>
            </div>
        </div>
    </div>
    )
}

export default ResetPassword;