import React, {useState} from 'react'
import {useDispatch, useSelector} from "react-redux";
import FormContainer from "../Components/FormContainer";
import {Button, Form, FormControl, FormGroup, FormLabel} from "react-bootstrap";
import {saveShippingAddress} from "../slices/cartSlice";
import {useNavigate} from "react-router-dom";
import CheckoutSteps from "../Components/CheckoutSteps";

function ShippingScreen() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cart = useSelector(state => state.cart);
    const {shippingAddress } = cart;

    const [address, setAddress] = useState( shippingAddress?.address || '' );
    const [city, setCity] = useState( shippingAddress?.city || '' );
    const [postalCode, setPostalCode] = useState( shippingAddress?.postalCode || '' );
    const [country, setCountry] = useState( shippingAddress?.country || '' );


    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(saveShippingAddress({address, city, postalCode, country}));
        navigate("/payment")
    };

    return (
        <FormContainer>
            <CheckoutSteps step1 step2/>
            <h1>Shipping</h1>
            <Form onSubmit={submitHandler}>
                <FormGroup>
                    <FormLabel className={"mt-2"} >Address</FormLabel>
                    <FormControl
                        type="text"
                        placeholder="Enter Address"
                        className={"mt-2"}
                        value={address} onChange={e => setAddress(e.target.value)}
                    />
                </FormGroup>
                <FormGroup>
                    <FormLabel className={"mt-2"}>City</FormLabel>
                    <FormControl
                        type="text"
                        placeholder="Enter City"
                        className={"mt-2"}
                        value={city} onChange={e => setCity(e.target.value)}
                    />
                </FormGroup>
                <FormGroup>
                    <FormLabel className={"mt-2"}>Postal Code</FormLabel>
                    <FormControl
                        type="text"
                        placeholder="Enter Postal Code"
                        className={"mt-2"}
                        value={postalCode} onChange={e => setPostalCode(e.target.value)}
                    />
                </FormGroup>
                <FormGroup>
                    <FormLabel className={"mt-2"}>Country</FormLabel>
                    <FormControl
                        type="text"
                        placeholder="Enter Country"
                        className={"mt-2"}
                        value={country} onChange={e => setCountry(e.target.value)}
                    />
                </FormGroup>
                <Button
                    className={"mt-3 float-end"}
                    type="submit"
                    variant="primary"
                >
                    Continue
                </Button>
            </Form>

        </FormContainer>
    )
}

export default ShippingScreen
