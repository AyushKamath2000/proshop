import React from 'react'
import{ Navbar, Nav, Container } from 'react-bootstrap'
import{ FaShoppingCart, FaUser } from 'react-icons/fa'
import{ LinkContainer } from 'react-router-bootstrap'
import  img  from '../Assets/img.png'
const Header = () => {
    return (
        <header>
                <Navbar bg="dark" variant="dark" expand="md" collapseOnSelect>
                    <Container>
                        <LinkContainer to = "/">
                            <Navbar.Brand href="/">
                                <img src={ img } alt={"YOU ARE PRO"} style={{ height: '40px', width: '40px' , padding: '2px' }} />
                                ProShop
                            </Navbar.Brand>
                        </LinkContainer>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="ms-auto">
                            <LinkContainer to = "/">
                                <Nav.Link href="/cart"><FaShoppingCart /> Cart</Nav.Link>
                            </LinkContainer>
                            <LinkContainer to = "/">
                                <Nav.Link href="/login"><FaUser /> Sign In</Nav.Link>
                            </LinkContainer>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
        </header>
    )
}
export default Header

