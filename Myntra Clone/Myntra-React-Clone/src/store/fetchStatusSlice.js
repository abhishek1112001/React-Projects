import { createSlice } from "@reduxjs/toolkit";

const fetchStatusSlice = createSlice({
  name: "fetchStatus",
  initialState: {
    fetchDone: false, // false = PENDING and true = DONE
    currentlyFetching: false,
  },
  reducers: {
    markFetchDone: (state) => void (state.fetchDone = true),

    markFetchingStarted: (state) => void (state.currentlyFetching = true),

    markFetchingFinished: (state) => void (state.currentlyFetching = false),
  },
});

export const fetchStatusAction = fetchStatusSlice.actions;

export default fetchStatusSlice;
