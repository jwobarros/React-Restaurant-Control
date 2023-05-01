import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({token}) => {
    const auth = localStorage.getItem('token') !== null; // determine if authorized

    // If authorized, return an outlet that will render child elements
    // If not, return element that will navigate to login page
    return auth ? <Outlet /> : <Navigate to="/login" />;
}
export default ProtectedRoute;