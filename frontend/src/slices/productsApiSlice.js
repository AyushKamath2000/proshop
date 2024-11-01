import {PRODUCTS_URL} from "../constant";
import {apiSlice} from "./apiSlices";

export const productsApiSlice = apiSlice.injectEndpoints({ 
    endpoints : (builder) => ({
         getProducts : builder.query({
             query: () => ({
                    url : PRODUCTS_URL,
             }),
             keepUnusedDataFor : 5,
         }),
         getProductDescription : builder.query({
                query: (id) => ({
                        url : `${PRODUCTS_URL}/${id}`,
                }),
                keepUnusedDataFor : 5,
         })
    })
});

export const {useGetProductsQuery, useGetProductDescriptionQuery} = productsApiSlice;
