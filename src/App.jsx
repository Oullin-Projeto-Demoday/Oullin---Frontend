import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import Home from './pages/Home';
import InitScreen from './pages/Init-screen';
import WelcomeScreen from './pages/Welcome-screen';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/init" element={<InitScreen />} />
        <Route path="/welcome" element={<WelcomeScreen />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;