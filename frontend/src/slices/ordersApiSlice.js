import {apiSlice} from "./apiSlices";
import {ORDERS_URL, PAYPAL_URL} from "../constant";

export const ordersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
       createOrder: builder.mutation({
            query: (order) => ({
                url: ORDERS_URL,
                method: "POST",
                body: {...order},
            }),
        }),
        
        getOrderDetailsById: builder.query({
            query: (orderId) => ({
                url: `${ORDERS_URL}/${orderId}`,
                method: "GET",
            }),
            keepUnusedDataFor: 5,
        }),
        addOrderItems: builder.mutation({
            query: (order) => ({
                url: `orders`,
                method: "POST",
                body: order,
            }),
        }),
        updateOrderToPaid: builder.mutation({
            query: (id) => ({
                url: `orders/${id}/pay`,
                method: "PUT",
            }),
        }),
        updateOrderToDelivered: builder.mutation({
            query: (id) => ({
                url: `orders/${id}/deliver`,
                method: "PUT",
            }),
        }),
        payOrder: builder.mutation({
            query: ({orderId,details}) => ({
                url: `${ORDERS_URL}/${orderId}/pay`,
                method: "PUT",
                body: {...details},
            }),
        }),
        getPayPalClientId: builder.query({
            query: () => `${PAYPAL_URL}`,
            keepUnusedDataFor: 5,
        }),
        getMyOrders: builder.query({
            query: () => ({
                url : `${ORDERS_URL}/myorders`,
                keepUnusedDataFor: 5,
            }),
        }),
    }),
})

export const {useCreateOrderMutation, useGetOrderDetailsByIdQuery, usePayOrderMutation , useGetPayPalClientIdQuery , useGetMyOrdersQuery } = ordersApiSlice;
