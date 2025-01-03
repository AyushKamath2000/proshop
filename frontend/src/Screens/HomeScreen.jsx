import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { useGetProductsQuery } from "../slices/productsApiSlice";
import Product from "../Components/Product";
import Loader from "../Components/Loader";
import Message from "../Components/Message";
import { Link, useParams } from "react-router-dom";
import Paginate from "../Components/Paginate";
import ProductCarousel from "../Components/ProductCarousel";
import Meta from "../Components/Meta";

const HomeScreen = () => {
    const {pageNumber,keyword} = useParams()
    const { data, isLoading, error } = useGetProductsQuery({keyword,pageNumber});

    return (
        <>
            <Meta />
            {!keyword ? <ProductCarousel/> : (
                <div className="d-flex flex-column  mb-4">
                    <Link to="/">
                        <Button className="btn btn-light">Go Back</Button>
                    </Link>
                    <b className="mt-2">Results for {keyword}</b>
                </div>
            )}
            {isLoading ? (
                <Loader/>
            ) : error ? (
                <Message variant="danger">{error.data?.message || error.message || 'An error occurred'}</Message>
            ) : (
                data && (
                    <>
                    <Row>
                            {data?.products?.map(product => (
                                <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                                    <Product product={product} />
                                </Col>
                            ))}
                        </Row>
                        <Paginate pages={data.pages} page={data.page} keyword={keyword} />
                    </>
                )
            )}
        </>
    );
};

export default HomeScreen;
