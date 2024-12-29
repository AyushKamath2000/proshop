import {USERS_URL} from "../constant";
import {apiSlice} from "./apiSlices";

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints : (builder) => ({
        login : builder.mutation({
            query: (data) => ({
                url : `${USERS_URL}/auth`,
                method : 'POST',
                body : data,
            }),
            keepUnusedDataFor : 5,
        }),
        register : builder.mutation({
            query: (data) => ({
                url : `${USERS_URL}`,
                method : 'POST',
                body : data,
            }),
        }),
        profile : builder.mutation({
            query: (data) => ({
                url : `${USERS_URL}/profile`,
                method : 'PUT',
                body : data,
            }),
        }),

        logout : builder.mutation({
            query: (data) => ({
                url : `${USERS_URL}/logout`,
                method : 'POST',
                body : data,
            }),
        }),
        getUsers : builder.query({
            query: () => ({
                url : `${USERS_URL}`,
                method : 'GET',
            }),
            providesTags : ['User'],
            keepUnusedDataFor : 5,
        }),
        deleteUser : builder.mutation({
            query: (id) => ({
                url : `${USERS_URL}/${id}`,
                method : 'DELETE',
            }),
            invalidatesTags : ['User'],
        }),
        getUserDetails : builder.query({
            query: (id) => ({
                url : `${USERS_URL}/${id}`,
                method : 'GET',
            }),
            providesTags : ['User'],
            keepUnusedDataFor : 5,
        }),
        updateUser : builder.mutation({
            query: (data) => ({
                url : `${USERS_URL}/${data.id}`,
                method : 'PUT',
                body : data,
            }),
            invalidatesTags : ['User'],
        }),
    })
});

export const {useLoginMutation, useLogoutMutation, useRegisterMutation ,useProfileMutation ,useGetUsersQuery, useDeleteUserMutation, useUpdateUserMutation, useGetUserDetailsQuery } = usersApiSlice;
