
// แก้ไขใหม่ 24/ก.ย./67
import { useState, useEffect } from "react";
import banner1 from "../../assets/brandner.png";
import banner2 from "../../assets/Brandner2.png";
import banner3 from "../../assets/Brandner3.png";
import { Card, Col} from "antd";
import categoryIcon1 from "../../icon/book.png";
import categoryIcon2 from "../../icon/pen.png";
import categoryIcon3 from "../../icon/shoe.png";
import categoryIcon4 from "../../icon/electronics.png";
import categoryIcon5 from "../../icon/clothes.png";
import categoryIcon6 from "../../icon/beuty.png";
import categoryIcon7 from "../../icon/everything.png";
import categoryIcon8 from "../../icon/allItem.png";
import {  GetProducts } from '../../services/http';

import "./home.css";
import Navbar from "../../component/navbar";


const { Meta } = Card;

interface Products {
  ID: number;
  Title: string;
  Price: number;
  PictureProduct: string;
  Description: string;
  SellerID: number;
  OrderID?: number;
  CategoryID?: number;
  Status: string; // New field for product status
}

const bannerImages = [banner1, banner2, banner3];

const HomePage = () => {

  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const [products, setProducts] = useState<Products[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<Products[]>([]);
  


  const fetchProducts = async () => {
    try {
      const result = await GetProducts();
      if (Array.isArray(result)) {
        // Filter only products with status "Available"
        const availableProducts = result.filter(product => product.Status === "Available");
        setProducts(availableProducts);
        setFilteredProducts(availableProducts);
      } else {
        messageApi.open({
          type: "error",
          content: "ข้อมูลที่ได้รับจาก API ไม่ถูกต้อง",
        });
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า",
      });
    }
  };

  // ฟังก์ชันเพื่อเลือกหมวดหมู่สินค้า
  const handleCategoryClick = (categoryId: number) => {
    setSelectedCategory(categoryId);
  
    // กรองสินค้าตาม CategoryID ที่เลือก
    const filtered = products.filter(product => product.CategoryID === categoryId);
    setFilteredProducts(filtered);
  };
  

  useEffect(() => {
    fetchProducts();
    const interval = setInterval(() => {
      setActiveBannerIndex((index) =>
        index === bannerImages.length - 1 ? 0 : index + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (<>
    
    <div className="home-main-page">
      <Navbar/>
      <Col xs={24} sm={24} md={24} lg={24} xl={24}>
        <div className="banner-section">
          <center>
            <img src={bannerImages[activeBannerIndex]} alt="banner" />
          </center>
        </div>
        <div className="category-section">
          <img src={categoryIcon1} alt="category1" className="category-icon" onClick={() => handleCategoryClick(1)} />
          <img src={categoryIcon2} alt="category2" className="category-icon" onClick={() => handleCategoryClick(2)} />
          <img src={categoryIcon3} alt="category3" className="category-icon" onClick={() => handleCategoryClick(3)} />
          <img src={categoryIcon4} alt="category4" className="category-icon" onClick={() => handleCategoryClick(4)} />
          <img src={categoryIcon5} alt="category5" className="category-icon" onClick={() => handleCategoryClick(5)} />
          <img src={categoryIcon6} alt="category6" className="category-icon" onClick={() => handleCategoryClick(6)} />
          <img src={categoryIcon7} alt="category7" className="category-icon" onClick={() => handleCategoryClick(7)} />
          <img src={categoryIcon8} alt="category8" className="category-icon" onClick={() => handleCategoryClick(null)} />
        </div>
        <div className="new-items-header">
          <p>NEW ITEMS</p>
        </div>
        <div
          className="products"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '20px' // กำหนดระยะห่างระหว่างการ์ดแต่ละใบ
          }}
        >
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <Card
                key={product.ID}
                hoverable
                style={{ width: 240, margin: '10px' }} // หรือจะปรับ margin นี้
                cover={<img alt={product.Title} src={product.PictureProduct || 'https://via.placeholder.com/240'} />}
              >
                <Meta title={product.Title} description={`ราคา: ${product.Price} บาท`} />
              </Card>
            ))
          ) : (
            <p 
              style={{
                marginTop:"30px",
                marginBottom:"30px",
                fontSize:"20px",
                fontWeight:"initial",
                }}
            >ไม่มีสินค้าที่แสดงผล</p>
          )}
        </div>

        </Col>
    </div>
  </>);
};

export default HomePage;