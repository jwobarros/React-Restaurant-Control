import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import axios from 'axios';

export default function NewRecipeModal({ show, setShow, updateRecipes }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    // Get the token from localStorage
    const token = localStorage.getItem('token');

     // Set the headers for the API request
     const config = {
        headers: { Authorization: `token ${token}` },
    };

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        
        axios.post('http://127.0.0.1:8000/recipes/', {
            name, description
        }, config)
            .then(response => {
                setName('')
                setDescription('')
                setShow(false)
                updateRecipes()
            })
            .catch(error => {
                console.log(error);
            });
    };

    return (
        <Modal show={show} centered>
            <h3 className='mt-5 text-center text-blue'>Add a new recipe</h3>
            <Form id='add-recipe-form' className="m-5 mb-2" onSubmit={handleFormSubmit}>
                <Form.Group className="mt-1" controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        value={name}
                        onChange={handleNameChange}
                        placeholder="Enter name"
                    />
                </Form.Group>
                <Form.Group className="mt-3" controlId="description">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        name="name"
                        value={description}
                        onChange={handleDescriptionChange}
                        placeholder="Enter description"
                    />
                </Form.Group>
                <Modal.Footer className='d-flex justify-content-around pb-0 mt-5'>
                    <Button variant="danger" onClick={() => setShow(false)}>
                    Close
                    </Button>
                    <Button type="submit">Add Recipe</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}
