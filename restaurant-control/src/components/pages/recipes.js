import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Form, Button, Table } from 'react-bootstrap';
import { ArrowReturnLeft } from "react-bootstrap-icons";
import NewRecipeModal from "../modals/newRecipeModal";
import AddIngredientModal from "../modals/addRecipeIngredientModal";


function RecipePage() {
    const [expandCard, setExpandCard] = useState(false);
    const [recipes, setRecipes] = useState([]);
    const [filteredRecipes, setFilteredRecipes] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // modal controls
    const [showAddModal, setShowAddModal] = useState(false);
    const [showAddIngredientModal, setShowAddIngredientModal] = useState(false);

    // Get the token from localStorage
    const token = localStorage.getItem('token');

    // Set the headers for the API request
    const config = {
        headers: { Authorization: `token ${token}` },
    };

    const updateRecipes = () => {
        // Make the API request to get the recipes
        axios.get('https://django-recipe-manager.herokuapp.com/recipes/', config)
            .then(response => {
                // Set the recipes in state
                setRecipes(response.data);
                setFilteredRecipes(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }

    useEffect(() => {

        updateRecipes()

    }, []);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        const filtered = recipes.filter((recipe) =>
            recipe.name.toLowerCase().includes(event.target.value.toLowerCase())
        );
        setFilteredRecipes(filtered);
    };

    const getRecipeIngredients = (recipe_id) => {

        // Make the API request to get the recipes
        axios.get(`https://django-recipe-manager.herokuapp.com/recipes/${recipe_id}/ingredients/`, config)
            .then(response => {
                // Set the ingredients in state
                setIngredients(response.data);
            })
            .catch(error => {
                console.log(error);
            });

    };

    const handleShowMore = (recipe_id) => {
        setExpandCard(true)
        const filtered = recipes.filter((recipe) =>
            recipe.id === recipe_id
        );
        getRecipeIngredients(recipe_id);
        setFilteredRecipes(filtered);
    };

    const handleGoBack = (event) => {
        setExpandCard(false);
        setFilteredRecipes(recipes);
        setIngredients([]);
    };

    const renderDescription = (description) => {
        const shortDescription = description.slice(0, 50) + (description.length > 50 ? "..." : "");
        return !expandCard ? (shortDescription) : (description);
    };

    const deleteRecipeIngredient = (id) => {

        axios.delete(`https://django-recipe-manager.herokuapp.com/recipes/${filteredRecipes[0].id}/ingredients/delete/${id}/`, config)
            .then(response => {
                getRecipeIngredients(filteredRecipes[0].id)
            })
            .catch(error => {
                console.log(error);
            });

    }

    return (
        <Container>
            <NewRecipeModal
                    show={showAddModal}
                    setShow={setShowAddModal}
                    updateRecipes={() => updateRecipes()}
                />
            <AddIngredientModal
                    show={showAddIngredientModal}
                    setShow={setShowAddIngredientModal}
                    recipes={filteredRecipes}
                    updateIngredients={getRecipeIngredients}
                />
            <div className="d-flex justify-content-end my-3">
                {!expandCard ? (
                    <Button onClick={() => setShowAddModal(true)}>Add Recipe</Button>
                ) : (
                    <Button onClick={() => setShowAddIngredientModal(true)}>Add Ingredient</Button>
                )
                }
            </div>
            <Row className='mt-5'>
                <Col md={12}>
                    {expandCard ? (
                        <Button variant="primary" onClick={handleGoBack} className="w-100 mt-3">
                            <ArrowReturnLeft /> show all recipes
                        </Button>
                    ) : (
                        <Form>
                            <Form.Group className="mb-3" controlId="formSearch">
                                <Form.Control
                                    type="text"
                                    placeholder="Search by recipe name"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                            </Form.Group>
                        </Form>
                    )}
                </Col>
            </Row>
            <Row className='mt-3'>
                {filteredRecipes.length === 0 ? (
                    <h3 className='text-center text-blue'>You don`t have recipes, add a new recipe now!</h3>
                ) : (filteredRecipes.map(recipe => (
                    <Col md={expandCard ? 12 : 4} key={recipe.id}>
                        <div className='h-100 py-2'>
                            <Card className="h-100 card">
                                <Card.Body>
                                    <Card.Title className="text-center text-blue my-2">{recipe.name}</Card.Title>
                                    {ingredients.length > 0 ? (
                                        <>
                                            <h6 className='text-center text-blue mt-5'>Ingredients:</h6>
                                            <Table striped borderless hover responsive>
                                                <thead>
                                                    <tr>
                                                        <th>Name</th>
                                                        <th>Description</th>
                                                        <th>Article Number</th>
                                                        <th>Measurement</th>
                                                        <th>Cost</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {ingredients.map(ingredient_item => (
                                                        <tr>
                                                            <td>{ingredient_item.ingredient.name}</td>
                                                            <td className='display-linebreak'>{ingredient_item.ingredient.description}</td>
                                                            <td>{ingredient_item.ingredient.article_number}</td>
                                                            <td>{ingredient_item.quantity} {ingredient_item.ingredient.measurement}</td>
                                                            <td>$ {ingredient_item.cost}</td>
                                                            <td>
                                                                <Button onClick={() => deleteRecipeIngredient(ingredient_item.id)} variant='danger'>delete</Button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    <tr>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td>Total:  </td>
                                                        <td>$ {ingredients.reduce((acc, item) => acc + item.cost, 0)}</td>
                                                        <td></td>
                                                    </tr>
                                                </tbody>
                                            </Table>
                                        </>
                                    ) : (
                                        <>
                                            {!expandCard ? (true) : (<h6 className='text-center text-blue mt-5'>You don`t have ingredients to this recipe, add a new ingredient now!</h6>)}
                                        </>
                                    )
                                    }
                                    {recipe.description ? (
                                        <>
                                            <h6 className='text-center text-blue mt-5'>Description:</h6>
                                            <Card.Text className="display-linebreak mt-2">{renderDescription(recipe.description)}</Card.Text>
                                        </>
                                    ) : (false)}
                                </Card.Body>
                                {expandCard ? (true) : (
                                    <Card.Footer>
                                        <Button variant="primary" onClick={() => handleShowMore(recipe.id)} className="w-100 mt-3">
                                            more
                                        </Button>
                                    </Card.Footer>
                                )}
                            </Card>
                        </div>
                    </Col>
                )))}
            </Row>
        </Container>
    );
}

export default RecipePage;