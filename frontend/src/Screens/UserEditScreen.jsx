import React, {useEffect, useState} from 'react'
import {useGetUserDetailsQuery, useUpdateUserMutation} from "../slices/userApiSlice";
import {useDispatch} from "react-redux";
import {Link, useNavigate, useParams} from "react-router-dom";
import {Button, Col, Form, FormCheck, FormLabel} from "react-bootstrap";
import {toast} from "react-toastify";
import {setCredentials} from "../slices/authSlice";
import Loader from "../Components/Loader";
import Message from "../Components/Message";
import FormContainer from "../Components/FormContainer";

const UserEditScreen = () => {
    const {id: userId} = useParams();
    const { data: user, isLoading , refetch , isError } = useGetUserDetailsQuery(userId);
    const [updateUser, {isLoading: updateLoading, isError: updateError}] = useUpdateUserMutation();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    useEffect(()=>{
        console.log(user)
        if(user){
            setName(user.name);
            setEmail(user.email);
            setIsAdmin(user.isAdmin);
        }
    },[user])

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await updateUser({ id:userId, email ,name, isAdmin});
            toast.success('User Updated Successfully');
            refetch();
            navigate('/admin/userList')
        } catch (error) {
            toast.error('Error updating User');
        }
    }
    
    
    
    return (
<>
    <Link to={"/admin/userList"}>
        <Button variant='light' className='btn btn-light my-3'>Go Back</Button>
    </Link>
    <FormContainer>
        <h1>Edit User Profile </h1>
        {updateLoading && <Loader/>}
        {isLoading ? <Loader/> : isError ? <Message varient={ 'danger'}/>: (
    <Form onSubmit={submitHandler}>
        <Form.Group controlId={"name"} className={"my-3"}>
            <FormLabel column={"lg"}>Name</FormLabel>
            <Form.Control
                type={"text"}
                placeholder={"Enter Name"}
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
        </Form.Group>
        <Form.Group controlId={"email"} className={"my-3"}>
            <FormLabel column={"lg"}>Email Address</FormLabel>
            <Form.Control
                type={"email"}
                placeholder={"Enter Email"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
        </Form.Group>
        <Form.Group className={"my-3"}>
            <FormCheck
                type={"checkbox"}
                label={"Is Admin"}
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
            />
        </Form.Group>

        <Button type={"submit"} variant={"primary"} className={"mt-2 float-end"}>UPDATE USER</Button>
    </Form>
)}
</FormContainer>
</>
)
}
export default UserEditScreen
