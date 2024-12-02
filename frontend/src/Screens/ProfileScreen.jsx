import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {Button, Col, Form, FormLabel, Row, Table} from "react-bootstrap";
import Loader from "../Components/Loader";
import {useProfileMutation, userProfileMutation} from "../slices/userApiSlice";
import {toast} from "react-toastify";
import {setCredentials} from "../slices/authSlice";
import {useGetMyOrdersQuery} from "../slices/ordersApiSlice";
import Message from "../Components/Message";
import {FaCheck, FaTimes} from "react-icons/fa";

const ProfileScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {userInfo} = useSelector((state) => state.auth)
    const [updateProfile, {isLoading: profileLoading}] = useProfileMutation();
    const { data : orders, isLoading: ordersLoading, error: ordersError} = useGetMyOrdersQuery();
    
    useEffect(()=>{
        if(!userInfo){
            navigate('/login')
        }else{
            setName(userInfo.name)
            setEmail(userInfo.email)
        }
    },[ userInfo, navigate])
    
    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Passwords do not match')
        } else{
            try {
                const res = await updateProfile({ id: userInfo._id ,name, email, password}).unwrap();
                dispatch(setCredentials(res));
                toast.success('Profile Updated Successfully')
            } catch (error) {
                toast.error('Error updating profile')
            }
        }
    }

    
return (
        <Row>
           <Col md={3}>
               <h2>USER PROFILE</h2>
               <Form onSubmit={submitHandler}>
                   <Form.Group controlId={"name"} className={"my-3"}>
                       <FormLabel column={"lg"}>Name</FormLabel>
                       <Form.Control
                           type={"text"}
                           placeholder={"Enter Name"}
                           value={name}
                           onChange={(e) => setName(e.target.value)}
                       />
                   </Form.Group>
                   <Form.Group controlId={"email"} className={"my-3"}>
                       <FormLabel column={"lg"}>Email Address</FormLabel>
                       <Form.Control
                           type={"email"}
                           placeholder={"Enter Email"}
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                       />
                   </Form.Group>
                   <Form.Group controlId={"password"} className={"my-3"}>
                       <FormLabel column={"lg"}>Password</FormLabel>
                       <Form.Control
                           type={"password"}
                           placeholder={"Enter Password"}
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                       />
                   </Form.Group>
                   <Form.Group controlId={"confirmPassword"} className={"my-3"}>
                       <FormLabel column={"lg"}>Confirm Password</FormLabel>
                       <Form.Control
                           type={"password"}
                           placeholder={"Confirm Password"}
                           value={confirmPassword}
                           onChange={(e) => setConfirmPassword(e.target.value)}
                       />
                   </Form.Group>
                   <Button type={"submit"} variant={"primary"} className={"mt-2 float-end"} >UPDATE PROFIE</Button>
               </Form>
           </Col> 
            <Col md ={9}>
                <h2>My Orders</h2>
                {ordersLoading ? <Loader/> : ordersError ? <Message variant={'danger'}>{ordersError?.data?.message}</Message> : (
                    <Table className={"table table-striped table-sm"}>
                       <thead>
                            <tr>
                                <th>ID</th>
                                <th>DATE</th>
                                <th>TOTAL</th>
                                <th>PAID</th>
                                <th>DELIVERED</th>
                                <th></th>
                            </tr>
                       </thead>
                       <tbody>
                       {orders.map((orders) =>(
                           <tr key={orders._id}>
                               <td>{orders._id}</td>
                               <td>{orders.createdAt.substring(0, 10)}</td>
                               <td>{orders.totalPrice}</td>
                               <td>
                                   {orders.isPaid ? (orders.paidAt.substring(0, 10)) : (
                                       <FaTimes style={{color: "red"}}/>
                                   )}

                               </td>
                               <td>
                                   {orders.isDelivered ? <FaCheck style={{ color: "green" }} /> : (
                                       <FaTimes style={{color: "red"}}/>
                                   )}
                               </td>
                               <td>
                                   <Button className="small-button" variant={"light"} onClick={() => navigate(`/order/${orders._id}`)}><b>Details</b></Button>
                               </td>
                           </tr>
                       ))}
                       </tbody>
                    </Table>
                )}

            </Col>
        </Row>
)
}
export default ProfileScreen
