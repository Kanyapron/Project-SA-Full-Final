
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Spin, Alert, Button, Modal, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import StarRating from '../star/starrating';
import { ProductsInterface } from '../../../interfaces/Products';
import { Review } from '../../../interfaces/review';
import Re_bar_seller from "../../../component/re_bar_seller";
import NavbarSeller from '../../../component/navbarSeller';

const ProductSeller: React.FC = () => {
  const [products, setProducts] = useState<ProductsInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductsInterface | null>(null);
  const [reviewText, setReviewText] = useState<string>('');
  const [rating, setRating] = useState<number>(5);
  const navigate = useNavigate();
  const MemberID = Number(localStorage.getItem("id"));

  useEffect(() => {
    const fetchProductsAndReviews = async () => {
      try {
        const productsResponse = await axios.get<ProductsInterface[]>('http://localhost:8000/products');
        const reviewsResponse = await axios.get<Review[]>('http://localhost:8000/review');

        const reviewedProductIds = new Set(reviewsResponse.data.map(review => review.ProductsID));
        const filteredProducts = productsResponse.data.filter(product => !reviewedProductIds.has(product.ID!));

        setProducts(filteredProducts);
      } catch (err) {
        setError('Error fetching product data');
      } finally {
        setLoading(false);
      }
    };

    fetchProductsAndReviews();
  }, []);

  const showModal = (product: ProductsInterface) => {
    setSelectedProduct(product);
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    const memberID = MemberID; // ดึง MemberID ที่นี่
    if (selectedProduct) {
      try {
        await axios.post('http://localhost:8000/review', {
          Rating: rating,
          Comment: reviewText,
          ProductsID: selectedProduct.ID,
          MemberID: memberID, 
        });

        navigate('/review', { state: selectedProduct });

        setIsModalVisible(false);
        setReviewText('');
        setRating(5);
      } catch (err) {
        console.error('Error submitting review:', err);
      }
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  if (loading) return <Spin tip="Loading products..." />;
  if (error) return <Alert message={error} type="error" />;

  return (
    <div>
      <NavbarSeller />
      <Re_bar_seller />
      <div style={{width:"173.1vh"}}>
        <Table
          dataSource={products}
          columns={[
            {
              title: <div style={{ textAlign: 'center',marginLeft:"50px"}}>Picture</div>,
              dataIndex: 'PictureProduct',
              key: 'PictureProduct',
              align: 'center',
              width: 300,
              render: (text: string) => (
                <img
                  src={text}
                  alt="product"
                  style={{ width: 100, height: 100, objectFit: 'cover',marginLeft:"50px" }}
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
              width: 300,
            },
            {
              title: <div style={{ textAlign: 'center' }}>Price</div>,
              dataIndex: 'Price',
              key: 'Price',
              align: 'center',
              width: 300,
              render: (text: number) => (text !== undefined ? `฿${text.toFixed(2)}` : 'N/A'),
            },
            {
              title: <div style={{ textAlign: 'center' }}>Review</div>,
              key: 'review',
              align: 'center',
              width: 200,
              render: (_, record) => (
                <Button onClick={() => showModal(record)} type="primary" style={{ backgroundColor: '#ff8c1a', borderColor: '#ff8c1a' }}>
                  รีวิวสินค้า
                </Button>
              ),
            },
          ]}
          rowKey="ID"
          pagination={false}
        />
      </div>
      <Modal
        title={`รีวิวสินค้า: ${selectedProduct?.Title}`}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="ส่งรีวิว"
        cancelText="ยกเลิก"
      >
        <StarRating totalStars={5} onSelect={setRating} />
        <Input.TextArea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          rows={4}
          placeholder="เขียนรีวิวของคุณที่นี่..."
        />
      </Modal>
    </div>
  );
};

export default ProductSeller;