import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import HomeScreen from './Screens/HomeScreen';
import ProductScreen from './Screens/ProductScreen';
import {Provider} from "react-redux";
import store from "./store";
import CartScreen from "./Screens/CartScreen";
import {LoginScreen} from "./Screens/LoginScreen";
import RegisterScreen from "./Screens/RegisterScreen";
import ShippingScreen from "./Screens/ShippingScreen";
import PrivateRoute from "./Components/PrivateRoute";
import PaymentScreen from "./Screens/PaymentScreen";
import PlaceOrderScreen from "./Screens/PlaceOrderScreen";
import OrderScreen from "./Screens/OrderScreen";
import{ PayPalScriptProvider} from "@paypal/react-paypal-js";
import ProfileScreen from "./Screens/ProfileScreen";
import AdminRoute from "./Components/AdminRoute";
import OrderListScreen from "./Screens/OrderListScreen";
import ProductListScreen from "./Screens/ProductListScreen";
import ProductEditScreen from "./Screens/ProductEditScreen";
import UserListScreen from "./Screens/UserListScreen";
import UserEditScreen from "./Screens/UserEditScreen";
import {HelmetProvider} from "react-helmet-async";

const router = createBrowserRouter (
  createRoutesFromElements(
    <Route path="/" element={ <App/>}>
      <Route index= {true} path='/' element={ <HomeScreen/> }/>
      <Route index= {true} path='/search/:keyword' element={ <HomeScreen/> }/>
        <Route index= {true} path='/page/:pageNumber' element={ <HomeScreen/> }/>
        <Route index= {true} path='/search/:keyword/page/:pageNumber' element={ <HomeScreen/> }/>
      <Route path='/products/:id' element={ <ProductScreen/> }/>
      <Route path='/cart' element={ <CartScreen/> }/>
      <Route path = '/login' element={<LoginScreen/>}/>
      <Route path = '/register' element={<RegisterScreen/>}/>
      <Route  path = '' element={<PrivateRoute/>}>
          <Route path = '/shipping' element={<ShippingScreen/>}/>
          <Route path = '/payment' element={<PaymentScreen/>}/>
          <Route path = '/placeorder' element={<PlaceOrderScreen/>}/>
          <Route path = '/order/:id' element={<OrderScreen/>}/>
          <Route path = '/order/:id' element={<OrderScreen/>}/>
          <Route path = '/profile' element={<ProfileScreen/>}/>
      </Route>
        <Route path= '' element={<AdminRoute/>}>
            <Route path ='/admin/orderlist' element ={<OrderListScreen/>}/>
            <Route path ='/admin/productlist' element ={<ProductListScreen/>}/>
            <Route path ='/admin/productlist/:pageNumber' element ={<ProductListScreen/>}/>
            <Route path ='/admin/userList' element ={<UserListScreen/>}/>
            <Route path = '/admin/products/:id/edit' element={<ProductEditScreen/>}/>
            <Route path = '/admin/user/:id/edit' element={<UserEditScreen/>}/>
        </Route>
    </Route>
  )
)
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <HelmetProvider>
          <Provider store={store} >
            <PayPalScriptProvider deferLoading={true}>
                <RouterProvider router={router}/>
            </PayPalScriptProvider>
          </Provider>
      </HelmetProvider>
  </React.StrictMode>
);
reportWebVitals();
