import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GlobalState } from "../../../GlobalState";
import "./CreateProduct.css";

function CreateProduct() {
  const navigate = useNavigate();
  const state = useContext(GlobalState);
  const [setProducts] = state.productsAPI;
  const [token] = state.token;
  const [product_id, setProduct_id] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState({ public_id: "", url: "" });
  const [category, setCategory] = useState("");
  const [newImage, setNewImage] = useState(null);

  // Handle image upload
  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!newImage) return;

    try {
      const formData = new FormData();
      formData.append("file", newImage);

      const response = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token,
        },
      });

      const uploadedImage = response.data;
      setImages({
        public_id: uploadedImage.public_id,
        url: uploadedImage.url,
      });

      console.log("Image uploaded successfully:", uploadedImage);
    } catch (error) {
      console.error("Error uploading the image:", error);
      alert("Failed to upload the image. Please try again.");
    }
  };

  // Handle product creation
  const onSubmitHandle = async (e) => {
    e.preventDefault();

    const newProduct = {
      product_id,
      title,
      price,
      description,
      content,
      images,
      category,
    };

    try {
      const response = await axios.post(`/api/products`, newProduct, {
        headers: { Authorization: token },
      });

      console.log("Product created successfully:", response.data);

      const updatedProductsResponse = await axios.get("/api/products");
      setProducts(updatedProductsResponse.data.products);

      alert("Product created successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error creating the product:", error);
      alert("Failed to create the product. Please try again.");
    }
  };

  return (
    <div className="create-product-container">
      <form onSubmit={onSubmitHandle}>
        <div>
          <label>Product ID</label>
          <input
            type="text"
            value={product_id}
            onChange={(e) => setProduct_id(e.target.value)}
          />
        </div>
        <div>
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label>Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div>
          <label>Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label>Content</label>
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div>
          <label>Upload New Image</label>
          <input type="file" onChange={(e) => setNewImage(e.target.files[0])} />
          <button type="button" onClick={handleImageUpload}>
            Upload Image
          </button>
        </div>
        <div className="current-image">
          <label>Current Image</label>
          <img src={images.url} alt="Product" />
        </div>

        <div>
          <label>Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
        <button type="submit">Create Product</button>
      </form>
    </div>
  );
}

export default CreateProduct;
