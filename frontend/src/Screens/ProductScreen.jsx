import React from 'react'
import { Link, useParams } from "react-router-dom";
import products from "../products";
import {Card, Col, ListGroup, ListGroupItem, Row} from "react-bootstrap";
import Ratings from "../Components/Ratings";

const ProductScreen = () => {
    const { id: productID } = useParams();
    const product = products.find((p) => p._id === productID);
    console.log(product);

    return (
        <>
            <Link className="btn btn-light my-3" to="/">Go Back</Link>
            <div className="row">
                <div className="col-md-5">
                    <img src={product.image} alt={product.name} className="img-fluid" />
                </div>
                <div className="col-md-4">
                    <ListGroup variant={"flush"}>
                        <ListGroupItem>
                            <strong>{product.name}</strong>
                        </ListGroupItem>
                        <ListGroupItem>
                            <Ratings value={product.rating} text={`${product.numReviews} reviews`} />
                        </ListGroupItem>
                        <ListGroupItem style={{ textAlign: 'start' }} >
                            {product.description}
                        </ListGroupItem>
                    </ListGroup>
                </div>
                <div className="col-md-3">
                    <Card>
                        <ListGroup variant={"flush"}>
                            <ListGroupItem>
                                <Row>
                                    <Col>Price:</Col>
                                    <Col>
                                        <strong>${product.price}</strong>
                                    </Col>
                                </Row>
                            </ListGroupItem>
                            <ListGroupItem>
                                <div className="row">
                                    <Col>Status:</Col>
                                    <Col><strong>{product.countInStock > 0 ? "In Stock" : "Out of Stock"}</strong></Col>
                                </div>
                            </ListGroupItem>
                            <ListGroupItem>
                                <button className="btn btn-dark" disabled={product.countInStock === 0}>Add to Cart</button>
                            </ListGroupItem>
                        </ListGroup>
                    </Card>
                </div>
            </div>
        </>
    );
}

export default ProductScreen;