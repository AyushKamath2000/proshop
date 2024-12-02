import React, {useEffect} from 'react'
import FormContainer from "../Components/FormContainer";
import CheckoutSteps from "../Components/CheckoutSteps";
import {Button, Form, FormCheck, FormGroup} from "react-bootstrap";
import {savePaymentMethod} from "../slices/cartSlice";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";

const PaymentScreen = () => {
    const [paymentMethod, setPaymentMethod] = React.useState('PayPal');
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const cart = useSelector(state => state.cart);
    const {shippingAddress} = cart;
    
    
     useEffect(() => {
        if (!shippingAddress) {
            navigate("/login")
        }
     }, [shippingAddress, navigate]);
    
    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(savePaymentMethod(paymentMethod));
        navigate("/placeorder")
    }
    return (
        <FormContainer>
            <CheckoutSteps step1 step2 step3/>
            <h1> Payment Methods</h1>
            <Form  onSubmit={(e)=>{submitHandler(e)}}>
                <FormGroup>
                    <FormCheck
                        className={"mt-3"}
                        type="radio"
                        label="PayPal or Credit Card"
                        id="PayPal"
                        name="paymentMethod"
                        checked
                        value = "PayPal"
                        onChange ={(e)=> setPaymentMethod(e.target.value)}
                    />
                    <FormCheck
                        className={"mt-3"}
                        type="radio"
                        label="Unified Payment Interface(UPI)"
                        id="UPI"
                        name="paymentMethod"
                        value = "UPI"
                        onChange ={(e)=> setPaymentMethod(e.target.value)}
                    />
                    <Button type={"submit"} variant={"primary"} className={"mt-3 float-end"}>
                        Continue
                    </Button>
                </FormGroup>
                
            </Form>
            
        </FormContainer>
    )
}
export default PaymentScreen
