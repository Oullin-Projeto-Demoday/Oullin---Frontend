import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import Home from './pages/Home';
import InitScreen from './pages/Init-screen';
import WelcomeScreen from './pages/Welcome-screen';
import SignUp from './pages/Sign_up';

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InitScreen />} />
        <Route path="/home" element={<Home />} />
        <Route path="/welcome" element={<WelcomeScreen />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
