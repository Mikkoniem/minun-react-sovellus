import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AjoHallintaPage from './AjoHallintaPage';
import LoginForm from './LoginForm';
import Rekisterointi from './rekisterointi';
import LuoAjoPage from './LuoAjoPage';
import Kartta from './Kartta'; // Tuo Kartta-komponentti

interface User {
  role: string;
}

const App: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

  const handleLogin = (role: string) => {
    console.log('Käyttäjä kirjautui sisään:', role);
    setLoggedIn(true); // Aseta kirjautumistila todeksi
    setLoggedInUser({ role }); // Tallenna käyttäjän rooli
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={<LoginForm onLogin={handleLogin} />}
          />
          <Route
            path="/ajonhallinta"
            element={
              loggedIn && loggedInUser ? (
                <AjoHallintaPage loggedIn={loggedIn} user={loggedInUser} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/ajonhallinta/luouusi" // Itsenäinen reitti LuoAjoPage:lle
            element={
              loggedIn && loggedInUser?.role === 'driver' ? (
                <LuoAjoPage />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/kartta" // Itsenäinen reitti Kartta-komponentille
            element={
              loggedIn && loggedInUser ? (
                <Kartta loggedInUser={loggedInUser} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route path="/rekisterointi" element={<Rekisterointi />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;