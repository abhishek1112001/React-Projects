import { configureStore } from "@reduxjs/toolkit";
import itemsSlice from "./items.Slice";
import fetchStatusSlice from "./fetchStatusSlice";
import bagSlice from "./bagSlice";

const myntraStore = configureStore({
  reducer: {
    items: itemsSlice.reducer,
    fetchStatus: fetchStatusSlice.reducer,
    bag: bagSlice.reducer,
  },
});

export default myntraStore;
