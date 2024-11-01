import {createApi , fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {BASE_URL, PRODUCTS_URL} from "../constant";

const baseQuery = fetchBaseQuery({baseUrl: BASE_URL});

export const apiSlice = createApi({
    tagTypes: ['Product', 'Order', 'User'],
    baseQuery,
    endpoints: (builder) => ({
        
    }),
});



