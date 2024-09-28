
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // เพิ่ม useParams
import { CreateOrder, CreateProductsOrder, GetProductsById ,CreateRoomChat,GetMemberBySeller,UpProductsById} from '../../../services/http/index';
import "./BuyProducts.css";
import { message ,Avatar ,Rate} from "antd";
import '../../Review/ReviewSeller/ReviewSeller.css';
import NavbarMember from "../../../component/navbarMember.tsx";
import axios from 'axios';


interface Products {
  Title?: string;
  Price: number;
  PictureProduct: string;
  Description: string;
  SellerID: number;
  Status?: String;

}

interface MemberBySeller {
  MemberID: number;
  FirstName: string;
  LastName: string;
  ProfilePic: string;
  SellerID: string;
}

interface Review {
  ID: number;
  Rating: number;
  ProductsID: number;
  Comment: string;
  MemberID: number;
}

interface Member {
  ID: number;
  Username: string;
  ProfilePic: string;
}

const Byproduct: React.FC = () => {
  const [product, setProduct] = useState<Products | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();
  const [memberId, setMemberId] = useState<number | null>(null);
  const MemberID = Number(localStorage.getItem("id"));
  const [seller, setSeller] = useState<MemberBySeller | null>(null);
  const [isShopRatingVisible, setIsShopRatingVisible] = useState(false);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [reviewCount, setReviewCount] = useState<number>(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [members, setMembers] = useState<Member[]>([]);


  const { id } = useParams<{ id: string }>();
  const productId = Number(id);


  useEffect(() => {
    const fetchProduct = async () => {
      const data: Products = await GetProductsById(productId);
      if (data) {
        setProduct(data);
      }
    };
    fetchProduct();
    setMemberId(MemberID);
  }, [productId]);


  const handleShopRating = () => {
    setIsShopRatingVisible(true);
  };

  const closeShopRating = () => {
    setIsShopRatingVisible(false);
  };


  useEffect(() => {
    const fetchProductAndSeller = async () => {
      const data: Products = await GetProductsById(productId);
      if (data) {
        setProduct(data);
        const sellerData = await GetMemberBySeller(data.SellerID);
        if (sellerData) {
          setSeller(sellerData);
        }
      }
    };
    fetchProductAndSeller();
  }, [productId]);
  

  const handleBuyProduct = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleChatWithSeller = async () => {
    if (memberId !== null && product) {
      // ตรวจสอบว่า member กับ seller เป็นคนเดียวกันหรือไม่
      if (memberId === product.SellerID) {
        setErrorMessage("ไม่สามารถแชทกับผู้ขายได้");
        return;
      }
      const result = await CreateRoomChat(memberId, product.SellerID);
      
      if (result) {
        if (result.message === "Room already exists") {
          navigate('/ChatBuyer');
        } else {
          navigate('/ChatBuyer');
        }
      } else {
        setErrorMessage(result.message || "เกิดข้อผิดพลาดในการสร้างห้องแชท");
      }
    }
  };
  


  useEffect(() => {
    const fetchReviews = async () => {
      try {
        if (product?.SellerID) {
          const response = await axios.get<Review[]>(`http://localhost:8000/review/seller/${product.SellerID}`);
          if (Array.isArray(response.data)) {
            setReviews(response.data);
          } else {
            console.error('Data is not an array:', response.data);
          }
        }
      } catch (error) {
        console.error('Error fetching reviews', error);
      }
    };

    const fetchMembers = async () => {
      try {
        const response = await axios.get<Member[]>(`http://localhost:8000/member`);
        if (Array.isArray(response.data)) {
          setMembers(response.data);
        } else {
          console.error('Data is not an array:', response.data);
        }
      } catch (error) {
        console.error('Error fetching members', error);
      }
    };

    fetchReviews();
    fetchMembers();
  }, [product?.SellerID]);


  const calculateAverageRating = () => {
    let totalRating = 0;
    let totalReviews = reviews.length;

    reviews.forEach((review) => {
      totalRating += review.Rating;
    });

    if (totalReviews > 0) {
      setAverageRating(totalRating / totalReviews);
      setReviewCount(totalReviews);
    } else {
      setAverageRating(null);
      setReviewCount(0);
    }
  };

  useEffect(() => {
    if (true) {
      calculateAverageRating();
    }
  }, [, reviews]);


  const confirmOrder = async () => {
    try {
      if (product && memberId !== null) {
        const orderData = {
          MemberID: memberId,
          SellerID: product.SellerID,
          Quantity: 1,
          Total_price: product.Price,
        };
        
        const result = await CreateOrder(orderData);
  
        if (result) {
          const OrderID = result.data.ID;
          const productsOrderData = {
            OrderID: OrderID,
            ProductID: productId,
          };
  
          await CreateProductsOrder(productsOrderData);

          const Productsdata: Products = {
            ...product,
            Status: 'NonAvailable',
          };
          await UpProductsById(productId, Productsdata);
  
          message.success("ซื้อสินค้าสำเร็จ!");
        } else {
          throw new Error("ไม่สามารถสร้างคำสั่งซื้อได้");
        }
      }
    } catch (error) {
      console.error("Error during order creation:", error);
      message.error("เกิดข้อผิดพลาดในการซื้อสินค้า กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsModalVisible(false);
    }
  };
  
  
  
  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="Buyproducts">
      <NavbarMember />
      <h1 className="Buyproducts-h1"
        style={{
          marginTop: "40px",
          fontSize: "30px",
          fontWeight: "bold",
        }}
      >
        {isModalVisible && (
        <div className="custom-modal">
          <div className="modal-content">
            <p>ต้องการซื้อสินค้าใช่หรือไม่</p>
            <div className="modal-actions">
              <button onClick={handleCloseModal} className="cancel-button" >ยกเลิก</button>
              <button onClick={confirmOrder} className="confirm-button">ยืนยัน</button>
            </div>
          </div>
        </div>
      )}
        {product.Title}
      </h1>
      <h2 className="Buyproducts-h2" >฿{product.Price}</h2>
      <div className="frame-1">
        <img src={product.PictureProduct} alt="Product" />
      </div>
      <button className="Buy-products" onClick={handleBuyProduct}>
        ซื้อสินค้า
      </button>
      <button className="Chat" onClick={handleChatWithSeller}>
        แชทกับผู้ขาย
      </button>

      <div className="rectangle">
        <h1>{product.Description}</h1>
      </div>

      <div className="seller-info">
        {seller && (
          <div className="seller-container">
            <Avatar
              src={seller?.ProfilePic}
              alt={`Contact ${seller?.FirstName || "Unknown Seller"}`}
              className="custom-avatar"
            />
            <p className="seller-name">
              {seller?.FirstName} {seller?.LastName}
            </p>
          </div>
        )}
      </div>
      <div className="review-page-Bymember">
  <p>คะแนนเฉลี่ย: {averageRating?.toFixed(2)} ⭐</p>
  <Rate allowHalf disabled value={averageRating || 0} />
  <p>จำนวนรีวิว: {reviewCount}</p>
  <div className="review-container">
    {reviews.map((review) => {
      const member = members.find((m) => m.ID === review.MemberID);
      return (
        <div
          key={review.ID}
          style={{
            margin: "10px 0",
            padding: "10px",
            border: "1px solid #f0f0f0",
            borderRadius: "5px",
            backgroundColor: "#f4f0ec",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src={member ? member.ProfilePic : "https://via.placeholder.com/10"} 
              alt={member?.Username || "Unknown User"}
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                marginRight: "8px",
                objectFit: "cover",
              }}
            />
            <p style={{ margin: 0 }}>
              <strong>{member ? member.Username : "Unknown User"}</strong>
            </p>
          </div>
          <p>คะแนน: <Rate allowHalf disabled value={review.Rating} /></p>
          <p>ความคิดเห็น: {review.Comment}</p>
        </div>
      );
    })}
  </div>
</div>

    </div>
  );
};

export default Byproduct;
function setErrorMessage(arg0: any) {
  throw new Error("Function not implemented.");
}

