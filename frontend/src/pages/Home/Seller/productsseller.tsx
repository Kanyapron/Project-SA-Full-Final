import React from 'react';
import "./homeseller.css";

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
    <div className="productseller">
        <img src={productImage} alt={productName} />
      <div className='descriptionseller'>
        <p>
          <b className='name-proseller'>{productName}</b>
        </p>
        <p className='money-colorseller'>Price :</p>
      </div>
    </div>
  );
};