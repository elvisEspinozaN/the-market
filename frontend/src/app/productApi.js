import apiSlice from "./apiSlice";

export const productApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => "/products",
      providesTags: ["Products"],
    }),

    getProductById: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: ["Products"],
    }),
  }),
});

export const { useGetProductsQuery, useGetProductByIdQuery } = productApi;
