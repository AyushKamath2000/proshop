import React, {Fragment, useEffect} from 'react'
import {Link, useParams} from "react-router-dom";
import {
    useDeliverOrderMutation,
    useGetOrderDetailsByIdQuery,
    useGetPayPalClientIdQuery,
    usePayOrderMutation
} from "../slices/ordersApiSlice";
import Loader from "../Components/Loader";
import Message from "../Components/Message";
import {Button, Col, Image, ListGroup, ListGroupItem, Row} from "react-bootstrap";
import { toast} from "react-toastify";
import {PayPalButtons, usePayPalScriptReducer} from "@paypal/react-paypal-js";
import {useSelector} from "react-redux";

const OrderScreen = () => {
    const {id:orderId} = useParams();
    const {data:order,refetch,isLoading,isError} = useGetOrderDetailsByIdQuery(orderId);
    const [payOrder ,{isLoading:isPayLoading} ] = usePayOrderMutation();
    const [{isPending},paypalDispatch] = usePayPalScriptReducer();
    const {data :paypal, isLoading: loadingPaypal, error : paypalError } = useGetPayPalClientIdQuery();
    const [deliverOrder, {isLoading: isDeliverLoading}] = useDeliverOrderMutation();
    const {userInfo} = useSelector(state => state.auth);
    
    const createOrder = (data,actions) => {
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: order.totalPrice,
                    },
                },
            ],
        }).then((orderID) => {
            return orderID;
        })
    }
    const onApprove = (data,actions) => {
        return actions.order.capture().then( async (details)  => {

            try{
                await payOrder({orderId, details})
                refetch();
                toast.success("Payment Successful")
            }catch(error){
                toast.error(error?.data?.message || error?.message)
            }
        })
    }
    const deliverOrderHandler = async () => {
        await deliverOrder(orderId);
        refetch();
        toast.success("Order Delivered Successfully")
    }
    const onError = (error) => {
        toast.error(error?.data?.message || error?.message)
    }
    const onApproveTest = async () => {
        await payOrder({orderId, details: {payer: {} }})
        refetch();
        toast.success("Payment Successful")
    }
    
    useEffect(()=>{
        if(!loadingPaypal && !paypalError && paypal.clientId){
           const loadingPayPalScript = async () => {
               paypalDispatch({
                 type: "resetOptions",
                 value: {
                    "client-id": paypal.clientId,
                    currency: "USD",
                 },
               });
               paypalDispatch({ type:'setLoadingStatus', value: 'pending' });
           }
           if(order && !order.isPaid){
                if(!window.paypal) {
                    loadingPayPalScript();
                }    
           }
        }
    },[paypal,loadingPaypal,paypalError,order,paypalDispatch]);
    
    return isLoading ? (<Loader/>): isError ? (<Message variant= "danger"> Error occurred in getting your Order</Message>) : (
        <>
            <h2>Product Shipping</h2>
            <h3>Order: {order._id}</h3>
            <Row>
                <Col md="8">
                    <ListGroup variant={"flush"}>
                        <ListGroupItem>
                            <p><strong>Name: </strong>{order.user.name}</p>
                            <p><strong>Email: </strong>{order.user.email}</p>
                            <p><strong>Address: </strong>
                                {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                                {order.shippingAddress.country}, {order.shippingAddress.postalCode}
                            </p>
                            {order.isDelivered ? <Message variant="success">Delivered Successfully</Message> :
                                <Message variant="danger">Not Delivered</Message>}
                        </ListGroupItem>
                        <ListGroupItem>
                            <h2>Payment Method</h2>
                            <p><strong>Method: </strong>{order.paymentMethod}</p>
                            {order.isPaid ? <Message variant={"success"}>paid on {order.paidAt} </Message> :
                                <Message variant="danger">Not Paid</Message>}
                        </ListGroupItem>
                        <ListGroupItem>
                            <h2>Order Items</h2>
                            {order.orderItems.map((items, index) => (
                                <ListGroup.Item key={index}>
                                    <Row>
                                        <Col md={1}>
                                            <Image src={items.image} alt={items.name} fluid rounded/>
                                        </Col>
                                        <Col>
                                            <Link to={`/products/${items.product}`}>{items.name}</Link>
                                        </Col>
                                        <Col md={4}>
                                            {items.qty} x ${items.price} = ${Math.round(items.qty * items.price * 100) / 100}
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}
                        </ListGroupItem>
                    </ListGroup>
                </Col>
                <Col md="4">
                    <ListGroup variant={"flush"}>
                        <h2>Order Summary</h2>
                        <ListGroupItem>
                            <Row>
                                <Col>Items: </Col>
                                <Col>${order.itemsPrice}</Col>
                            </Row>
                        </ListGroupItem>
                        <ListGroupItem>
                            <Row>
                                <Col>Shipping: </Col>
                                <Col>${order.shippingPrice}</Col>
                            </Row>
                        </ListGroupItem>
                        <ListGroupItem>
                            <Row>
                                <Col>Tax: </Col>
                                <Col>${order.taxPrice}</Col>
                            </Row>
                        </ListGroupItem>
                        <ListGroupItem>
                            <Row>
                                <Col>Total: </Col>
                                <Col>${order.totalPrice}</Col>
                            </Row>
                        </ListGroupItem>
                        <ListGroupItem>
                            {
                                !order.isPaid && (
                                    (isPayLoading || isPending) ? (<Loader/>) : (
                                        <>
                                            <Button onClick={onApproveTest} className={"mb-3"}>
                                                Test Payment
                                            </Button>
                                            <PayPalButtons
                                                createOrder={createOrder}
                                                onApprove={onApprove}
                                                onError={onError}
                                            />
                                        </>
                                    )
                                )
                            }
                        </ListGroupItem>
                        <ListGroupItem>
                            {isDeliverLoading && (<Loader/>)}
                            {!order.isDelivered && order.isPaid && userInfo && userInfo.isAdmin &&(
                            <Button onClick={deliverOrderHandler} className={"btn btn-block"}>Mark as Delivered</Button>
                            )}
                        </ListGroupItem>
                    </ListGroup>
                </Col>
            </Row>
        </>

    )
}
export default OrderScreen
