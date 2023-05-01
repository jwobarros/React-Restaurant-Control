import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import axios from 'axios';

export default function AddIngredientModal({ show, setShow, updateIngredients, selectedIngredient }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [measurement, setMeasurement] = useState('');
    const [article_number, setArticleNumber] = useState('');
    const [error, setError] = useState('');

    // Get the token from localStorage
    const token = localStorage.getItem('token');

     // Set the headers for the API request
     const config = {
        headers: { Authorization: `token ${token}` },
    };

    const handleArticleNumberChange = (event) => {
        setArticleNumber(event.target.value);
    };

    const handleMeasurementChange = (event) => {
        setMeasurement(event.target.value);
    };

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();

        if (Object.keys(selectedIngredient).length !== 0) {
            axios.put(`http://127.0.0.1:8000/ingredients/${selectedIngredient.id}/`, {
                name, description, article_number, measurement 
            }, config)
                .then(response => {
                    setShow(false)
                    setName("")
                    setDescription("")
                    setMeasurement("")
                    setArticleNumber("")
                    updateIngredients()
                })
                .catch(error => {
                    setError(error.response.request.responseText)
                });
             } else {
            axios.post('http://127.0.0.1:8000/ingredients/', {
                name, description, article_number, measurement 
            }, config)
                .then(response => {
                    setShow(false)
                    setName("")
                    setDescription("")
                    setMeasurement("")
                    setArticleNumber("")
                    updateIngredients()
                })
                .catch(error => {
                    setError(error.response.request.responseText)
                });
            }
    };

    useEffect(() => {

        if (Object.keys(selectedIngredient).length !== 0) {
            setName(selectedIngredient.name)
            setDescription(selectedIngredient.description)
            setMeasurement(selectedIngredient.measurement)
            setArticleNumber(selectedIngredient.article_number)
        }

    }, [selectedIngredient]);

    return (
        <Modal show={show} centered>
            <h3 className='mt-5 text-center text-blue'>Add a new ingredient</h3>
            <Form className="m-5 mb-2" onSubmit={handleFormSubmit}>
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
                <Form.Group className="mt-3" controlId="quantity">
                    <Form.Label>Article Number</Form.Label>
                    <Form.Control
                    type="number"
                    placeholder="Enter Article Number"
                    value={article_number}
                    onChange={handleArticleNumberChange}
                    />
                </Form.Group>
                <Form.Group className="mt-3" controlId="measurement">
                    <Form.Label>Measurement</Form.Label>
                    <Form.Control
                        as="select"
                        name="name"
                        value={measurement}
                        onChange={handleMeasurementChange}                        
                    >
                    <option value=''>Select a default measurement</option>
                    <option value="pc">Piece</option>
                    <option value="g">gram</option>
                    <option value="kg">kilogram</option>
                    <option value="lb">Pound</option>
                    <option value="oz">Ounce</option>
                    <option value="cl">Centiliter</option>
                    <option value="ml">Milliliter</option>
                    <option value="l">Liter</option>
                    <option value="fl. oz">Fluid Ounce</option>
                    <option value="gal">Gallon</option>
                    <option value="in">Inch</option>
                    <option value="ft">Foot</option>
                    <option value="yd">Yard</option>
                    <option value="mi">Mile</option>
                    <option value="cm">Centimeter</option>
                    <option value="m">Meter</option>
                    <option value="km">Kilometer</option>
                    </Form.Control>
                </Form.Group>
                {
                    error !== '' ? (
                        <div className="alert alert-danger mt-5" role="alert">
                            {error}
                        </div>

                    ) : (false)
                }
                <Modal.Footer className='d-flex justify-content-around pb-0 mt-5'>
                    <Button variant="danger" onClick={() => setShow(false)}>
                        Close
                    </Button>
                    <Button type="submit">Add Ingredient</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}
