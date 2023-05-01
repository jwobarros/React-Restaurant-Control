import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from './components/utils/protectedRoute';
import Layout from './components/pages/layout';
import Home from './components/pages/home';
import LoginPage from './components/pages/login';
import Recipes from './components/pages/recipes';
import NoPage from './components/pages/404';
import IngredientsPage from './components/pages/ingredients';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<ProtectedRoute />}>
            <Route index path="home" element={<Home />} />
            <Route path="recipes" element={<Recipes />} />
            <Route path="ingredients" element={<IngredientsPage />} />
          </Route>
        </Route>
        <Route path="/">
          <Route path="login" element={<LoginPage />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;