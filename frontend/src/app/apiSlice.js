import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL
      ? `${import.meta.env.VITE_API_URL}/api`
      : "http://localhost:3000/api",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token || localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),

  tagTypes: ["Products", "User", "Users"],
  endpoints: () => ({}),
});

export default apiSlice;
