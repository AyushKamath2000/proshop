import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { useGetProductsQuery } from "../slices/productsApiSlice";
import Product from "../Components/Product";
import Loader from "../Components/Loader";
import Message from "../Components/Message";
import {useParams} from "react-router-dom";
import Paginate from "../Components/Paginate";

const HomeScreen = () => {
    const {pageNumber,keyword} = useParams()
    const { data, isLoading, error } = useGetProductsQuery({keyword,pageNumber});

    if (isLoading) return <Loader/>;
    if (error) return <Message varient="danger">`Error Loading Data{error.error|| error?.data?.message}`</Message>;

    return (
        <>
            {keyword ? <b>Results for {keyword}</b> : <b>LATEST PRODUCTS</b> }
            <Row>
            {data.products?.map(product => (
                    <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                        <Product product={product} />
                    </Col>
                ))}
            </Row>
            <Paginate
             pages={data.pages}
             page={data.page}
             keyword = {keyword}
            />
                

        </>
    );
};

export default HomeScreen;
