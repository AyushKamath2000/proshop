import React from 'react'
import {Navbar, Nav, Container, Badge, NavLink, NavDropdown, Image} from 'react-bootstrap'
import{ FaShoppingCart, FaUser } from 'react-icons/fa'
import{ LinkContainer } from 'react-router-bootstrap'
import {useDispatch, useSelector} from "react-redux";
import  img  from '../Assets/img.png'
import {useNavigate} from "react-router-dom";
import { logout } from "../slices/authSlice";
import {useLogoutMutation} from "../slices/userApiSlice";
const Header = () => {
    const {cartItems} = useSelector(state => state.cart);
    const {userInfo} = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [logoutApiCall] = useLogoutMutation()
    const logoutHandler = async  () =>{
        try{
            await logoutApiCall().unwrap()
            dispatch(logout())
            navigate('/login')
        } catch(error){
            console.log(error)
        }
    }

    return (
        <header>
                <Navbar bg="dark" variant="dark" expand="md" collapseOnSelect>
                    <Container>
                        <LinkContainer to = "/">
                            <Navbar.Brand href="/">
                                <Image rounded src={ img } alt={"YOU ARE PRO"} style={{ height: '40px', width: '40px' , padding: '2px'}} />
                                ProShop
                            </Navbar.Brand>
                        </LinkContainer>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="ms-auto">
                            <LinkContainer to = "/cart">
                                <NavLink  href="/cart">
                                    <FaShoppingCart />
                                    Cart{cartItems.length>0 &&
                                    (<Badge
                                        pill
                                        bg = 'success' 
                                        style ={{ marginLeft: 5 }} 
                                    >{cartItems.reduce((acc,item)=>acc+item.qty,0)}
                                    </Badge>)}
                                </NavLink>
                            </LinkContainer>
                                { userInfo ? (
                                        <NavDropdown title={userInfo.name} >
                                            <LinkContainer to = "/profile">
                                                <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
                                            </LinkContainer>
                                            <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
                                        </NavDropdown>

                                    ) :
                                    (
                                        <LinkContainer to = "/login">
                                            <NavLink to='/login'> <FaUser /> Sign In</NavLink>
                                        </LinkContainer>
                                    )
                                }

                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
        </header>
    )
}
export default Header

