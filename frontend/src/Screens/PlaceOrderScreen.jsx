import React, {useEffect} from 'react'
import {useDispatch, useSelector} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import CheckoutSteps from "../Components/CheckoutSteps";
import {Button, Card, Col, Image, ListGroup, ListGroupItem, Row} from "react-bootstrap";
import {useCreateOrderMutation} from "../slices/ordersApiSlice";
import Message from "../Components/Message";
import Loader from "../Components/Loader";
import {clearCartItems} from "../slices/cartSlice";
import {toast} from "react-toastify";

const PlaceOrderScreen = () => {
    const cart = useSelector(state=>state.cart);
    const {cartItems,shippingAddress,paymentMethod} = cart;
    const [createOrder,{isLoading,error}] = useCreateOrderMutation();
    
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(()=>{
        if(!shippingAddress){
            navigate("/shipping")
        }
        if(!paymentMethod){
            navigate("/payment")
        }
    },[shippingAddress,paymentMethod,navigate])
    
    const placeOrderHandler = async () => {
        try{
            const cartOrder ={
                orderItems: cartItems,
                shippingAddress,
                paymentMethod,
                itemsPrice: cart.itemsPrice,
                shippingPrice: cart.shippingPrice,
                taxPrice: cart.taxPrice,
                totalPrice: cart.totalPrice
            }
            const response = await createOrder(cartOrder).unwrap();
            dispatch(clearCartItems());
            navigate(`/order/${response._id}`)
        }catch(err){
            toast.error("error")
        }
    }
    return (
        <>
        <CheckoutSteps step1 step2 step3 step4/>
        <Row>
           <Col md={9}>
               <Card>
                   <ListGroup variant={"flush"} >
                      <ListGroupItem>
                        <strong>Place Order</strong>
                            <p className={"mt-3"}>
                                 <strong>Address:  </strong>
                                 {shippingAddress.address},{shippingAddress.city},{shippingAddress.postalCode},{shippingAddress.country}
                            </p>
                      </ListGroupItem>
                       <ListGroupItem>
                           <strong>Payment Method :  </strong>
                           {paymentMethod}
                       </ListGroupItem>
                       <ListGroupItem>
                              <strong>Order Items</strong>
                              {cartItems.length === 0 ? <h3>Your cart is empty</h3> : (
                                <ListGroup variant={"flush"} className={"mb-2"}>
                                     {cartItems.map((item,index)=>(
                                          <ListGroupItem key={index}>
                                            <Row>
                                                 <Col md={1}>
                                                      <Image src={item.image} alt={item.name} className={"img-fluid"} rounded />
                                                 </Col>
                                                <Col >
                                                    <Link to = {`/products/${item._id}`}>{item.name}</Link>
                                                </Col>
                                                <Col md={4}>
                                                    {item.qty} x ${item.price} = ${Math.round(item.qty * item.price * 100) / 100}
                                                </Col>  
                                            </Row>    
                                          </ListGroupItem>
                                     ))}
                                </ListGroup>
                              )}
                       </ListGroupItem>
                   </ListGroup>
               </Card>
           </Col>
            <Col md={3}>
                <Card>
                    <ListGroup variant={"flush"}>
                        <ListGroupItem>
                            <strong>Order Summary</strong>
                        </ListGroupItem>
                        <ListGroupItem>
                            <Row>
                                <Col>Items :</Col>
                                <Col>${cart.itemsPrice}</Col>
                            </Row>
                        </ListGroupItem>
                        <ListGroupItem>
                            <Row>
                                <Col>Shipping:</Col>
                                <Col>${cart.shippingPrice}</Col>
                            </Row>
                        </ListGroupItem>
                        <ListGroupItem>
                            <Row>
                                <Col>Tax :</Col>
                                <Col>${cart.taxPrice}</Col>
                            </Row>
                        </ListGroupItem>
                        <ListGroupItem>
                            <Row>
                                <Col>Total :</Col>
                                <Col>${cart.totalPrice}</Col>
                            </Row>
                        </ListGroupItem>
                        <ListGroupItem>
                            {error && <Message variant={"danger"}>{error?.data?.message}</Message>}
                        </ListGroupItem>
                        <ListGroupItem>
                            <Button
                                type= 'button'
                                className="btn-block"
                                disabled={cartItems.length === 0}
                                onClick={placeOrderHandler}
                            >
                                Place Order
                            </Button>
                            {isLoading && <Loader/>}
                        </ListGroupItem>
                    </ListGroup> 
                </Card>
            </Col>
        </Row>
    </>
    )
}
export default PlaceOrderScreen
