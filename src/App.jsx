
import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import Home from './pages/Home';
import InitScreen from './pages/Init-screen';
import WelcomeScreen from './pages/Welcome-screen';
import ProfileSelection from './pages/ProfileSelection';
import FoodPreferences from './pages/FoodPreferences';
import SignUp from './pages/Sign_up';


function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InitScreen />} />
        <Route path="/home" element={<Home />} />
        <Route path="/welcome" element={<WelcomeScreen />} />

        <Route path="/sign-up" element={<SignUp />} />
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
