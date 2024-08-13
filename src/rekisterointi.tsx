// Rekisterointi.tsx
import React, { useState } from 'react';
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(`Field name: ${name}, Field value: ${value}`);
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('https://minun-react-sovellus-1.onrender.com/rekisterointi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstname: formData.firstname,
          lastname: formData.lastname,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        throw new Error('Virhe lisätessä ajoa.');
      }

      console.log('Käyttäjä luotu.');
      alert("Käyttäjä luotu onnistuneesti!.");
    } catch (error) {
      console.error('Virhe rekisteröinnissä:', error);

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
