import { createContext, useEffect, useState } from "react";
import ProductAPI from "./api/ProductAPI";
import axios from "axios";
import UserAPI from "./api/UserAPI";

export const GlobalState = createContext();

export const DataProvider = ({ children }) => {
  const [token, setToken] = useState(false);

  const refreshToken = async () => {
    try {
      const res = await axios.post("/user/refresh_token");
      setToken(res.data.accesstoken);
      //console.log(res);
    } catch (err) {
      console.error(
        "Error refreshing token",
        err.response?.data || err.message
      );
    }
  };

  useEffect(() => {
    const firstLogin = localStorage.getItem("firstLogin");
    if (firstLogin) {
      refreshToken();
    }
  }, []);

  const productsAPI = ProductAPI();

  const state = {
    token: [token, setToken],
    productsAPI,
    UserAPI: UserAPI(token),
  };

  ProductAPI();

  return <GlobalState.Provider value={state}>{children}</GlobalState.Provider>;
};
