import React from 'react';
import { HashRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from './components/utils/protectedRoute';
import Layout from './components/pages/layout';
import LoginPage from './components/pages/login';
import Recipes from './components/pages/recipes';
import NoPage from './components/pages/404';
import IngredientsPage from './components/pages/ingredients';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<ProtectedRoute />}>
            <Route index element={<Recipes />} />
            <Route path="recipes" element={<Recipes />} />
            <Route path="ingredients" element={<IngredientsPage />} />
          </Route>
        </Route>
        <Route path="/">
          <Route path="login" element={<LoginPage />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;