import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api",
  }),

  tagTypes: ["Products"],
  endpoints: () => ({}),
});

export default apiSlice;
