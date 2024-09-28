
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Rate } from 'antd';
import './ReviewSeller.css';

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

const ShopRating: React.FC<{ sellerID: number; visible: boolean; onClose: () => void; }> = ({ sellerID, visible, onClose }) => {
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [reviewCount, setReviewCount] = useState<number>(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get<Review[]>(`http://localhost:8000/review/seller/${sellerID}`);
        if (Array.isArray(response.data)) {
          setReviews(response.data);
        } else {
          console.error('Data is not an array:', response.data);
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
  }, [sellerID]);

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
    if (visible) {
      calculateAverageRating();
    }
  }, [visible, reviews]);

  return (
    <Modal
      title="คะแนนร้านค้า"
      open={visible}
      onCancel={onClose}
      footer={null}
      className="custom-modalsellrate"
    >
      {reviewCount > 0 ? (
        <div>
          <p>คะแนนเฉลี่ย: {averageRating?.toFixed(2)} ⭐</p>
          <Rate allowHalf disabled value={averageRating || 0} />
          <p>จำนวนรีวิว: {reviewCount}</p>
          <div>
            {reviews.map((review) => {
              const member = members.find(m => m.ID === review.MemberID);
              return (
                <div key={review.ID} style={{ margin: '10px 0', padding: '10px', border: '1px solid #f0f0f0', borderRadius: '5px', backgroundColor: '#f4f0ec' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img
                      src={member ? member.ProfilePic : 'https://via.placeholder.com/10'} // ใช้ placeholder ถ้าไม่มีรูป
                      alt={member?.Username || 'Unknown User'}
                      style={{ width: 30, height: 30, borderRadius: '50%', marginRight: '8px' ,objectFit: 'cover'}}
                    />
                    <p style={{ margin: 0 }}><strong>{member ? member.Username : 'Unknown User'}</strong></p>
                  </div>
                  <p>คะแนน: <Rate allowHalf disabled value={review.Rating} /></p>
                  <p>ความคิดเห็น: {review.Comment}</p>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <p>ยังไม่มีรีวิว</p>
      )}
    </Modal>
  );
};

export default ShopRating;