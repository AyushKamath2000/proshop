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

const router = createBrowserRouter (
  createRoutesFromElements(
    <Route path="/" element={ <App/>}>
      <Route index= {true} path='/' element={ <HomeScreen/> }/>
      <Route path='/products/:id' element={ <ProductScreen/> }/>
    </Route>
  )
)
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <Provider store={store} >
            <RouterProvider router={router}/>
        </Provider>
  </React.StrictMode>
);
reportWebVitals();
