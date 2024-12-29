import React from 'react'
import {useDeleteUserMutation, useGetUsersQuery} from "../slices/userApiSlice";
import {Button, Table} from "react-bootstrap";
import Message from "../Components/Message";
import Loader from "../Components/Loader";
import {FaCheck, FaEdit, FaTimes, FaTrash} from "react-icons/fa";
import {LinkContainer} from "react-router-bootstrap";
import {toast} from "react-toastify";

const UserListScreen = () => {
    const { data: users, isLoading: usersLoading, isError: usersLoadingError, refetch } = useGetUsersQuery();
    const [deleteUser,{isLoading, isError}] = useDeleteUserMutation();
    console.log(users)

    const deleteHandler = async (id) => {
        try{
            await deleteUser(id).then((data) => {refetch()});
            toast.success('User Deleted Successfully')
        } catch(err) {
            toast.error(err?.data?.message || err?.error)
        }
    }

    return (
        <>
            <h1>USERS</h1>
            {usersLoading ? <Loader/> : usersLoadingError ? <Message variant='danger'>{usersLoadingError}</Message> : (
                <Table stripped >
                    <th>ID</th>
                    <th>user name</th>
                    <th>email</th>
                    <th>admin</th>
                    <th>action</th>
                    <tbody>
                    {users.map(user => (
                        <tr key={user._id}>
                            <td>{user._id}</td>
                            <td>{user.name}</td>
                            <td><a href={`mailto:${user.email}`}>{user.email}</a></td>
                            <td>{user.isAdmin ? (<FaCheck style ={{ color: 'green'}}/>) : (<FaTimes style ={{ color: 'red'}}/>)}</td>
                            <td>
                                <LinkContainer to={`/admin/user/${user._id}/edit`}>
                                    <Button variant={"light"} className ={"btn-sm mx-2"}>
                                        <FaEdit/>
                                    </Button>
                                </LinkContainer>
                                <Button
                                    variant={"light"}
                                    className ={"btn-sm mx-2"}
                                    onClick={() => {
                                        deleteHandler(user._id)
                                    }}
                                >
                                    <FaTrash/>
                                </Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>)}
        
        </>
    )
}
export default UserListScreen;
