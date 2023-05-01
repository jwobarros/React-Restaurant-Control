import { Outlet, useNavigate } from "react-router-dom";
import { Container, Nav, Button, Row, Col } from 'react-bootstrap';


const Layout = () => {

    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <Container fluid className="" style={{ minHeight: "100vh" }}>
            <Row className="h-100">
                <Col md={2} className="bg-light navigation-body">
                    <Nav className="flex-column nav-pills" style={{ minHeight: "100vh" }}>
                        <h4 className="text-center mt-5 text-blue">My Recipes</h4>
                        <hr className="mt-5" />
                        <Nav.Item>
                            <Nav.Link className="navigation-link mt-3" href="#/recipes">Recipes</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link className="navigation-link mt-3" href="#/ingredients">Ingredients</Nav.Link>
                        </Nav.Item>
                        <Nav.Item className="mt-auto mb-2 mx-auto">
                            <Button variant="light" style={{ opacity: 0.75 }} onClick={handleLogout}>Logout</Button>
                        </Nav.Item>
                    </Nav>
                </Col>
                <Col md={10} className="">
                    <Container fluid>
                        <Outlet />
                    </Container>
                </Col>
            </Row>
        </Container>
    )
};

export default Layout;