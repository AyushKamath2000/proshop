import React from 'react'
import {Link} from "react-router-dom";
import {LinkContainer} from "react-router-bootstrap";
import {PageItem} from "react-bootstrap";

const Paginate = ({pages,page,isAdmin =false ,keyword = ''}) => {
    return (
        pages> 1 && (
            <nav>
                <ul className="pagination">
                    {[...Array(pages).keys()].map(x => (
                        <LinkContainer
                            key={x+1} 
                            className={x+1 === page ? 'page-item active' : 'page-item'}
                            to={isAdmin ? `/admin/productlist/${x+1}` : (keyword ? `/search/${keyword}/page/${x+1}`: `/page/${x+1}`) }
                        >
                            <PageItem active={x+1===page}>{x+1}</PageItem>
                        </LinkContainer>
                    ))}
                </ul>
            </nav>
        )
    )
}
export default Paginate
