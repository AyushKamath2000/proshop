import React from 'react'
import {useDeliverOrderMutation, useGetAllOrdersQuery} from "../slices/ordersApiSlice";
import Message from "../Components/Message";
import Loader from "../Components/Loader";
import {Button, Table} from "react-bootstrap";
import {FaCheck, FaTimes} from "react-icons/fa";
import {useNavigate} from "react-router-dom";

const OrderListScreen = () => {
    const { data: orders,refetch, isLoading, error } = useGetAllOrdersQuery();
    const [deliverOrder, {isLoading: isDeliverLoading}] = useDeliverOrderMutation();
    const navigate = useNavigate();

    const deliverOrderHandler = async (orderId) => {
        await deliverOrder(orderId);
    }
    return (
        <>
            <h1>Orders</h1>
            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message varient="danger">`Error Loading Data{error.error|| error?.data?.message}`</Message>) : (
                <Table className={"table table-striped table-sm"}>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>USER</th>
                        <th>DATE</th>
                        <th>TOTAL</th>
                        <th>PAID</th>
                        <th>DELIVERED</th>
                        <th>ORDER DETAILS</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map((orders) =>(
                        <tr key={orders._id}>
                            <td>{orders._id}</td>
                            <td>{orders.user.name}</td>
                            <td>{orders.createdAt.substring(0, 10)}</td>
                            <td>{orders.totalPrice}</td>
                            <td>
                                {orders.isPaid ? (orders.paidAt.substring(0, 10)) : (
                                    <FaTimes style={{color: "red"}}/>
                                )}
                            </td>
                            <td>
                                {orders.isDelivered ? <FaCheck style={{ color: "green" }} /> : (
                                    <>
                                    <FaTimes style={{color: "red"}}/>
                                    <Button className="small-button" variant={"light"} onClick={() => {deliverOrderHandler(orders._id).then(refetch())}}><b>Mark as delivered</b></Button>
                                    </>
                                )}
                            </td>
                            <td>
                                <Button className="small-button" variant={"light"} onClick={() => navigate(`/order/${orders._id}`) }><b>Details</b></Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            )}
        </>
    )
}
export default OrderListScreen
