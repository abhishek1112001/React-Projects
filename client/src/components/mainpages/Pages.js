import React from "react";
import Product from "./Products/Product";
import { Route, Routes } from "react-router-dom";
import Login from "./login/Login";
import Register from "./login/Register";
import Cart from "./cart/Cart";
import DetailProduct from "./utils/DetailProducts/DetailProduct";
import UpdateProduct from "./Products/UpdateProduct";
import CreateProduct from "./Products/CreateProduct";

function Pages() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Product />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/detail/:id" element={<DetailProduct />} />
        <Route path="/detail/:id" element={<DetailProduct />} />
        <Route path="/updateProduct/:id" element={<UpdateProduct />} />
        <Route path="/create_product" element={<CreateProduct />} />
      </Routes>
    </>
  );
}

export default Pages;
