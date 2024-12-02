import React from 'react'
import {Nav, NavItem, NavLink} from "react-bootstrap";

const CheckoutSteps = ({ step1 , step2, step3, step4}) => {
    return (
        <Nav
            className="mb-3 justify-content-center shadow-lg rounded bg-white p-3 "
            style={{
                border: '2px solid #007bff',
                fontSize: '1rem',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            }}
        >
            <NavItem>
                <NavLink href="/login"  disabled={!step1}>Sign In</NavLink>
            </NavItem>
            <NavItem>
                <NavLink href="/Shipping" disabled={!step2}>Shipping</NavLink>
            </NavItem>
            <NavItem>
                <NavLink href="/Payment" disabled={!step3}>Payment</NavLink>
            </NavItem>
            <NavItem>
                <NavLink  href="/placeorder" disabled={!step4} >Place Order</NavLink>
            </NavItem>
        </Nav>
    )
}
export default CheckoutSteps
