import React from "react";
import "./home.css";

interface ProductProps {
  data: {
    id: number;
    productName: string; // Use productName
    productImage: string; // Use productImage
  };
}

export const ItemCard: React.FC<ProductProps> = (props) => {
  const { productName, productImage } = props.data;

  return (
    <div className="item-container">
      <img src={productImage} alt={productName} />
      <div className="item-details">
        <p>
          <b className="title-item">{productName}</b>
        </p>
        <p className="price-label">Price :</p>
      </div>
    </div>
  );
};
