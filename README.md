# Ajonhallintajärjestelmä

Tämä on ajonhallintajärjestelmä, joka auttaa organisaatioita hallinnoimaan ajoneuvojen ja kuljetusten tietoja.


## Toiminnallisuudet

- Kirjautuminen: Käyttäjät voivat kirjautua sisään ja ulos järjestelmään.
- Ajoneuvojen hallinta: Käyttäjät voivat lisätä, muokata ja poistaa ajoja.
- Kuljetusten hallinta: Käyttäjä, joka on dispatcher, voi luoda uusia kuljetuksia.Kaikki käyttäjät voivat tarkastella olemassa olevia kuljetuksia.


## Teknologiat

- Frontend: React.js, TypeScript, CSS
- Backend: Node.js, Express.js, MySQL

------------------------------------------------------------------------------------------------------------------
LoginForm-komponentti
LoginForm-komponentti on vastuussa käyttäjien kirjautumisesta järjestelmään. Se tarjoaa käyttöliittymän, jossa käyttäjä voi syöttää sähköpostiosoitteensa ja salasanansa.
------------------------
Toiminnallisuudet
Mahdollistaa käyttäjän kirjautumisen antamalla sähköpostiosoitteen ja salasanan.
Tarjoaa mahdollisuuden rekisteröityä, jos käyttäjällä ei ole vielä tiliä.
Riippuvuudet
axios: Käytetään HTTP-pyyntöjen tekemiseen backend-palvelimelle.
react-router-dom: Mahdollistaa reitityksen käyttöliittymän eri näkymien välillä.


 Kartta-komponentti
Kartta-komponentti on vastuussa ajotietojen näyttämisestä karttanäkymässä. Se käyttää react-leaflet-kirjastoa kartan luomiseen ja näyttää Marker-komponentteja ajopisteiden sijainneissa.
--------------------------------------------------------------------------------------------------------------------
Toiminnallisuudet
Näyttää ajotiedot kartalla Markerien avulla.
Klikkaamalla yksittäistä ajoa kartalla tai listanäkymässä, keskipiste siirtyy kyseisen ajon sijaintiin kartalla.
Mahdollistaa ajotietojen poistamisen painamalla "Poista" -painiketta.
Riippuvuudet
react-leaflet: Käytetään karttanäkymän luomiseen ja Markerien lisäämiseen kartalle.
axios: HTTP-pyyntöjen tekemiseen backend-palvelimelle.
leaflet: Kustomoidun Marker-ikonin luomiseen ja käyttöön.
leaflet/dist/leaflet.css: Leaflet-kirjaston CSS-tyylit karttanäkymää varten.
LoginForm-komponentti
LoginForm-komponentti on vastuussa käyttäjien kirjautumisesta järjestelmään. Se tarjoaa käyttöliittymän, jossa käyttäjä voi syöttää sähköpostiosoitteensa ja salasanansa.

Toiminnallisuudet
Mahdollistaa käyttäjän kirjautumisen antamalla sähköpostiosoitteen ja salasanan.
Tarjoaa mahdollisuuden rekisteröityä, jos käyttäjällä ei ole vielä tiliä.
Riippuvuudet
axios: Käytetään HTTP-pyyntöjen tekemiseen backend-palvelimelle.
react-router-dom: Mahdollistaa reitityksen käyttöliittymän eri näkymien välillä.


Ajojärjestelmä Backend
Tämä on Express.js-pohjainen RESTful API, joka tarjoaa toiminnallisuuden ajojen hallintaan ja käyttäjien kirjautumiseen.
-----------------------------------------------------------------------
Käyttöönotto
Asenna tarvittavat riippuvuudet ajamalla seuraava komento projektin juurikansiossa:


yarn

Käynnistä palvelin ajamalla seuraava komento:
yarn start 


--------------------------
Huomioita
Tämä API on tarkoitettu toimimaan paikallisesti (localhost), eikä sitä ole suunniteltu tuotantokäyttöön sellaisenaan.
API olettaa, että käytettävissä on MySQL-tietokanta, ja se käyttää oletuksena localhost-yhteyttä osoitteeseen localhost:3306.
Ennen kuin käytät tätä API:a, varmista, että sinulla on MySQL-tietokanta, ja muokkaa tarvittaessa yhteysasetukset vastaamaan omia ympäristösi asetuksia.
Tämä API tarjoaa end pointit ajojen hallintaan (/api/luoajo, /api/ajot, /api/ajajat, /api/ajot/:id) ja käyttäjien kirjautumiseen (/login).

Jotta saat pääset kirjautumaan, toimi näin:
---
1. luo mysql tietokanta: (katso server.js tiedot ja luo näillä mysql tietokanta)
2. tarvitset 2 taulukkoa. ensimmäisen taulukon luot komennolla:

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstname VARCHAR(50),
    lastname VARCHAR(50),
    email VARCHAR(100),
    password VARCHAR(255),
    rooli VARCHAR(20)
);

toisen taulukon luot komennolla:

CREATE TABLE ajo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    asiakas VARCHAR(100),
    ajankohta DATETIME,
    osoite VARCHAR(255),
    paikkakunta VARCHAR(100),
    yhteystiedot VARCHAR(255),
    lisatietoja TEXT,
    lat DECIMAL(10, 8),
    lng DECIMAL(11, 8),
    ajaja VARCHAR(100)
);

3. kun taulukko on luotu, voit luoda kuljettajan rekisteröitymällä. jos haluat dispatcher roolin, joudut luomaan käyttäjän mysql:lään käsin. tässä esimerkki käyttäjästä:

INSERT INTO users (firstname, lastname, email, password, rooli)
VALUES ('John', 'Doe', 'john.doe@example.com', 'salasana', 'dispatcher');

4. kun olet luonut nämä, avaa sivu, käynnistä server.js nodella ja kirjaudu tai rekisteröi uusi käyttäjä.


