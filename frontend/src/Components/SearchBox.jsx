import React, {useState} from 'react'
import {useNavigate, useParams} from "react-router-dom";
import {Button, Form} from "react-bootstrap";

const SearchBox = () => {
    const navigate = useNavigate();
    const {keyword: urlKeyword} = useParams();
    const [keyword,setKeyword] = useState(urlKeyword || '');
    
    const submitHandler = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            navigate(`/search/${keyword}`)
        } else {
            navigate(`/`)
        }
    }
    return (
        <Form onSubmit={submitHandler} className={'d-flex'}>
            <Form.Control
                type="text"
                name="q"
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search Products..."
                className="mr-sm-2 ml-sm-5 m-2"
                value ={keyword}
            />
            <Button variant={'outline-light'} type="button" className="btn my-2" onClick={() => {
                if (keyword.trim()) {
                    navigate(`/search/${keyword}`)
                } else {
                    navigate(navigate(`/`))
                }
            }}>Search</Button>
        </Form>
    )
}
export default SearchBox
