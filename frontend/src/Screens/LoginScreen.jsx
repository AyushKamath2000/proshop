import React, {useEffect, useState} from 'react'
import FormContainer from "../Components/FormContainer";
import {Button, Col, Form, FormLabel, Row} from "react-bootstrap";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {useDispatch, useSelector} from "react-redux";
import {useLoginMutation} from "../slices/userApiSlice";
import Loader from "../Components/Loader";
import {setCredentials} from "../slices/authSlice";

export const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [login , {isLoading}] = useLoginMutation();

    const {userInfo} = useSelector((state)=>state.auth)
    const {search} = useLocation();
    const sp = new URLSearchParams(search)
    const redirect = sp.get('redirect') || '/'

    useEffect(()=> {
        if (userInfo) {
            navigate(redirect)
        }
    },[navigate, userInfo, redirect]
    )

    const submitHandler = async (e) => {
        e.preventDefault();
        try{
            const res = await login({email, password}).unwrap()
            dispatch(setCredentials({...res}));
            navigate(redirect);
        } catch (error) {
            toast.error(error?.data?.message||error?.message)
        }
    }
    return (
        <FormContainer>
            <h1>Sign In</h1>
            <Form onSubmit={submitHandler}>
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
                <Button type={"submit"} variant={"primary"} className={"mt-2"} disabled={isLoading}>Sign In</Button>
                {isLoading && <Loader />}
            </Form>
            <Row className='py-3' style={{ fontSize: '1rem' }}>
                <Col>
                    New Customer?{' '}
                    <Link to={redirect ? `/register?redirect=${redirect}`:'/register'}>Register</Link>
                </Col>
            </Row>

        </FormContainer>
    )
}
