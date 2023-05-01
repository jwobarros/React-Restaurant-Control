import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Table } from 'react-bootstrap';
import axios from 'axios';

export default function AddIngredientPriceModal({ show, setShow, selectedIngredient }) {
    const [measurement, setMeasurement] = useState('');
    const [price, setPrice] = useState('');
    const [error, setError] = useState('');
    const [selectedPrice, setSelectedPrice] = useState({});


    const [prices, setPrices] = useState([]);


    // Get the token from localStorage
    const token = localStorage.getItem('token');

    // Set the headers for the API request
    const config = {
        headers: { Authorization: `token ${token}` },
    };

    const handlePriceChange = (event) => {
        setPrice(event.target.value);
    };

    const handleMeasurementChange = (event) => {
        setMeasurement(event.target.value);
    };

    const deletePrice = (id) => {

        axios.delete(`https://django-recipe-manager.herokuapp.com/ingredients/${selectedIngredient.id}/prices/delete/${id}/`, config)
            .then(response => {
                getPrices()
            })
            .catch(error => {
                console.log(error);
            });
    }


    const handleFormSubmit = (event) => {
        event.preventDefault();

        if (Object.keys(selectedPrice).length !== 0) {
            axios.put(`https://django-recipe-manager.herokuapp.com/ingredients/${selectedIngredient.id}/prices/${selectedPrice.id}/`, {
                price, measurement
            }, config)
                .then(response => {
                    setMeasurement("")
                    setPrice("")
                    getPrices();
                    setSelectedPrice({})

                })
                .catch(error => {
                    setError(error.response.request.responseText)
                });
        } 
        else {
            axios.post(`https://django-recipe-manager.herokuapp.com/ingredients/${selectedIngredient.id}/prices/`, {
                price, measurement
            }, config)
                .then(response => {
                    getPrices();
                    setMeasurement("")
                    setSelectedPrice({})
                    setPrice("")
                })
                .catch(error => {
                    setError(error.response.request.responseText)
                });
        }
    }


    useEffect(() => {

        if (Object.keys(selectedPrice).length !== 0) {
            setMeasurement(selectedIngredient.measurement)
            setPrice(selectedPrice.price)
        }

    }, [selectedPrice]);


    useEffect(() => {
        
        if (show) {
            getPrices()
        }

    }, [selectedIngredient]);


    const getPrices = () => {
        axios.get(`https://django-recipe-manager.herokuapp.com/ingredients/${selectedIngredient.id}/prices/`, config)
            .then(response => {
                setPrices(response.data)
            })
            .catch(error => {
                console.log(error);
            });
    }

    const handleClosePrice = () => {

        if (Object.keys(selectedPrice).length !== 0) {
            setSelectedPrice({})
        } else {
            setSelectedPrice({})
            setShow(false)
            setMeasurement("")
            setPrice("")
        }
    }


    return (
        <Modal show={show} centered>
            <h4 className='mt-5 mx-2 text-center text-blue'>Add a new cost to {selectedIngredient.name}</h4>
            {prices.length === 0 ? (
                <h6 className='text-center text-blue mt-5 mx-3'>You don`t have prices to this ingredient yet, add a new price now!</h6>
            ) : (
                <Table striped borderless hover responsive className="m-5 mb-2 p-1">
                    <thead>
                        <tr>
                            <th>Price</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {prices.map(price_item => (
                            <tr key={price_item.id}>
                                <td>$ {price_item.price} per {selectedIngredient.measurement}</td>
                                <td>{price_item.created_at}</td>
                                <td>
                                    <Button onClick={() => setSelectedPrice(price_item)} className='mx-2' variant='warning'>edit</Button>
                                    <Button onClick={() => deletePrice(price_item.id)} variant='danger'>delete</Button>
                                </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    )
                }
                <Form className="m-5 mb-2" onSubmit={handleFormSubmit}>
                    <Form.Group className="mt-3" controlId="quantity">
                        <Form.Label>Cost</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter cost"
                            value={price}
                            onChange={handlePriceChange}
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
                        <Button variant="danger" onClick={handleClosePrice}>
                            { selectedPrice.id ? 'Cancel' : 'Close' }
                        </Button>
                        <Button type="submit"> { selectedPrice.id ? 'Edit' : 'Add' } Price</Button>
                    </Modal.Footer>
                </Form>
        </Modal >
    );
}
