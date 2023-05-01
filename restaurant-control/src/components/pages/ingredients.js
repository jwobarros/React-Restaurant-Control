import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Table } from 'react-bootstrap';
import AddIngredientModal from "../modals/addIngredientModal";
import AddIngredientPriceModal from "../modals/addIngredientPriceModal";


function IngredientsPage() {
    const [filteredIngredients, setFilteredIngredients] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIngredient, setSelectedIngredient] = useState({});


    const [showAddModal, setShowAddModal] = useState(false);
    const [showAddPriceModal, setShowAddPriceModal] = useState(false);


    // Get the token from localStorage
    const token = localStorage.getItem('token');

    // Set the headers for the API request
    const config = {
        headers: { Authorization: `token ${token}` },
    };

    const updateIngredients = () => {
        // Make the API request to get the recipes
        axios.get('https://django-recipe-manager.herokuapp.com/ingredients/', config)
            .then(response => {
                // Set the recipes in state
                setIngredients(response.data);
                setFilteredIngredients(response.data);
                setSelectedIngredient("")
            })
            .catch(error => {
                console.log(error);
            });
    }

    useEffect(() => {

        updateIngredients()

    }, []);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        const filtered = ingredients.filter((ingredient) =>
        (ingredient.name.toLowerCase().includes(event.target.value.toLowerCase()) ||
            ingredient.article_number.toString().includes(event.target.value.toLowerCase()))
        );
        setFilteredIngredients(filtered);
    };

    const deleteIngredient = (id) => {

        axios.delete(`https://django-recipe-manager.herokuapp.com/ingredients/delete/${id}/`, config)
            .then(response => {
                updateIngredients();
            })
            .catch(error => {
                console.log(error);
            });
    }

    return (
        <Container>
            <AddIngredientModal
                    show={showAddModal}
                    setShow={setShowAddModal}
                    selectedIngredient={selectedIngredient}
                    updateIngredients={updateIngredients}
                />
            <AddIngredientPriceModal 
                show={showAddPriceModal}
                setShow={setShowAddPriceModal}
                selectedIngredient={selectedIngredient}
            />
            <Row className='mt-5'>
                <Col md={12}>
                    <Form>
                        <Form.Group className="mb-3" controlId="formSearch">
                            <Form.Control
                                type="text"
                                placeholder="Search by ingredient name or article number"
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
            <Row className='mt-3'>
                <Button className='my-3' onClick={() => setShowAddModal(true)}>Add Ingredient</Button>
                {filteredIngredients.length === 0 ? (
                    <h3 className='text-center text-light'>You don`t have ingredients, add a new ingredient now!</h3>
                ) : (
                    <Table striped borderless hover responsive>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Article Number</th>
                                <th>Measurement</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredIngredients.map(ingredient_item => (
                                <tr key={ingredient_item.id}>
                                    <td>{ingredient_item.name}</td>
                                    <td className='display-linebreak'>{ingredient_item.description}</td>
                                    <td>{ingredient_item.article_number}</td>
                                    <td>{ingredient_item.measurement}</td>
                                    <td>
                                        <Button onClick={() => {setSelectedIngredient(ingredient_item); setShowAddPriceModal(true)}} className='mx-2' variant='success'>prices</Button>
                                        <Button onClick={() => {setSelectedIngredient(ingredient_item); setShowAddModal(true)}} className='mx-2' variant='warning'>edit</Button>
                                        <Button onClick={() => deleteIngredient(ingredient_item.id)} variant='danger'>delete</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                )}
            </Row>
        </Container>
    );
}

export default IngredientsPage;