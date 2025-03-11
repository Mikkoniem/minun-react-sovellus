import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface SignUpFormState {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

const Rekisterointi: React.FC = () => {
  const [formData, setFormData] = useState<SignUpFormState>({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/rekisterointi/',
        formData, // Axios automaattisesti asettaa tämän JSON-muotoon
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 201) {
        console.log('Käyttäjä luotu.');
        alert("Käyttäjä luotu onnistuneesti!");
        navigate('/kirjautuminen'); // Ohjataan käyttäjä kirjautumissivulle
      }
    } catch (error: any) {
      console.error('Virhe rekisteröinnissä:', error);
      alert(error.response?.data?.error || "Rekisteröinti epäonnistui.");
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <label>
        Etunimi:
        <input
          type="text"
          name="firstname"
          value={formData.firstname}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Sukunimi:
        <input
          type="text"
          name="lastname"
          value={formData.lastname}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Sähköposti:
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Salasana:
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
      </label>
      <br />
      <button type="submit">Rekisteröidy</button>
    </form>
  );
};

export default Rekisterointi;
