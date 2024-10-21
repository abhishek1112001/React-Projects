import React, { useState } from "react";
import BtnRender from "./BtnRender";

function ProductList({ product, isAdmin, handleDeleteProduct }) {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div className="product_card">
      {isAdmin && (
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
      )}
      <img src={product.images.url} alt={product.title} />
      <div className="product_box">
        <h2 title={product.title}>{product.title}</h2>
        <span>${product.price}</span>
        <p>{product.description}</p>
      </div>
      <BtnRender
        product={product}
        productId={product._id}
        isChecked={isChecked}
        handleDeleteProduct={handleDeleteProduct} // Pass down the delete handler
      />
    </div>
  );
}

export default ProductList;
