import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GlobalState } from "../../../GlobalState";
import axios from "axios";
import "./UpdateProduct.css";

function UpdateProduct() {
  const params = useParams();
  const navigate = useNavigate();

  const state = useContext(GlobalState);
  const [products, setProducts] = state.productsAPI;
  const [token] = state.token;
  const [detailProduct, setDetailProduct] = useState({});

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState({ public_id: "", url: "" });
  const [category, setCategory] = useState("");
  const [newImage, setNewImage] = useState(null);

  useEffect(() => {
    if (params) {
      const product = products.find((product) => product._id === params.id);
      if (product) {
        setDetailProduct(product);
        setTitle(product.title);
        setPrice(product.price);
        setDescription(product.description);
        setContent(product.content);
        setImages(product.images);
        setCategory(product.category);
      }
    }
  }, [params, products]);

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

  const onSubmitHandle = async (e) => {
    e.preventDefault();

    const updatedProduct = {
      title,
      price,
      description,
      content,
      images,
      category,
    };

    try {
      const response = await axios.put(
        `/api/products/${params.id}`,
        updatedProduct
      );
      console.log("Product updated successfully:", response.data);

      const updatedProducts = products.map((product) =>
        product._id === params.id ? { ...product, ...updatedProduct } : product
      );
      setProducts(updatedProducts);

      alert("Product updated successfully!");

      navigate("/");
    } catch (error) {
      console.error("Error updating the product:", error);
      alert("Failed to update the product. Please try again.");
    }
  };

  if (Object.keys(detailProduct).length === 0) return null;

  return (
    <div className="update-product-container">
      <form onSubmit={onSubmitHandle}>
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
        <button type="submit">Save</button>
      </form>
    </div>
  );
}

export default UpdateProduct;
