import React, {useEffect, useState} from 'react'
import {Link, useNavigate, useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import {
    useCreateProductMutation,
    useGetProductDescriptionQuery,
    useGetProductsQuery,
    useUpdateProductMutation, useUploadImageMutation
} from "../slices/productsApiSlice";
import {Button, Form, FormControl, FormGroup, FormLabel} from "react-bootstrap";
import FormContainer from "../Components/FormContainer";
import Loader from "../Components/Loader";
import Message from "../Components/Message";
import {toast} from "react-toastify";

const ProductEditScreen = () => {
    const {id} = useParams()
    const {data: productData, loading, error} = useGetProductDescriptionQuery(id);
    const navigate =useNavigate();

    const [ updateProduct , {data, loading: loadingUpdate, error: errorUpdate}] = useUpdateProductMutation();
    const [uploadImage ,{ isLoading:isUploadLoading, isError:isUploadError }] = useUploadImageMutation();

    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    const [image, setImage] = useState('')
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');

    useEffect(() => {
        if(productData && !loading && !error){
            setName(productData.name)
            setPrice(productData.price)
            setImage(productData.image)
            setBrand(productData.brand)
            setCategory(productData.category)
            setCountInStock(productData.countInStock)
            setDescription(productData.description)
        }
    },[productData])


    const submitHandler = async (e) => {
        e.preventDefault()
        const updatedProduct ={id, name, price, image, brand, category, countInStock, description}
        const result = await updateProduct(updatedProduct);
        if(result.error){
            toast.error(result.error);
        } else {
            toast.success('Product Updated');
            navigate("/admin/productList")
        }
        
    }
    const uploadImageHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        const result = await uploadImage(formData).unwrap();
        if(result.error){
            toast.error(result.error);
        } else {
            toast.success(result.message);
            setImage(result.imagePath);
        }
    }

        return (
        <>
            <Link to={"/admin/productList"}>
                <Button variant='light' className='btn btn-light my-3'>Go Back</Button>
            </Link>
            <FormContainer>
                <h1>Edit Product</h1>
                {loadingUpdate && <Loader/>}
                {loading ? <Loader/> : error ? <Message varient={ 'danger'}/>: (
                    <Form onSubmit={submitHandler}>
                        <FormGroup className={"my-2"}>
                            <FormLabel >Name</FormLabel>
                            <Form.Control
                                type='name'
                                placeholder='Enter name'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </FormGroup>
                        <FormGroup className={"my-2"}>
                            <FormLabel >Price</FormLabel>
                            <Form.Control
                                type='number'
                                placeholder='Enter price'
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </FormGroup>
                        <FormGroup className={"my-2"}>
                            <FormLabel >Image</FormLabel>
                            <Form.Control
                                type='text'
                                placeholder='Enter image url'
                                value={image}
                                onChange={(e) => setImage}
                            />
                            <FormControl
                                type='file'
                                id='image-file'
                                label='Choose File'
                                custom
                                onChange={uploadImageHandler}
                            >
                            </FormControl>
                        </FormGroup>
                        <FormGroup className={"my-2"}>
                            <FormLabel >Brand</FormLabel>
                            <Form.Control
                                type='text'
                                placeholder='Enter brand'
                                value={brand}
                                onChange={(e) => setBrand(e.target.value)}
                            />
                        </FormGroup>
                        <FormGroup className={"my-2"}>
                            <FormLabel >Category</FormLabel>
                            <Form.Control
                                type='text'
                                placeholder='Enter category'
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            />
                        </FormGroup>
                        <FormGroup className={"my-2"}>
                            <FormLabel >Count In Stock</FormLabel>
                            <Form.Control
                                type='number'
                                placeholder='Enter countInStock'
                                value={countInStock}
                                onChange={(e) => setCountInStock(e.target.value)}
                            />
                        </FormGroup>
                        <FormGroup className={"my-2"}>
                            <FormLabel >Description</FormLabel>
                            <Form.Control
                                type='text'
                                placeholder='Enter description'
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </FormGroup>
                        <Button type='submit' variant='primary' className='my-3'>
                            Update
                        </Button>
                    </Form>
                )}
            </FormContainer>
        </>
    )
}
export default ProductEditScreen
