import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Back_arrow from "../assets/back-arrow.png";
import Chat from "../assets/chat.png";
import list from "../assets/list.png";
import Logo from "../assets/logo.png";
import notifications from "../assets/notifications-button.png";
import Shopping from "../assets/shopping-cart.png";
import ShopRating from '../pages/Review/ReviewSeller/ShopRating'; // Import the ShopRating component
import "./NavbarSellerReview.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [isShopRatingVisible, setIsShopRatingVisible] = useState(false); // State for showing/hiding the modal

  const handleReviewSell = () => {
    navigate('/reviewseller');
  };

  const handleShopRating = () => {
    setIsShopRatingVisible(true); // Open the modal
  };

  const closeShopRating = () => {
    setIsShopRatingVisible(false); // Close the modal
  };

  return (
    <div className='navbar'>
      <img
        src={Logo}
        alt="Course Logo"
        style={{
          width: "200px",
          marginRight: "30px",
          marginTop: "0"
        }}
      />
      <div className='right-section'>
        <div className='links'>
          <button className="button-createproduct" onClick={handleReviewSell}>
            รีวิว
          </button>
          <button className="button-createproduct" onClick={handleShopRating}>
            คะแนนร้านค้า
          </button>
          <button className="button-createproduct">
            เพิ่มสินค้า
          </button>

          <div className='imgbox'>
            <img src={Chat} alt="Chat" />
            <img src={Shopping} alt="market" />
            <img src={list} alt="list" />
            <img src={notifications} alt="bell" />
            <img src={Back_arrow} alt="back" />
          </div>
        </div>
      </div>

      {/* ShopRating Modal */}
      <ShopRating
        sellerID={1} // You can replace this with the actual seller ID
        visible={isShopRatingVisible}
        onClose={closeShopRating}
      />
    </div>
  );
};

export default Navbar;