import React, {useEffect} from 'react'
import {Link, useNavigate, useParams} from "react-router-dom";
import {Card, Col, Form, ListGroup, ListGroupItem, Row} from "react-bootstrap";
import Ratings from "../Components/Ratings";
import {useGetProductDescriptionQuery} from "../slices/productsApiSlice";
import {useState} from "react";
import Loader from "../Components/Loader";
import Message from "../Components/Message";
import {useDispatch, useSelector} from "react-redux";
import {addToCart} from "../slices/cartSlice";

const ProductScreen = () => {
    const { id: productID } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [qty, setQty] = useState(1);
    const cart = useSelector(state => state.cart);
    const { cartItems } = cart;
    const cartItem = cartItems.find(cartItem => cartItem._id === productID);

    useEffect(() => {
        if (cartItem) {
            setQty(cartItem.qty);
        }
    }, [cartItem, setQty]);
    const { data: product, isLoading, error } = useGetProductDescriptionQuery(productID);

    if (isLoading) return <Loader/>;
    if (error) return <Message varient="danger">`Error Loading Data{error.error|| error?.data?.message}`</Message>;

    const addToCartHandler = (product,qty) => {
        dispatch(addToCart({ ...product, qty }));
        navigate("/cart");
    };

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
                        <ListGroupItem>
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
                                <Row>
                                    <Col>Status:</Col>
                                    <Col><strong>{product.countInStock > 0 ? "In Stock" : "Out of Stock"}</strong></Col>
                                </Row>
                            </ListGroupItem>
                            {product.countInStock > 0 && (
                                <ListGroupItem>
                                    <Row>
                                        <Col>Qty</Col>
                                            <Col>
                                               <Form.Control
                                                      as="select"
                                                      value={qty}
                                                      onChange={(e) => setQty(Number(e.target.value))}
                                               >
                                                   {[...Array(product.countInStock).keys()].map( (i)=>
                                                       <option key={i + 1} value={i + 1}>
                                                           {i + 1}
                                                       </option>
                                                   )}
                                               </Form.Control>
                                            </Col>
                                    </Row>
                                </ListGroupItem>)}
                                <ListGroupItem>
                                    <button
                                        style={{ width: '100%' }}
                                        className="btn btn-dark"
                                        disabled={product.countInStock === 0}
                                        onClick={() => addToCartHandler(product, qty)}
                                    >
                                        Add to Cart
                                    </button>
                                </ListGroupItem>
                        </ListGroup>
                    </Card>
                </div>
            </div>
        </>
    );
}

export default ProductScreen;
