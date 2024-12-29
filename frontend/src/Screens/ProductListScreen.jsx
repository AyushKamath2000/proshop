import React from 'react'
import {useCreateProductMutation, useDeleteProductMutation, useGetProductsQuery} from "../slices/productsApiSlice";
import Loader from "../Components/Loader";
import {Button, Col, Row, Table} from "react-bootstrap";
import {FaEdit, FaTrash} from "react-icons/fa";
import Message from "../Components/Message";
import {LinkContainer} from "react-router-bootstrap";
import {toast} from "react-toastify";

const ProductListScreen = () => {
    const { data: products , isLoading: productsLoading, isError:ProductsLoadingError,refetch } = useGetProductsQuery();
    const [createProduct ,{ isLoading: crateLoading, isError: errorCreating}] = useCreateProductMutation();
    const [deleteProduct ,{ isLoading: isDeleteLoading, isError: deletingError}] = useDeleteProductMutation();
    
    const deleteHandler = async (id) => {
        try{
            await deleteProduct(id).then((data) => {refetch()});
        } catch(err) {
            toast.error(err?.data?.message || err?.error)
        }
    }

    const createProductHandler = async () => {
        try{
            await createProduct().then((data) => {refetch()});
        } catch(err){ 
            toast.error(err?.data?.message || err?.error)
        }
    }
    console.log(products)
    return (
        <>
        <Row className={"align-items-center"}>
            <Col>
                <h1>Products List</h1>
            </Col>
            <Col className={"text-end"}>
                <Button className={"btn-sm m-3"} onClick={createProductHandler}>
                   <FaEdit/> Add Product
                </Button>
            </Col>
        </Row>
            {crateLoading||isDeleteLoading && <Loader/>}
            {productsLoading ? <Loader/> : ProductsLoadingError ? <Message variant ='danger'> {ProductsLoadingError}</Message>: (
                <>
                <Table stripped hover responsive className={"table-sm"}>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>NAME</th>
                        <th>PRICE</th>
                        <th>CATEGORY</th>
                        <th>BRAND</th>
                        <th>button</th>
                      </tr>
                    </thead>
                    <tbody>
                    {products.map(product => (
                        <tr key = {product._id}>
                          <td>{product._id}</td>
                          <td>{product.name}</td>
                          <td>{product.price}</td>
                          <td>{product.category}</td>
                          <td>{product.brand}</td> 
                          <td>
                              <LinkContainer to ={`/admin/products/${product._id}/edit`}>
                                  <Button  variant={"light"} className ={"btn-sm mx-2"} > <FaEdit/></Button>
                              </LinkContainer>
                              <Button  variant={"light"} className ={"btn-sm mx-2"} onClick={ ()=>deleteHandler(product._id)} > <FaTrash/></Button>
                          </td>  
                        </tr>
                    ))}
                    </tbody>
                </Table>
                </>
            )}
        </>
    )
}
export default ProductListScreen
