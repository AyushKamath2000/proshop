import React, {useEffect, useState} from 'react'
import FormContainer from "../Components/FormContainer";
import {Button, Col, Form, FormLabel, Row} from "react-bootstrap";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {useDispatch, useSelector} from "react-redux";
import { useRegisterMutation} from "../slices/userApiSlice";
import Loader from "../Components/Loader";
import {setCredentials} from "../slices/authSlice";

 const RegisterScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [register, {isLoading}] = useRegisterMutation();

    const {userInfo} = useSelector((state) => state.auth)
    const {search} = useLocation();
    const sp = new URLSearchParams(search)
    const redirect = sp.get('redirect') || '/'

    useEffect(() => {
            if (userInfo) {
                navigate(redirect)
            }
        }, [navigate, userInfo, redirect]
    )

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password === confirmPassword) {
            try {
                const res = await register({name,email, password}).unwrap()
                dispatch(setCredentials({...res}));
                navigate(redirect);
            } catch (error) {
                toast.error(error?.data?.message || error?.message)
            }
        } else {
            toast.error("Passwords do not match");
        }
    }
        return (
            <FormContainer>
                <h1>Register User</h1>
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
                    <Button type={"submit"} variant={"primary"} className={"mt-2 float-end"} disabled={isLoading}>REGISTER</Button>
                    {isLoading && <Loader/>}
                </Form>
                <Row className='py-3' style={{fontSize: '1rem'}}>
                    <Col>
                        Already Registered?{' '}
                        <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>Login</Link>
                    </Col>
                </Row>
            </FormContainer>
        )
 }


export default RegisterScreen;
