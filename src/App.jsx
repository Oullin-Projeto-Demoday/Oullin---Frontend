import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import InitScreen from './pages/Init-screen';
import WelcomeScreen from './pages/Welcome-screen';
import ProfileSelection from './pages/ProfileSelection';
import FoodPreferences from './pages/FoodPreferences';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/init" element={<InitScreen />} />
        <Route path="/welcome" element={<WelcomeScreen />} />
        <Route path="/profile-selection" element={<ProfileSelection />} />
        
        {/* Rota adicionada na branch 10-favoritos */}
        <Route path="/food-preferences" element={<FoodPreferences />} />

        {/* Redirecionamento padrão para rotas não encontradas */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;