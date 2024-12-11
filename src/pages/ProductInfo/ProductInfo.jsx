import React, { useEffect, useState } from "react";
import style from "./style.module.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus } from "@fortawesome/free-solid-svg-icons";
import { Button, ButtonGroup } from "@mui/material";
import { useAnnouncement } from "../../contexts/Announcement";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../contexts/AuthContext"

function ProductInfo() {
  const { productID } = useParams();
  const [product, setProduct] = useState();
  const [quantity, setQuantity] = useState(1); 
  const navigate = useNavigate();
  const { setSuccess, setError } = useAnnouncement();
  const { isLogin } = useAuth();  

  const handleClickBuy = (SanPham, SoLuong) => {
    SanPham.SoLuong = SoLuong;
    const jsonData = JSON.stringify([SanPham]);
    sessionStorage.setItem("OrderInfo", jsonData);
    navigate("/Order");
  };

  const handleBuyNow = () => {
    if (isLogin) {
      handleClickBuy(product, quantity);
    } else {
      setError("Vui lòng đăng nhập để mua sản phẩm.");
    }
  };

  function AddtoCart(IDSanPham) {
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

    const jwt = findCookie("jwt");
    const data = { IDSanPham: IDSanPham };

    const option = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + jwt,
        PHPSESSID: findCookie("PHPSESSID"),
      },
      body: JSON.stringify(data),
    };

    fetch(`${process.env.REACT_APP_LOCALHOST}/cart/add`, option)
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.error);
        }
        return response.json();
      })
      .then((data) => {
        const message = data.message;
        console.log(message);
        setSuccess("Thêm vào giỏ hàng thành công!"); 
      })
      .catch((error) => {
        // console.error("Lỗi khi thêm vào giỏ hàng", error);
        setError("Lỗi khi thêm vào giỏ hàng"); 
      });
  }

  useEffect(() => {
    fetch(
      `${process.env.REACT_APP_LOCALHOST}/products/info?IDSanPham=${productID}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Lỗi server");
        } else {
          return response.json();
        }
      })
      .then((data) => {
        setProduct(data);
      })
      .catch((error) => {
        console.error("Lỗi khi truy cập dữ liệu", error);
      });
  }, [productID]);

  const handleQuantityChange = (newQuantity) => {
    setQuantity((prevQuantity) => Math.max(prevQuantity + newQuantity, 1)); 
  };

  return (
    <>
      <Header />
      <div className={style.container}>
        <div className={style.left}>
          <img src={product ? product.IMG : ""} alt="" width="50%" />
        </div>
        <div className={style.right}>
          <h1>{product ? product.TenSP : ""}</h1>
          <span>
            Đơn giá:
            <span
              style={{
                color: "red",
                marginLeft: "5px",
                fontSize: "20px",
                fontWeight: "bold",
              }}
            >
              {product
                ? new Intl.NumberFormat("vi-VN").format(product.DonGia)
                : ""}
            </span>{" "}
            VNĐ
            <span
              style={{
                marginLeft: "70px",
                fontSize: "16px",
                fontWeight: "normal",
              }}
            >
              | Đã bán:{" "}
              {product
                ? new Intl.NumberFormat("vi-VN").format(product.DaBan)
                : ""}{" "}
              sản phẩm
            </span>
          </span>

          <div className={style.info}>
            <span>Mô tả:</span>
            <div
              dangerouslySetInnerHTML={{
                __html: product
                  ? "· " + product.Mota.replace(/(\r\n|\n|\r)/g, "<br>· ")
                  : "",
              }}
            />
          </div>

          <div>
            <p> Số lượng </p>
            <ButtonGroup
              size="small"
              aria-label="small outlined button group"
              sx={{ marginLeft: 7, color: "black" }}
            >
              <Button
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity === 1}
              >
                <FontAwesomeIcon icon={faMinus} />
              </Button>
              <Button disabled>{quantity}</Button>
              <Button onClick={() => handleQuantityChange(1)}>
                <FontAwesomeIcon icon={faPlus} />
              </Button>
            </ButtonGroup>

            <div className={style.action}>
              <button
                className={style["CartBtn-1"]}
                onClick={() => {
                  AddtoCart(product.IDSanPham);
                }}
              >
                <FontAwesomeIcon
                  className={style["IconContainer"]}
                  icon={faCartPlus}
                />
                <p className={style["text"]}>Thêm vào giỏ hàng</p>
              </button>

              <button
                className={style["CartBtn-2"]}
                onClick={handleBuyNow}
              >
                <p className={style["text"]}>Mua ngay</p>
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ProductInfo;
