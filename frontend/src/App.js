import React from 'react'
import Header from "./Components/Header";
import {Container} from "react-bootstrap";
import Footer from "./Components/Footer";
import { Outlet } from 'react-router-dom';
import {ToastContainer} from "react-toastify";
import './styles.css';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
      <>
        <Header/>
        <main className="py-3">
          <Container>
            <h1></h1>
              <h3>
                  <Outlet/>
              </h3>
          </Container>

        </main>
        <Footer/>
         <ToastContainer/>
      </>


  )
}

export default App;
