import React, { useContext } from "react";
import { GlobalState } from "../../../GlobalState";
import ProductList from "../utils/ProductList/ProductList";
import axios from "axios";

function Product() {
  const state = useContext(GlobalState);
  const [products, setProducts] = state.productsAPI;
  const [isAdmin] = state.UserAPI.isAdmin;

  const handleDeleteProduct = async (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (confirmed) {
      try {
        await axios.delete(`/api/products/${productId}`);
        console.log(`Product with ID ${productId} deleted successfully.`);

        const response = await axios.get("/api/products");

        if (response.data && Array.isArray(response.data.products)) {
          setProducts(response.data.products);
        } else {
          console.error("Expected an array but received:", response.data);
          alert("Failed to update the product list.");
        }
      } catch (error) {
        console.error("Error deleting the product:", error);
        alert("Failed to delete the product. Please try again.");
      }
    }
  };

  // const sortedProducts = Array.isArray(products)
  //   ? products.sort((a, b) => a._id.localeCompare(b._id))
  //   : []; // Use an empty array if products is not an array

  const sortedProducts = products
    .filter((product) => product && product.title)
    .sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div className="products">
      {sortedProducts.map((product) => {
        return (
          <ProductList
            key={product._id}
            product={product}
            isAdmin={isAdmin}
            handleDeleteProduct={handleDeleteProduct}
          />
        );
      })}
    </div>
  );
}

export default Product;
