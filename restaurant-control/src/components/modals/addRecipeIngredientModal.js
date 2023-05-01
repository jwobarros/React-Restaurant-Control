import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import axios from 'axios';

export default function AddIngredientModal({ show, setShow, recipes, updateIngredients }) {
    const [quantity, setQuantity] = useState('');
    const [measurement, setMeasurement] = useState('');
    const [ingredient, setIngredient] = useState('');
    const [ingredientList, setIngredientList] = useState([]);
    const [error, setError] = useState('');

    // Get the token from localStorage
    const token = localStorage.getItem('token');

     // Set the headers for the API request
     const config = {
        headers: { Authorization: `token ${token}` },
    };

    const handleQuantityChange = (event) => {
        setQuantity(event.target.value);
    };

    const handleMeasurementChange = (event) => {
        setMeasurement(event.target.value);
    };

    const handleIngredientChange = (event) => {
        setIngredient(event.target.value);
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();

        axios.post(`https://django-recipe-manager.herokuapp.com/recipes/${recipes[0].id}/ingredients/`, {
            quantity, measurement, ingredient
        }, config)
            .then(response => {
                updateIngredients(recipes[0].id)
                setShow(false)
                setQuantity("")
                setMeasurement("")
                setIngredient("")
                setError("")

            })
            .catch(error => {
                setError(error.response.request.responseText)
            });
    };

    useEffect(() => {

        getIngredientList()
  
    }, []);

    const getIngredientList = () => {

        axios.get('https://django-recipe-manager.herokuapp.com/ingredients/', config)
            .then(response => {
               setIngredientList(response.data)
            })
            .catch(error => {
                console.log(error);
            });
    };

    return (
        <Modal show={show} centered>
            <h3 className='mt-5 text-center text-blue'>Add a new ingredient</h3>
            <Form id='add-recipe-form' className="m-5 mb-2" onSubmit={handleFormSubmit}>
                <Form.Group controlId="ingredient">
                    <Form.Label>Ingredient</Form.Label>
                    <Form.Control
                        as="select"
                        name="ingredient"
                        value={ingredient}
                        onChange={handleIngredientChange}                        
                    >
                        <option key={ingredient.id} value=''>Select a ingredient</option>

                    {
                        ingredientList.map(ingredient => (
                            <option key={ingredient.id} value={ingredient.id}>{ingredient.name}</option>
                        ))
                    }
                    </Form.Control>
                 </Form.Group>
                <Form.Group className="mt-3" controlId="quantity">
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control
                    type="number"
                    placeholder="Enter quantity"
                    value={quantity}
                    onChange={handleQuantityChange}
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
                    <option value=''>Select a measurement</option>
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
