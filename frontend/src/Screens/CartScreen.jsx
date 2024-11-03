import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {Button, Card, Col, Dropdown, Form, Image, ListGroup, ListGroupItem, Row} from 'react-bootstrap';
import Message from "../Components/Message";
import {FaTrash} from "react-icons/fa";
import {addToCart, removeFromCart} from "../slices/cartSlice";

const CartScreen = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const cart = useSelector(state => state.cart);
    const { cartItems } = cart;

    const addToCartHandler  = async (item, qty) =>{
        dispatch(addToCart({ ...item, qty }));
    }
    const removeFromCartHandler  = async (id) =>{
        dispatch(removeFromCart(id));
    }

    return (
        <Row>
            <Col md ={8}>
                <h1>Shopping Cart</h1>
                {cartItems.length === 0 ? (
                    <Message>
                        Your Cart is Empty <Link to="/" className="btn">Go Back</Link>
                    </Message>
                ) : (
                    <ListGroup>
                        {cartItems.map(item => (
                            <ListGroup.Item key={item._id}>
                                <Row>
                                    <Col md ={2}>
                                        <Image src={item.image} alt={item.name} fluid rounded />
                                    </Col>
                                    <Col md={4}>
                                        <Link to={`/products/${item._id}`}>{item.name}</Link>
                                    </Col>
                                    <Col md={2}>PRICE: ${item.price}</Col>
                                    <Col md ={2}>
                                        <Form.Control
                                            as="select"
                                            value={item.qty}
                                            onChange={(e) =>{addToCartHandler(item,Number(e.target.value))}}
                                            style={{ padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }}
                                        >
                                            {[...Array(item.countInStock).keys()].map((i) => (
                                                <option key={i + 1} value={i + 1} style={{ padding: '10px', backgroundColor: '#f8f9fa' }}>
                                                    {i + 1}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Col>
                                    <Col md={2}>
                                        <Button variant ="light" onClick={() => {removeFromCartHandler(item._id)}}>
                                            <FaTrash/>
                                        </Button>
                                    </Col>
                                </Row>
                            </ListGroup.Item>))
                        }
                    </ListGroup>
            )}
        </Col>
        <Col md ={4}>
            <Card>
                <ListGroup variant={"flush"}>
                    <ListGroupItem>
                       <h2>
                           Subtotal ({cartItems.reduce((acc,accum)=>acc+accum.qty,0)}) items
                       </h2>
                          ${cartItems.reduce((acc,accum)=>acc+accum.qty*accum.price,0).toFixed(2)} 
                    </ListGroupItem>
                    <ListGroupItem>
                        <Button
                            type="button"
                            className="btn-block"
                            disabled={cartItems.length === 0}
                            onClick={() => navigate('/login?redirect=shipping')}
                        >
                            Proceed to Checkout
                        </Button>
                    </ListGroupItem>
                </ListGroup>
            </Card>
        </Col>    
        </Row>
    );
};

export default CartScreen;
