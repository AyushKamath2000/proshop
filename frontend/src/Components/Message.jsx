import React from 'react'
import {Alert} from "react-bootstrap";

const Message = ({ varient ,Children }) => {
    return (
        <Alert variant={varient}>
            {Children}
        </Alert>
    )
}    
Message.defaultProps = {
    varient: 'info'
};
export default Message;
