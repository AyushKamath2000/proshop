import React, {useEffect} from 'react'
import {Link, useNavigate, useParams} from "react-router-dom";
import {
    Button,
    Card,
    Col,
    Form,
    FormControl,
    FormGroup,
    FormLabel,
    ListGroup,
    ListGroupItem,
    Row
} from "react-bootstrap";
import Ratings from "../Components/Ratings";
import {
    useCreateProductReviewMutation,
    useGetProductDescriptionQuery
} from "../slices/productsApiSlice";
import {useState} from "react";
import Loader from "../Components/Loader";
import Message from "../Components/Message";
import {useDispatch, useSelector} from "react-redux";
import {addToCart} from "../slices/cartSlice";
import {toast} from "react-toastify";

const styles = {
    listGroupItem: {
        padding: '15px',
        borderRadius: '12px',
        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
        margin: '15px',
        background: 'linear-gradient(135deg, #f3f4f6, #ffffff)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        border: 'none',
    },
    listGroupItemHover: {
        transform: 'translateY(-5px)',
        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
    },
    strong: {
        fontSize: '1.2em',
        color: '#333',
        marginBottom: '5px',
        display: 'block',
    },
    paragraph: {
        margin: '5px 0',
        color: '#555',
        fontSize: '0.9em',
    },
    ratings: {
        margin: '10px 0',
        display: 'inline-flex',
        alignItems: 'center',
    },
    star: {
        marginLeft: '5px',
        color: '#ffbf00',
        fontSize: '1em',
    },
};

const ProductScreen = () => {
    const { id: productID } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [qty, setQty] = useState(1);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const cart = useSelector(state => state.cart);
    const { cartItems } = cart;
    const cartItem = cartItems.find(cartItem => cartItem._id === productID);
    const [ createProductReview, { isLoading:reviewLoading ,isError: reviewError } ] = useCreateProductReviewMutation();
    const { userInfo } = useSelector(state => state.auth);
    

    useEffect(() => {
        if (cartItem) {
            setQty(cartItem.qty);
        }
    }, [cartItem, setQty]);
    const { data: product, isLoading, error, refetch } = useGetProductDescriptionQuery(productID);

    if (isLoading) return <Loader/>;
    if (error) return <Message varient="danger">`Error Loading Data{error.error|| error?.data?.message}`</Message>;

    const addToCartHandler = (product,qty) => {
        dispatch(addToCart({ ...product, qty }));
        navigate("/cart");
    };
    
    const submitHandler = async  (e) => {
        e.preventDefault();
        try {
            await createProductReview({id: productID, rating, comment}).unwrap();
            refetch();
            setRating(0);
            setComment('');
            toast.success('Review Submitted');
        } catch (err) {
            toast.error(err?.data?.message || err?.error);
        }
    }

    return (
        <>
            <Link className="btn btn-light my-3" to="/">Go Back</Link>
            {isLoading ? (<Loader/>):
                error ? (<Message variant="danger">{error.error || error?.data?.message}</Message>) : (
            <>
            <Row>
                <Col md={5} >
                    <img src={product.image} alt={product.name} className="img-fluid" />
                </Col>
                <Col md={4}>
                    <ListGroup variant={"flush"}>
                        <ListGroupItem>
                            <strong>{product.name}</strong>
                        </ListGroupItem>
                        <ListGroupItem>
                            <Ratings value={product.rating} text={`${product.numReviews} reviews`} />
                        </ListGroupItem>
                        <ListGroupItem>
                            {product.description}
                        </ListGroupItem>
                    </ListGroup>
                </Col>
                <Col md ={3}>
                    <Card>
                        <ListGroup variant={"flush"}>
                            <ListGroupItem>
                                <Row>
                                    <Col>Price:</Col>
                                    <Col>
                                        <strong>${product.price}</strong>
                                    </Col>
                                </Row>
                            </ListGroupItem>
                            <ListGroupItem>
                                <Row>
                                    <Col>Status:</Col>
                                    <Col><strong>{product.countInStock > 0 ? "In Stock" : "Out of Stock"}</strong></Col>
                                </Row>
                            </ListGroupItem>
                            {product.countInStock > 0 && (
                                <ListGroupItem>
                                    <Row>
                                        <Col>Qty</Col>
                                            <Col>
                                               <Form.Control
                                                      as="select"
                                                      value={qty}
                                                      onChange={(e) => setQty(Number(e.target.value))}
                                               >
                                                   {[...Array(product.countInStock).keys()].map( (i)=>
                                                       <option key={i + 1} value={i + 1}>
                                                           {i + 1}
                                                       </option>
                                                   )}
                                               </Form.Control>
                                            </Col>
                                    </Row>
                                </ListGroupItem>)}
                                <ListGroupItem>
                                    <button
                                        style={{ width: '100%' }}
                                        className="btn btn-dark"
                                        disabled={product.countInStock === 0}
                                        onClick={() => addToCartHandler(product, qty)}
                                    >
                                        Add to Cart
                                    </button>
                                </ListGroupItem>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
                <Row className={'reviews'}>
                  <Col md={6}>
                      <Card style={{ padding: '10px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', margin : '10px' }}>
                          Reviews
                      </Card>
                        {product.reviews.length === 0 && <Message>No Reviews</Message>}
                        <ListGroup variant={'flush'}>
                            {product.reviews.map(review => (
                                <ListGroupItem key={review.id} style={styles.listGroupItem}>
                                    <strong style={styles.strong}>{review.name}</strong>
                                    <Ratings style={styles.star} value={review.rating} />
                                    <p style={styles.paragraph}>{review.createdAt.substring(0, 10)}</p>
                                    <p style={styles.paragraph}>{review.comment}</p>
                                </ListGroupItem>
                            ))}
                            <ListGroupItem>
                                <Card style={{ padding: '10px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', margin : '8px'  }}>
                                    Write a customer Review
                                </Card>
                                {reviewLoading && <Loader/>}
                                {reviewError && <Message variant={'danger'}>{reviewError.error || reviewError?.data?.message}</Message>}
                                {userInfo ? (
                                    <Form onSubmit={submitHandler}>
                                        <FormGroup controlId={'rating'}>
                                            <FormLabel>Rating</FormLabel>
                                            <FormControl as={'select'}
                                                            value={rating}
                                                            onChange={(e) => setRating(Number(e.target.value))}>
                                                <option value={''}>Select...</option>
                                                <option value={1}>1-Poor</option>
                                                <option value={2}>2-Fair</option>
                                                <option value={3}>3-Good</option>
                                                <option value={4}>4-Very Good</option>
                                                <option value={5}>5 -Excellent</option>
                                            </FormControl>
                                            <FormGroup controlId={'comment'}>
                                                <FormLabel>Comment</FormLabel>
                                                <FormControl as={'textarea'}
                                                                row={3}
                                                                value={comment}
                                                                onChange={(e) => setComment(e.target.value)}
                                                />
                                            </FormGroup>
                                        </FormGroup>
                                        <Button disabled ={reviewLoading} 
                                                className={"mt-3 float-end"}
                                                type="submit"
                                                variant="primary" 
                                        >Submit</Button>
                                    </Form>
                                ) : (<Message>Please <Link to={'/login'}>Sign In</Link> to write a review</Message>)}
                                            
                            </ListGroupItem>
                        </ListGroup>
                  </Col>         
                </Row>
            </>
         )}            
        </>
    );
}

export default ProductScreen;
