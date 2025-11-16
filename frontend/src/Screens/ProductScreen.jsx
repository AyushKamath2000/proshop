import React, {useEffect, useState} from 'react'
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
import Loader from "../Components/Loader";
import Message from "../Components/Message";
import {useDispatch, useSelector} from "react-redux";
import {addToCart} from "../slices/cartSlice";
import {toast} from "react-toastify";
import AISummary from "../Components/AISummary";
import generateStructuredReview from "../Google/Config";

const styles = {
    listGroupItem: {
        padding: '15px',
        borderRadius: '12px',
        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
        margin: '15px',
        background: 'linear-gradient(135deg, #f3f4f6, #ffffff)',
        transition: 'transform 0.2s ease, boxShadow 0.2s ease',
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
    const { cartItems } = useSelector(state => state.cart || { cartItems: [] });
    const cartItem = cartItems.find(ci => ci._id === productID);

    const [createProductReview, { isLoading: reviewLoading, isError: reviewError }] = useCreateProductReviewMutation();
    const { userInfo } = useSelector(state => state.auth || {});
    const [geminiResponse, setGeminiResponse] = useState(null);
    const [geminiLoading, setGeminiLoading] = useState(false);

    const { data: product, isLoading, error, refetch } = useGetProductDescriptionQuery(productID);

    // Calls Gemini and expects an object; tolerate stringified JSON too.
    async function callGoogleGemini(requestedData) {
        if (!requestedData) return;
        setGeminiLoading(true);
        try {
            const raw = await generateStructuredReview(requestedData);
            // Accept either object or JSON string
            let parsed = raw;
            if (typeof raw === 'string') {
                try {
                    parsed = JSON.parse(raw);
                } catch (parseErr) {
                    // if it's a text block with code fences or extra text, try to extract JSON chunk
                    const jsonMatch = raw.match(/\{[\s\S]*\}/);
                    if (jsonMatch) {
                        parsed = JSON.parse(jsonMatch[0]);
                    } else {
                        // fallback: keep raw as text in a safe shape
                        parsed = { product_name: requestedData, product_description: String(raw), pros: [], cons: [], rating: null };
                    }
                }
            }

            // Normalize fields so component rendering is robust
            const normalized = {
                product_name: parsed.product_name || parsed.name || requestedData,
                product_description: parsed.product_description || parsed.description || '',
                pros: parsed.pros || parsed.Pros || parsed.positive || [],
                cons: parsed.cons || parsed.Cons || parsed.negative || [],
                rating: parsed.rating ?? parsed.Rating ?? null
            };

            setGeminiResponse(normalized);
            console.log('Google Gemini API response (normalized):', normalized);
        } catch (e) {
            console.error('Error calling Google Gemini API and parsing:', e);
            // keep geminiResponse null so UI shows nothing instead of crashing
        } finally {
            setGeminiLoading(false);
        }
    }

    // Only call when product.name exists and we don't already have a response
    useEffect(() => {
        if (product?.name && !geminiResponse && !geminiLoading) {
            callGoogleGemini(product.name);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [product?.name]);

    useEffect(() => {
        if (cartItem) {
            setQty(cartItem.qty);
        }
    }, [cartItem, setQty]);

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
                    <Col md={6}>
                        {geminiLoading && (
                            <Card style={{ padding: '20px', textAlign: 'center', borderRadius: '10px' }}>
                                <Loader />
                                <p style={{ marginTop: '10px', color: '#555' }}>Generating AI Summary...</p>
                            </Card>
                        )}

                        {!geminiLoading && geminiResponse && (
                            <AISummary geminiResponse={geminiResponse} />
                        )}

                        {!geminiLoading && !geminiResponse && (
                            <Card style={{ padding: '20px', textAlign: 'center', borderRadius: '10px' }}>
                                <p style={{ color: '#777' }}>AI summary unavailable.</p>
                            </Card>
                        )}
                    </Col>
                </Row>
            </>
         )}            
        </>
    );
}

export default ProductScreen;
