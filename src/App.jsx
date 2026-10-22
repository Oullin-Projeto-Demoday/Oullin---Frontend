import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FoodPreferences from './pages/FoodPreferences';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<FoodPreferences />} />
      </Routes>
    </BrowserRouter>
  );
}