import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { useGetProductsQuery } from "../slices/productsApiSlice";
import Product from "../Components/Product";
import Loader from "../Components/Loader";
import Message from "../Components/Message";

const HomeScreen = () => {
    const { data: products, isLoading, error } = useGetProductsQuery();

    if (isLoading) return <Loader/>;
    if (error) return <Message varient="danger">`Error Loading Data{error.error|| error?.data?.message}`</Message>;

    return (
        <>
            <b>LATEST PRODUCTS</b>
            <Row>
                {products?.map(product => (
                    <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                        <Product product={product} />
                    </Col>
                ))}
            </Row>
        </>
    );
};

export default HomeScreen;
