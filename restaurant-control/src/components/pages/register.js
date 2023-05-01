import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'
import { Container, Form, Button } from "react-bootstrap";
import axios from "axios";


const LoginPage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('https://django-recipe-manager.herokuapp.com/token/', {
                username: username,
                password: password
            })
            localStorage.setItem('token', response.data.token)
            navigate(`/`);
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center vh-100">
            <style type="text/css">
                {`
                body {
                    background-image: url("https://cdn.gamma.app/cdn-cgi/image/quality=80,fit=scale-down,onerror=redirect,width=2400/theme_images/blue-steel/bluesteel-3_da8c0b2d.jpg");
                    background-repeat: repeat-x repeat-y;
                }
                `}
            </style>
            <Form onSubmit={handleSubmit} className="p-4 border rounded bg-light mx-auto">
                <h2 className="text-center mb-4 text-primary">My Recipes</h2>
                <h4 className="text-center mb-4 text-primary">Login</h4>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter username"
                        value={username}
                        onChange={handleUsernameChange}
                    />
                    <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                </Form.Group>

                <Button variant="primary" className="w-100 mt-3" type="submit">
                    Login
                </Button>
            </Form>
            {/* TODO : Add a button to register */}
        </Container>
    );
};

export default LoginPage;
