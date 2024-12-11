import React, { useEffect, useState } from "react";
import style from "./style.module.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Button from "@mui/material/Button";

function HomeContent() {
  // eslint-disable-next-line
  const [pts, setPts] = useState([]);
  // eslint-disable-next-line
  const [products, setProducts] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_LOCALHOST}/home`)
      .then((response) => {
        setPts(response.data[0]);
        setProducts(response.data[1]);
      })
      .catch((error) => {
        console.log(error.response.data.error);
      });
  }, [user]);

  // const services = [
  //   {
  //     id: "1",
  //     title: "Lớp Yoga cho mọi cấp độ",
  //     description:
  //       "Khám phá các lớp Yoga cho tất cả các cấp độ, giúp bạn cải thiện sức khỏe và tinh thần. Tham gia ngay hôm nay để cảm nhận sự khác biệt!",
  //     image: "https://i.imgur.com/MzkR2X7.jpg",
  //     price: "1,000,000 VND/tháng",
  //   },
  //   {
  //     id: "3",
  //     title: "Lớp Zumba vui nhộn",
  //     description:
  //       "Tham gia lớp Zumba để vừa giảm cân vừa giải trí. Cảm nhận năng lượng và sự vui vẻ mỗi buổi học.",
  //     image: "https://i.imgur.com/FvQLByj.jpg",
  //     price: "800,000 VND/tháng",
  //   },
  //   {
  //     id: "4",
  //     title: "Khóa học HIIT giảm mỡ hiệu quả",
  //     description:
  //       "Khóa học HIIT giúp bạn đốt cháy calo, giảm mỡ hiệu quả. Đừng bỏ lỡ chương trình khuyến mãi đặc biệt!",
  //     image: "https://i.imgur.com/7YH5Z9z.jpg",
  //     price: "1,200,000 VND/tháng",
  //   },
  // ];

  return (
    <main id={style.container}>
      <div className={style["container-item-1"]}>
        <div className={style["left-item"]}>
          <img
            src="https://i.imgur.com/iYwRZz1.jpg"
            alt="nothing"
            width="100%"
          />
        </div>
        <div className={style["right-item"]}>
          <h1>Chào mừng bạn đến GOAT FITNESS</h1>
          <h2 style={{marginTop:"10px"}}>
            Chúng tôi có đội ngũ huấn luyện viên được đào tạo chuyên nghiệp. Hãy
            để chúng tôi thay đổi cuộc sống của bạn.
          </h2>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#081158",
              color: "#fff",
              padding: "12px 24px",
              borderRadius: "8px",
              marginTop: "20px",
              "&:hover": {
                backgroundColor: "#1974D3",
              },
            }}
            component={Link}
            to="/PT/"
          >
            Tìm kiếm HLV
          </Button>
        </div>
      </div>

      <div className={style["container-item-2"]}>
        <h4>3 Năm xây dựng thương hiệu</h4>
        <h4>Đội ngũ PT có kinh nghiệm cao</h4>
        <h4>Đã có hơn 10 nghìn người tham gia</h4>
      </div>

      <div className={style["container-item-3"]}>
        <h1>
          Hãy bắt đầu hành trình để có một cơ thể khỏe mạnh hơn ngay từ bây giờ
        </h1>
        <div className={style["wrap-trip"]}>
          <div className={style.trip}>
            <img
              src="https://i.imgur.com/csieszj.jpg"
              alt="nothing"
              width="50%"
              height="80%"
            />
            <div className={style["wrap-content"]}>
              <h2 style={{ fontSize: "20px" }}>
                Học cách sống khỏe mạnh nhờ tập thể dục
              </h2>
              <p style={{ fontSize: "16px" }}>
                Tập thể dục là phương pháp hiệu quả để duy trì sức khỏe toàn
                diện và cải thiện tinh thần. Nó không chỉ giúp tăng cường sức
                khỏe tim mạch, kiểm soát cân nặng mà còn giảm căng thẳng, nâng
                cao sự tự tin. Với một lối sống năng động và thói quen tập luyện
                đều đặn, bạn sẽ cảm nhận được những thay đổi tích cực cả về thể
                chất lẫn tinh thần.
              </p>
            </div>
          </div>
          <div className={style.trip}>
            <img
              src="https://i.imgur.com/sxGxaJO.jpg"
              alt="nothing"
              width="50%"
              height="80%"
            />
            <div className={style["wrap-content"]}>
              <h2 style={{ fontSize: "20px" }}>Thực hiện bài tập đúng cách</h2>
              <p style={{ fontSize: "16px" }}>
                Để đạt được hiệu quả tốt nhất và tránh chấn thương, việc thực
                hiện đúng kỹ thuật trong quá trình tập luyện là rất quan trọng.
                Bạn cần tuân thủ hướng dẫn, không ép bản thân tập quá sức và
                luôn lắng nghe cơ thể mình. Điều này không chỉ giúp tối ưu hóa
                kết quả mà còn bảo vệ bạn khỏi những rủi ro không mong muốn
                trong quá trình tập luyện.
              </p>
            </div>
          </div>
          <div className={style.trip}>
            <img
              src="https://i.imgur.com/lthlcti.jpg"
              alt="nothing"
              width="50%"
              height="80%"
            />
            <div className={style["wrap-content"]}>
              <h2 style={{ fontSize: "20px" }}>
                Theo dõi quá trình của bạn hàng tuần
              </h2>
              <p style={{ fontSize: "16px" }}>
                Việc theo dõi tiến trình hàng tuần giúp bạn đánh giá được sự
                thay đổi và cải thiện của bản thân. Đồng thời, điều này cũng tạo
                điều kiện để bạn điều chỉnh kế hoạch tập luyện khi cần thiết.
                Nhờ đó, bạn sẽ luôn có động lực phấn đấu, tiếp tục cải thiện và
                tiến bộ trong hành trình rèn luyện sức khỏe của mình.
              </p>
            </div>
          </div>
          <div className={style.trip}>
            <img
              src="https://i.imgur.com/zcjP5ZT.jpg"
              alt="nothing"
              width="50%"
              height="80%"
            />
            <div className={style["wrap-content"]}>
              <h2 style={{ fontSize: "20px" }}>
                Thực hiện theo một kế hoạch cụ thể
              </h2>
              <p style={{ fontSize: "16px" }}>
                Thực hiện theo kế hoạch tập luyện rõ ràng giúp bạn tối ưu hóa
                thời gian và năng lượng, tăng khả năng đạt được mục tiêu đề ra.
                Việc có một lộ trình cụ thể không chỉ giúp bạn duy trì động lực
                mà còn hỗ trợ quản lý tốt việc tập luyện, đảm bảo tính liên tục
                và đạt được kết quả lâu dài.
              </p>
            </div>
          </div>
        </div>
      </div>

      
    </main>
  );
}

export default HomeContent;
