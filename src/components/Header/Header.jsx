import React, { useState, useRef, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import UserPackage from "../UserPackage/UserPackage";
import { useAnnouncement } from "../../contexts/Announcement";
import Announcement from "../Announcement/Announcement";
import style from "./style.module.css";
import { useNavigate } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import UserPTPackage from "../UserPTPackage/UserPTPackage";
import ManagePTRegist from "../ManagePTRegist/ManagePTRegist";
import PTManageSchedule from "../PT_Manage_Schedule/PTManageSchedule";

function Header() {
  const [showModal, setShowModal] = useState(false);
  const [showPTModal, setShowPTModal] = useState(false);
  const [showRegistPTModal, setShowRegistPTModal] = useState(false);
  const [showShedulePT, setShowShedulePT] = useState(false);
  const [setCart] = useState(false);
  const cartRef = useRef(null);
  const { isLogin, user } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const {
    error,
    success,
    warning,
    setError,
    setSuccess,
    setMessage,
    setLocation,
  } = useAnnouncement();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setCart(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [setCart]);

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
    const jwt = findCookie("jwt");
    if (jwt) {
      const option = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwt,
          PHPSESSID: findCookie("PHPSESSID"),
        },
      };
      fetch(`${process.env.REACT_APP_LOCALHOST}/cart`, option)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Lỗi server");
          }
          return response.json();
        })
        .then((data) => {
          setCartCount(data.length);
        })
        .catch((error) => {
          console.error("Lỗi khi lấy dữ liệu:", error);
        });
    }
  }, [isLogin]);

  const validTabPaths = ["/", "/shop", "/PT", "/info", "/GymPack"];

  const tabValue = validTabPaths.includes(location.pathname)
    ? location.pathname
    : false;

  function Logout() {
    const jwt = findCookie("jwt");
    const phpSessionId = findCookie("PHPSESSID");

    if (!jwt || !phpSessionId) {
      console.error("Không tìm thấy thông tin đăng nhập.");
      setError(true);
      setMessage("Đăng xuất thất bại. Vui lòng thử lại.");
      return;
    }

    const option = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + jwt,
        PHPSESSID: phpSessionId,
      },
    };

    fetch(`${process.env.REACT_APP_LOCALHOST}/logout`, option)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Đăng xuất thất bại. Server trả về lỗi.");
        }
        return response.json();
      })
      .then((data) => {
        document.cookie = "jwt=; Max-Age=-1; path=/;";
        document.cookie = "PHPSESSID=; Max-Age=-1; path=/;";

        setSuccess(true);
        setMessage(data.message || "Đăng xuất thành công");
        setLocation(true);
        navigate("/login");
      })
      .catch((error) => {
        console.error(error);
        setError(true);
        setMessage("Đăng xuất thất bại. Vui lòng thử lại.");
      });
  }
  return (
    <header className={style.header}>
      <div className={style["wrap-logo"]}>
        <div className={style.logo}>
          <a href="/">
            <img
              src="https://i.imgur.com/n63xUfG.jpeg"
              alt="logo"
              width="100%"
            />
          </a>
        </div>
      </div>
      <div className={style.navbar}>
        <Tabs
          value={tabValue}
          className={style.TabsList}
          aria-label="navigation tabs"
        >
          <Tab
            label="Trang chủ"
            component={Link}
            to="/"
            value="/"
            className={style.Tab}
          />
          <Tab
            label="Shop"
            component={Link}
            to="/shop"
            value="/shop"
            className={style.Tab}
          />
          <Tab
            label="HLV Cá Nhân"
            component={Link}
            to="/PT"
            value="/PT"
            className={style.Tab}
          />
          <Tab
            label="Giới thiệu"
            component={Link}
            to="/info"
            value="/info"
            className={style.Tab}
          />
          <Tab
            label="Gói tập"
            component={Link}
            to="/GymPack"
            value="/GymPack"
            className={style.Tab}
          />
        </Tabs>
      </div>
      <div className={style.nav_item}>
        {!isLogin && (
          <button onClick={() => (window.location.href = "/login")}>
            Luyện tập ngay
          </button>
        )}
        <div className={style["shopyfi"]} style={{ position: "relative" }}>
          <ShoppingCartIcon
            onClick={() => {
              if (!isLogin) {
                setError(true);
                setMessage("Vui lòng đăng nhập!");
              } else {
                navigate("/cart");
              }
            }}
            style={{ fontSize: "24px" }}
          />
          {cartCount > 0 && (
            <span className={style.cartBadge}>{cartCount}</span>
          )}
        </div>

        {user && isLogin && (
          <div className={style["user"]}>
            <img src={user.avt} alt="user" width="100%" />
            <p>{user.HoTen}</p>
            <ul className={style["dropdown-content"]}>
              {user.IDHLV === null && (
                <>
                  <li>
                    <Link to="/account-setting">Thông tin tài khoản</Link>
                  </li>
                  <li onClick={() => setShowModal(true)}>
                    <Link to="#">Thông tin gói tập</Link>
                  </li>
                  <li>
                    <Link to="/PurchaseOrder">Đơn hàng</Link>
                  </li>
                  <li onClick={() => setShowPTModal(true)}>
                    <Link to="#">Thông tin thuê PT</Link>
                  </li>
                  <li onClick={() => setShowRegistPTModal(true)}>
                    <Link to="#">Thông tin đăng ký HLV</Link>
                  </li>
                </>
              )}
              {user.IDHLV !== null && (
                <>
                  <li>
                    <Link to="/account-setting">Thông tin tài khoản</Link>
                  </li>
                  <li>
                    <Link to="/PurchaseOrder">Đơn hàng</Link>
                  </li>
                  <li onClick={() => setShowShedulePT(true)}>
                    <Link to="#">Thông tin lịch dạy</Link>
                  </li>
                  <li onClick={() => setShowRegistPTModal(true)}>
                    <Link to="#">Thông tin đăng ký HLV</Link>
                  </li>
                </>
              )}
              <li onClick={Logout}>Đăng xuất</li>
            </ul>
          </div>
        )}
      </div>
      {showModal && <UserPackage setShowModal={setShowModal} />}
      {showPTModal && <UserPTPackage setShowModal={setShowPTModal} />}
      {showRegistPTModal && (
        <ManagePTRegist setShowModal={setShowRegistPTModal} />
      )}
      {showShedulePT && <PTManageSchedule setShowModal={setShowShedulePT} />}
      {error || success || warning ? <Announcement /> : null}
    </header>
  );
}

export default Header;
