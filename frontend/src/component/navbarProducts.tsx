import { UserOutlined } from "@ant-design/icons";
import { Avatar, message } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SellerInterface } from "../../src/interfaces/Seller";
import Logo from "../assets/logonew.png";
import SongThor from "../component/LogoText";
import { MemberInterface } from "../interfaces/Member";
import ShopRating from "../pages/Review/ReviewSeller/ShopRating";
import { GetMemberById, GetSellerByMemberId } from "../services/http/index";
import "./navbarProducts.css";

const Navbarproductsber = () => {
  const [uid, setUid] = useState<number | null>(
    Number(localStorage.getItem("id"))
  );
  const [messageApi, contextHolder] = message.useMessage();
  const [users, setUsers] = useState<MemberInterface | null>(null);
  const [isShopRatingVisible, setIsShopRatingVisible] = useState(false); // State for showing/hiding the modal
  const MemberID = Number(localStorage.getItem("id"));
  const [seller, setSeller] = useState<SellerInterface | null>(null);
  const [sellerID, setSellerId] = useState<number | null>(null);

  const fetchSellerData = async () => {
    try {
      const sellerData = await GetSellerByMemberId(MemberID);
      console.log("Seller data from API: ", sellerData); // ตรวจสอบข้อมูลที่ได้จาก API
      setSeller(sellerData.seller);
      setSellerId(sellerData.seller_id); // เก็บข้อมูล seller ใน state
    } catch (error) {
      console.error("Error fetching seller data:", error);
    }
  };

  const GetMemberid = async (user_id: number) => {
    let res = await GetMemberById(user_id);

    if (res.status == 200) {
      setUsers(res.data);
    } else {
      messageApi.open({
        type: "error",

        content: res.data.error,
      });
    }
  };

  const handleShopRating = () => {
    setIsShopRatingVisible(true); // Open the modal
    fetchSellerData();
  };

  const closeShopRating = () => {
    setIsShopRatingVisible(false); // Close the modal
  };

  useEffect(() => {
    setUid(Number(localStorage.getItem("id")));
    console.log(uid);
    GetMemberid(uid); // ดึงข้อมูลผู้ใช้เมื่อหน้าโหลด
  }, []);

  // State to manage the sidebar collapse
  const [isCollapsed, setIsCollapsed] = useState(true);
  const navigate = useNavigate(); // Hook for navigation

  // Toggle sidebar function
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const Logout = () => {
    localStorage.clear();
    messageApi.success("Logout successful");
    setTimeout(() => {
      location.href = "/";
    }, 2000);
  };

  const handleToHoproductsember = () => {
    navigate("/HomeSeller"); // Navigate to ApplyToSeller page
  };

  const handleToProfile = () => {
    navigate("/Profile"); // Navigate to ApplyToSeller page
  };

  const handleToProfileEdit = () => {
    navigate("/Profile/ProfileEdit/:id"); // Navigate to ApplyToSeller page
  };

  const handleToOrder = () => {
    navigate("/OrderBySeller"); // Navigate to ApplyToSeller page
  };

  const handleToMyReview = () => {
    navigate("/ProductSeller"); // Navigate to ApplyToSeller page
  };
  const handleToChatBuyer = () => {
    navigate("/ChatBuyerBySeller"); // Navigate to ApplyToSeller page
  };

  const handleToChatSeller = () => {
    navigate("/ChatSeller"); // Navigate to ApplyToSeller page
  };
  const handleToMyOrder = () => {
    navigate("/MyOrder"); // Navigate to ApplyToSeller page
  };
  const handleToMyscore = () => {
    navigate("/ReviewSeller"); // Navigate to ApplyToSeller page
  };
  const handleToMyProducts = () => {
    navigate("/MyProducts"); // Navigate to ApplyToSeller page
  };
  const handleToCreateProducts = () => {
    navigate("/createproducts"); // Navigate to ApplyToSeller page
  };

  return (
    <html lang="en" dir="ltr">
      {contextHolder}
      <head>
        <meta charSet="utf-8"></meta>
        <title>Sidebar Dashboard Template with Sub Menu</title>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"
        ></link>
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/brands.min.css"
          charSet="utf-8"
        ></script>
      </head>
      <body>
        <div
          className={`wrapperproducts ${isCollapsed ? "collapseproducts" : ""}`}
        >
          <div className="headerproducts">
            <div className="header-menuproducts">
              <div className="titleproducts">
                <img src={Logo} className="navproductslogo" alt="logo" />
                <SongThor />{" "}
              </div>
              <div className="sidebar-btnproducts" onClick={toggleSidebar}>
                <i className="fa-solid fa-bars"></i>
              </div>

              <ul>
                <li>
                  <button
                    className="button-createproductproducts"
                    onClick={handleToMyReview}
                  >
                    รีวิว
                  </button>
                </li>

                <li>
                  <button
                    className="button-createproductproducts"
                    onClick={handleShopRating}
                  >
                    คะแนนร้านค้า
                  </button>
                </li>

                <li>
                  <button
                    className="button-createproductproducts"
                    onClick={handleToCreateProducts}
                  >
                    เพิ่มสินค้า
                  </button>
                </li>

                <li>
                  <a onClick={handleToOrder}>
                    <i className="fa-solid fa-cart-shopping"> </i>{" "}
                  </a>
                </li>
                <li>
                  <a>
                    <i className="fa-solid fa-power-off" onClick={Logout}>
                      {" "}
                    </i>{" "}
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="siderbarproducts">
            <div className="sidebar-menuproducts">
              <center className="profileproducts">
                <Avatar
                  size={250}
                  src={users?.ProfilePic || undefined}
                  icon={!users?.ProfilePic && <UserOutlined />}
                />
              </center>
              <center>
                <label className="username">
                  {users?.Username}{" "}
                  <i
                    className="fas fa-pen-to-square"
                    onClick={handleToProfileEdit}
                  ></i>{" "}
                </label>
              </center>
              <li className="itemproducts" onClick={handleToHoproductsember}>
                <a href="#" className="menu-btnproducts">
                  <i className="fas fa-house"></i> <span>Home</span>
                </a>
              </li>
              <li className="itemproducts" id="profile">
                <a href="#profile" className="menu-btnproducts">
                  <i className="fas fa-user-circle"> </i>
                  <span>
                    Profile{" "}
                    <i className="fas fa-chevron-down drop-downproducts"></i>
                  </span>
                </a>
                <div className="sub-menuproducts">
                  <a onClick={handleToProfile}>
                    {" "}
                    <i className="fas fa-user"></i>
                    <span>MyProfile</span>
                  </a>
                  <a onClick={handleToOrder}>
                    {" "}
                    <i className="fas fa-bag-shopping"></i>
                    <span>คำสั่งซื้อของฉัน</span>
                  </a>
                  <a onClick={handleToMyReview}>
                    {" "}
                    <i className="fas fa-star"></i>
                    <span>MyReview</span>
                  </a>
                </div>
              </li>

              <li className="itemproducts" id="messages">
                <a href="#messages" className="menu-btnproducts">
                  <i className="fas fa-brands fa-weixin"> </i>
                  <span>
                    Messages{" "}
                    <i className="fas fa-chevron-down drop-downproducts"></i>
                  </span>
                </a>
                <div className="sub-menuproducts">
                  <a onClick={handleToChatBuyer}>
                    {" "}
                    <i className="fas fa-brands fa-rocketchat"></i>
                    <span>ChatBuyer</span>
                  </a>
                  <a onClick={handleToChatSeller}>
                    {" "}
                    <i className="fas fa-envelope"></i>
                    <span>ChatSeller</span>
                  </a>
                </div>
              </li>
              <li className="itemproducts" id="shop">
                <a href="#shop" className="menu-btnproducts">
                  <i className="fas fa-shop"> </i>
                  <span>
                    Market{" "}
                    <i className="fas fa-chevron-down drop-downproducts"></i>
                  </span>
                </a>
                <div className="sub-menuproducts">
                  <a onClick={handleToMyOrder}>
                    {" "}
                    <i className="fas fa-cubes"></i>
                    <span>MyOrder</span>
                  </a>
                  <a onClick={handleToMyscore}>
                    {" "}
                    <i className="fas fa-trophy"></i>
                    <span>Myscore</span>
                  </a>
                  <a onClick={handleToMyProducts}>
                    {" "}
                    <i className="fas fa-solid fa-shapes"></i>
                    <span>MyProducts</span>
                  </a>
                </div>
              </li>
            </div>
          </div>
          <div className="main-containerproducts"></div>
        </div>
        <ShopRating
          sellerID={sellerID}
          visible={isShopRatingVisible}
          onClose={closeShopRating}
        />
      </body>
    </html>
  );
};

export default Navbarproductsber;
