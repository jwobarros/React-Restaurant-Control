import React from 'react';
import { Nav } from 'react-bootstrap';



export default function Home() {
    return (
        <div className='d-flex justify-content-center align-items-center vh-100'>
            <style type="text/css">
                {`
                body {
                    background-color: #cfe2ff;
                }
                `}
            </style>
            <div>
                <h1 className='text-center text-danger fw-bold' style={{fontSize: '10rem'}}>404</h1>
                <h3 className='text-center text-muted fs-2'>Ops, page not found!</h3>
                <hr />
                <Nav.Link className='text-center' href="/">Home</Nav.Link>
            </div>
        </div>
    );
}

