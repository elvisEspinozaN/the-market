import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import { authApiSlice } from "./authApiSlice";
import { productApi } from "./productApiSlice";

export const store = configureStore({
  reducer: {
    // state management
    auth: authReducer,
    // auth api calls
    [authApiSlice.reducerPath]: authApiSlice.reducer,
    // product api calls
    [productApi.reducerPath]: productApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApiSlice.middleware)
      .concat(productApi.middleware),
});

export default store;
