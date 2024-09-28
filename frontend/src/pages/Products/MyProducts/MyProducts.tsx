import { Card, message } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbarproducts from "../../../component/navbarproducts";
import { SellerInterface } from "../../../interfaces/Seller";
import { GetProductsBySellerId, GetSellerByMemberId } from "../../../services/http/index";
import ShopRating from "../../Review/ReviewSeller/ShopRating";
import "./MyProducts.css";

const { Meta } = Card;

interface Products {
  ID: number;
  Title: string;
  Price: number;
  PictureProduct: string;
  Description: string;
  SellerID: number;
  OrderID?: number;
}

const Index: React.FC = () => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [seller, setSeller] = useState<SellerInterface | null>(null);
  const [sellerId, setSellerId] = useState<number | null>(null);
  const [products, setProducts] = useState<Products[]>([]);
  const [isShopRatingVisible, setIsShopRatingVisible] = useState(false);



  const fetchProductsBySellerId = async (sellerId: number) => {
    const res = await GetProductsBySellerId(sellerId, 1, 10);
    if (res) {
      const availableProducts = res.products.filter((product: Products) => product.Status === 'Available');
      setProducts(availableProducts);
    } else {
      messageApi.error("Error fetching products for seller");
    }
  };



  const fetchSeller = async (member_id: number) => {
    const res = await GetSellerByMemberId(member_id);
    if (!res.error) {
      setSeller(res.seller);
      setSellerId(res.seller_id);
      fetchProductsBySellerId(res.seller_id);
    } else {
      message.error(res.error);
    }
    console.log("Form values:", res);
  };


  useEffect(() => {
    const memberId = Number(localStorage.getItem("id"));
    if (memberId) {
      fetchSeller(memberId);
    }
  }, []);

  const handleToEditProduct = (id: number) => {
    
    navigate(`/EditProducts/${id}`);
  };

  const closeShopRating = () => {
    setIsShopRatingVisible(false);
  };


  return (
    <div className="myproductSeller">
      {contextHolder}
      <h1 className="myproduct-h1">My Products</h1>
      <Navbarproducts/>
      <div className="product-list">
      {products.length > 0 ? (
            products.map(product => (
              <Card
                key={product.ID}
                hoverable
                style={{ width: 240, height: 350, margin: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                cover={
                  <img
                    alt={product.Title}
                    src={product.PictureProduct || 'https://via.placeholder.com/240'}
                    style={{ width: '100%', height: '210px', objectFit: 'cover' }}
                  />
                }
                onClick={() => handleToEditProduct(product.ID)}
              >
                <Meta title={product.Title} description={`ราคา: ${product.Price} บาท`} />
              </Card>
            ))
          ) : (
            <p>ไม่มีสินค้าที่แสดงผล</p>
          )}
      </div>
      <ShopRating
        sellerID={sellerId}
        visible={isShopRatingVisible}
        onClose={closeShopRating}
      />
    </div>
  );
};

export default Index;
