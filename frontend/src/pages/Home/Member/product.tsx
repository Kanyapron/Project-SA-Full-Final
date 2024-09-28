import React from 'react';
import "./homemember.css";

interface ProductProps {
  data: {
    id: number;
    productName: string;
    productImage: string;
  };
}

export const Course: React.FC<ProductProps> = (props) => {
  const { productName, productImage } = props.data;


  return (
    <div className="product">
        <img src={productImage} alt={productName} />
      <div className='description'>
        <p>
          <b className='name-pro'>{productName}</b>
        </p>
        <p className='money-color'>Price :</p>
      </div>
    </div>
  );
};