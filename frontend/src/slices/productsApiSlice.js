import {PRODUCTS_URL, UPLOAD_URL} from "../constant";
import {apiSlice} from "./apiSlices";

export const productsApiSlice = apiSlice.injectEndpoints({ 
    endpoints : (builder) => ({
         getProducts : builder.query({
             query: ({ keyword, pageNumber}) => ({
                    url : PRODUCTS_URL,
                    params : {
                        pageNumber,
                        keyword
                    }
             }),
             keepUnusedDataFor : 5,
         }),
         getProductDescription : builder.query({
                query: (id) => ({
                        url : `${PRODUCTS_URL}/${id}`,
                }),
                keepUnusedDataFor : 5,
         }),
        createProduct : builder.mutation({
            query : () => ({
                url : PRODUCTS_URL,
                method : "POST",
            }),
            invalidatesTags : ['product'],
        }),
        updateProduct : builder.mutation({
            query : (data) => ({
                url : `${PRODUCTS_URL}/${data.id}`,
                method : "PUT",
                body: data
            }),
            invalidatesTags : ['product'],
        }),
        uploadImage : builder.mutation({
            query : (data) => ({
                url : UPLOAD_URL,
                method : "POST",
                body: data
            }),
            invalidatesTags : ['product'],
        }),
        deleteProduct : builder.mutation({
            query : (id) => ({
                url : `${PRODUCTS_URL}/${id}`,
                method : "DELETE",
            }),
            invalidatesTags : ['product'],
        }),
        createProductReview: builder.mutation({
            query: (data) => ({
                url: `${PRODUCTS_URL}/${data.id}/reviews`,
                method: "POST",
                body: data
            }),
            invalidatesTags: ['product']
        })
    })
});

export const {useGetProductsQuery, useGetProductDescriptionQuery, useCreateProductMutation, useUpdateProductMutation, useUploadImageMutation , useDeleteProductMutation , useCreateProductReviewMutation } = productsApiSlice;
