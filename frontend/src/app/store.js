import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import apiSlice from "./apiSlice";
import { authApiSlice } from "./authApiSlice";

export const store = configureStore({
  reducer: {
    // state management
    auth: authReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    [authApiSlice.reducerPath]: authApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(apiSlice.middleware)
      .concat(authApiSlice.middleware),
});

export default store;
