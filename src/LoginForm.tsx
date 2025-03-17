import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css';

interface SignUpFormState {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

interface LoginFormProps {
  onLogin: (role: string, firstname: string, lastname: string ) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState<SignUpFormState>({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!formData.firstname || !formData.lastname || !formData.password) {
      alert("Täytä kaikki pakolliset kentät");
      return;
    }
  
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login/', {
        firstname: formData.firstname,
        lastname: formData.lastname,
        password: formData.password,
      });
  
      console.log("response:", response.data);
  
      if (response.data.success) {
        const { role, firstname, lastname, token } = response.data; 
        localStorage.setItem('token', token); //token localStorageen
        onLogin(role, firstname, lastname); 
        navigate('/ajonhallinta'); 
        alert(`Olet kirjautunut ${role === 'driver' ? 'Ajajana' : 'Ajojärjestelijänä'}.`);
      } else {
        alert("Väärin meni. Yritä uudestaan.");
      }
    } catch (error) {
      console.error("Virhe kirjautumisessa:", error);
      alert("Epäonnistui. Yritä uudestaan.");
    }
  };
  const handleRegister = () => {
    navigate("/rekisterointi");
  };

  return (
    <form onSubmit={handleLogin}>
      <label>
        Etunimi:
        <input
          type="text"
          name="firstname"
          value={formData.firstname}
          onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
        />
      </label>
      <br />
      <label>
        Sukunimi:
        <input
          type="text"
          name="lastname"
          value={formData.lastname}
          onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
        />
      </label>
      <br />
      <label>
        Salasana:
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
      </label>
      <br />
      <button type="submit">Kirjaudu</button>
      <p>
        Eikö sinulla ole käyttäjää?{" "}
        <span style={{ color: "blue", cursor: "pointer" }} onClick={handleRegister}>
          Rekisteröidy tästä
        </span>
      </p>
    </form>
  );
};

export default LoginForm;