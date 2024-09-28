
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Spin, Alert, Button, Modal,Rate } from 'antd';
import { ProductsInterface } from '../../../../src/interfaces/Products';
import Re_bar from "../../../component/re_bar";
import NavbarMember from '../../../component/navbarMember';

interface Review {
  Rating: number;
  Comment: string;
  MemberID: number;
  ProductsID: number; // เพิ่ม ProductsID ในรีวิว
}

const ReviewPage: React.FC = () => {
  const [products, setProducts] = useState<ProductsInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductsInterface | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get<ProductsInterface[]>('http://localhost:8000/products');
        setProducts(response.data);
      } catch (err) {
        setError('Error fetching product data');
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await axios.get<Review[]>('http://localhost:8000/review'); // ดึงรีวิวทั้งหมด
        setReviews(response.data);
      } catch (err) {
        console.error('Error fetching reviews:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    fetchReviews();
  }, []);

  const showModal = (product: ProductsInterface) => {
    setSelectedProduct(product);
    setIsModalVisible(true);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedProduct(null);
  };

  if (loading) return <Spin tip="Loading products..." />;
  if (error) return <Alert message={error} type="error" />;

  // กรองผลิตภัณฑ์ที่มีรีวิว
  const productsWithReviews = products.filter((product) =>
    reviews.some((review) => review.ProductsID === product.ID)
  );

  return (
    <div>
      <NavbarMember />
      <Re_bar />
      <div style={{width:"175vh"}}>
        <Table
          dataSource={productsWithReviews} // ใช้ผลิตภัณฑ์ที่มีรีวิว
          columns={[
            {
              title: <div style={{ textAlign: 'center' ,marginLeft:"50px"}}>Picture</div>,
              dataIndex: 'PictureProduct',
              key: 'PictureProduct',
              align: 'center',
              width: 300, // กำหนดความกว้างของคอลัมน์ที่นี่
              render: (text: string) => (
                <img
                  src={text}
                  alt="product"
                  style={{ width: 100, height: 100, objectFit: 'cover' ,marginLeft:"50px"}}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100';
                  }}
                />
              ),
            },
            {
              title: <div style={{ textAlign: 'center' }}>Description</div>,
              dataIndex: 'Description',
              key: 'Description',
              width: 800,
            },
            {
              title: <div style={{ textAlign: 'center' }}>Title</div>,
              dataIndex: 'Title',
              key: 'Title',
              width: 300, // กำหนดความกว้างของคอลัมน์ที่นี่
            },
            {
              title: <div style={{ textAlign: 'center' }}>Price</div>,
              dataIndex: 'Price',
              key: 'Price',
              render: (text: number) => (text !== undefined ? `฿${text.toFixed(2)}` : 'N/A'),
              align: 'center',
              width: 300, // กำหนดความกว้างของคอลัมน์ที่นี่
            },
            {
              title: <div style={{ textAlign: 'center' }}>Review</div>,
              key: 'review',
              align: 'center',
              width: 200, // กำหนดความกว้างของคอลัมน์ที่นี่
              render: (record) => (
                <Button onClick={() => showModal(record)} type="primary" style={{ backgroundColor: '#ff8c1a', borderColor: '#ff8c1a' }}>
                  ดูรีวิว
                </Button>
              ),
            },
          ]}
          rowKey="ID"
          pagination={false}
        />
      </div>

      <Modal
        title={`คุณกำลังดูรีวิวสินค้า: ${selectedProduct?.Title}`}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        {/* <p>{`คุณกำลังดูรีวิวสินค้า: ${selectedProduct?.Title}`}</p> */}
        {reviews.length > 0 ? (
          reviews
            .filter((review) => review.ProductsID === selectedProduct?.ID) // กรองรีวิวที่ตรงกับผลิตภัณฑ์ที่เลือก
            .map((review, index) => (
              <div key={index} style={{ marginBottom: '16px' }}>
                <p>คะแนน: <Rate allowHalf disabled value={review.Rating || 0} /></p>
                <p>ความคิดเห็น: {review.Comment}</p>
              </div>
            ))
        ) : (
          <p>ยังไม่มีรีวิวสำหรับสินค้านี้</p>
        )}
      </Modal>
    </div>
  );
};

export default ReviewPage;