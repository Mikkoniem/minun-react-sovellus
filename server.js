const express = require('express');
const mysql2 = require('mysql2');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');


dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());


const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;
const DB_SSL_CA_PATH = process.env.DB_SSL_CA_PATH;

if (!DB_SSL_CA_PATH) {
  throw new Error('DB_SSL_CA_PATH is not defined. Please check your .env file.');
}

const connection = mysql2.createConnection({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  ssl: {
    ca: fs.readFileSync(DB_SSL_CA_PATH),
    rejectUnauthorized: true
  }
});

connection.connect((err) => {
  if (err) {
    console.error('Virhe tietokantayhteyden muodostamisessa:', err);
    return;
  }
  console.log('Yhdistetty MySQL-tietokantaan.');
});

app.get('/test-connection', (req, res) => {
  const query = 'SELECT 1 + 1 AS result';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Virhe tietokantayhteyden testauksessa:', err);
      res.status(500).send('Virhe tietokantayhteyden testauksessa');
    } else {
      res.json({ message: 'Tietokantayhteys toimii!', result: results[0].result });
    }
  });
});

app.listen(3000, () => {
  console.log('Serveri käynnissä portissa 3000');
});

app.post('/api/luoajo', (req, res) => {
  const { asiakas, ajankohta, osoite, paikkakunta, yhteystiedot, lisatietoja, lat, lng, ajaja } = req.body;

  const sql = `INSERT INTO ajo (asiakas, ajankohta, osoite, paikkakunta, yhteystiedot, lisatietoja, lat, lng, ajaja) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  connection.query(sql, [asiakas, ajankohta, osoite, paikkakunta, yhteystiedot, lisatietoja, lat, lng, ajaja], (err, results) => {
    if (err) {
      console.error('Virhe tallennettaessa tietoja:', err);
      res.status(500).json({ error: 'Virhe tallennettaessa tietoja' });
      return;
    }
    console.log('Tiedot tallennettu onnistuneesti.');
    res.json({ success: true });
  });
});


app.get('/api/ajajat', (req, res) => {
  connection.query('SELECT id, firstname, lastname FROM ajojarjestelma.users WHERE rooli = ?', ['driver'], (err, results) => {
    if (err) {
      console.error('Virhe haettaessa ajajia:', err);
      res.status(500).json({ error: 'virhe haettaessa ajajia' });
      return;
    }
    console.log('Ajotiedot haettu onnistuneesti.');
    res.json(results);
  });
});


app.get('/api/ajot', (req, res) => {
  let query = `
    SELECT ajo.*, users.firstname, users.lastname 
    FROM ajojarjestelma.ajo AS ajo
    JOIN users ON ajo.ajaja = users.id
  `;
  if (req.query.ajaja) {
    // Jos pyyntössä on määritelty ajaja, haetaan vain kyseisen ajajan ajot
    query += `WHERE ajo.ajaja = ?`;
  }
  connection.query(query, [req.query.ajaja], (error, results, fields) => {
    if (error) {
      console.error('Virhe haettaessa ajotietoja:', error);
      res.status(500).json({ error: 'Virhe haettaessa ajotietoja' });
      return;
    }
    console.log('Ajotiedot haettu onnistuneesti.');
    res.json(results);
  });
});


app.delete('/api/ajot/:id', (req, res) => {
  const id = req.params.id;

  const sql = 'DELETE FROM ajojarjestelma.ajo WHERE id = ?';
  connection.query(sql, [id], (error, results) => {
    if (error) {
      console.error('Virhe poistettaessa tietoja:', error);
      res.status(500).json({ error: 'Virhe poistettaessa tietoja' });
      return;
    }
    console.log('Tiedot poistettu onnistuneesti.');
    res.json({ success: true });
  });
});

app.put('/api/ajot/:id', (req, res) => {
  const id = req.params.id;
  const { asiakas, ajankohta, osoite, paikkakunta, yhteystiedot, lisatietoja, lat, lng } = req.body;

  const sql = 'UPDATE ajojarjestelma.ajo SET asiakas = ?, ajankohta = ?, osoite = ?, paikkakunta = ?, yhteystiedot = ?, lisatietoja = ?, lat = ?, lng = ? WHERE id = ?';
  connection.query(sql, [asiakas, ajankohta, osoite, paikkakunta, yhteystiedot, lisatietoja, lat, lng, id], (err, result) => {
    if (err) {
      console.error('Virhe tietokannassa:', err);
      res.status(500).json({ success: false, message: 'Tietojen päivitys epäonnistui' });
      return;
    }
    res.status(200).json({ success: true, message: 'Tietojen päivitys onnistui' });
  });
});




app.post('/rekisterointi', (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  
  // Tarkistus
  if (!firstname || !lastname || !email || !password) {
    return res.status(400).json({ error: 'Kaikki kentät ovat pakollisia.' });
  }

  
  const sql = 'INSERT INTO users (firstname, lastname, email, password, rooli) VALUES (?, ?, ?, ?, ?)';
  const rooli = 'driver'; //rooli oletusarvoisesti 'ajaja'
  
  connection.query(sql, [firstname, lastname, email, password, rooli], (error, results) => {
    if (error) {
      console.error('Virhe tallennettaessa tietoja:', error);
      return res.status(500).json({ error: 'Virhe tallennettaessa tietoja' });
    }
    console.log('Käyttäjä rekisteröity onnistuneesti.');
    res.status(200).json({ success: true, message: 'Käyttäjä rekisteröity onnistuneesti' });
  });
});

app.post('/login', (req, res) => {
  const { firstname, lastname, password, } = req.body;

  const sql = 'SELECT * FROM users WHERE firstname = ? AND lastname = ? AND BINARY password = ?';
  connection.query(sql, [firstname, lastname, password], (err, result) => {
    if (err) {
      console.error('Virhe tietokannasta:', err);
      res.status(500).json({ success: false, message: 'Virhe tietokannasta' });
      return;
    }
    if (result.length > 0) {
      console.log('tulos',result);
      if (result[0].password === password) {
        // Hae käyttäjän rooli
        const user = result[0];
        console.log("Käyttäjä",user);
        const role = user.rooli;
        const userId = user.id;

        // Lisää rooli vastaukseen
        const response = {
          success: true,
          message: 'Tervetuloa!',
          user: {
            id: userId, 
            firstname: user.firstname,
            lastname: user.lastname,
            role: role
          }
        };
        res.status(200).json(response);
      } else {
        res.status(401).json({ success: false, message: 'Väärä salasana' });
      }
    } else {
      // Käyttäjää ei löytynyt
      res.status(401).json({ success: false, message: 'Väärä etunimi, sukunimi tai salasana' });
    }
  });
});




const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Palvelin käynnissä portissa ${PORT}`);
});
