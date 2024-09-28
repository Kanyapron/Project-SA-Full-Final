import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './re_bar.css';

const Navbar = () => {
  const [active, setActive] = useState('Review');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // ตั้งค่า active ตาม URL
    const path = location.pathname.split('/')[1]; // แยก path และเลือกส่วนแรก
    if (path === 'ReviewPage') {
      setActive('ReviewPage');
    } else {
      setActive('Review');
    }
  }, [location]);

  const handleClick = (page: string) => {
    setActive(page);
    navigate(`/${page}`);
  };

  return (
    <div className="nav">
      <div className="text-re_bar">
        <p
          onClick={() => handleClick('ProductSeller')}
          className={active === 'Review' ? 'active' : ''}
        >
          ยังไม่ได้รีวิว
        </p>
        <div className="divider"></div>
        <p
          onClick={() => handleClick('ReviewPageSeller')}
          className={active === 'ReviewPage' ? 'active' : ''}
        >
          รีวิวแล้ว
        </p>
      </div>
    </div>
  );
};

export default Navbar;