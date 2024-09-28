import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react'; // เพิ่มการนำเข้า useState
import "./NavbarReview.css";
import Logo from "../assets/logo.png";
import list from "../assets/list.png";
import market from "../assets/shopping-cart.png";
import bell from "../assets/bell.png";
import Back from "../assets/back-arrow.png";


const NavbarReview = () => {
  const navigate = useNavigate(); // Hook for navigation
  const [Title, setSearchTitle] = useState<string>(""); // State สำหรับคำค้นหา

  const handleHomeMember = () => {
    navigate('/HomeMember'); // Navigate to ApplyToSeller page
  };

  // ฟังก์ชันสำหรับจัดการการค้นหา
  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && Title.trim()) {
      navigate(`/search/${Title}`); // นำทางไปยัง path ที่ต้องการ
    }
  };

  const handleCreateProduct = () => {
    navigate('/Card'); // Navigate to ApplyToSeller page
  };

  const handleApplySeller = () => {
    navigate('/apply-to-seller'); // Navigate to ApplyToSeller page
  };

  return (
    <div className='navbarreview'>
      <img
        src={Logo}
        alt="Course Logo"
        style={{
          width: "200px",
          marginRight: "20px",
          marginTop: "0px"
        }}
      />
      <div className='right-sectionmember'>
        <div className='linksmember'>
          <div className="search">
            <input
              type="text"
              placeholder="ค้นหา"
              value={Title}
              onChange={(e) => setSearchTitle(e.target.value)} // อัปเดตคำค้นหา
              onKeyPress={handleSearch} // เรียกใช้ฟังก์ชันเมื่อกด Enter
            />
          </div>
          <button className="button-createproductmember" onClick={handleApplySeller} >
            สร้างการขายสินค้า
          </button>
          <div className="box-NavbarReview">
            <img src={market} alt="market" onClick={handleCreateProduct}/>
            <img src={list} alt="list"/>
            <img src={bell} alt="bell"/>
            <img src={Back} alt="Back" onClick={handleHomeMember}/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavbarReview;
