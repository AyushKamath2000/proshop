import React from 'react'
import {useGetTopRatedProductsQuery} from "../slices/productsApiSlice";
import Message from "./Message";
import {Carousel, Image} from "react-bootstrap";
import {Link} from "react-router-dom";
import Loader from "./Loader";

const ProductCarousel = () => {
    const {data:products, error, loading} = useGetTopRatedProductsQuery();
    return(
    loading ? (<Loader/>) :
            error ? (<Message variant={'danger'}>{error}</Message> ) : products && (
                <Carousel className={'mb-2 small-carousel'}>
                    {products.map((product) => (
                        <Carousel.Item key={product._id}>
                            <Link to={`/products/${product._id}`}>
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                />
                                <Carousel.Caption>
                                    <h2>{product.name} (${product.price})</h2>
                                </Carousel.Caption>
                            </Link>
                        </Carousel.Item>
                    ))}
                </Carousel>
            )
    )
}
export default ProductCarousel
