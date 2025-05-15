import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import apiSlice from "./apiSlice";

export const store = configureStore({
  reducer: {
    // state management
    auth: authReducer,
    // [apiSlice.reducerPath]: apiSlice.reducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export default store;
