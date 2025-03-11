import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import AjoPage from './AjoPage';

interface User {
  role: string;
}

interface AjoHallintaPageProps {
  loggedIn: boolean;
  user: User;
}

const AjoHallintaPage: React.FC<AjoHallintaPageProps> = ({ loggedIn, user }) => {
  return (
    <div>
      <h1>Ajonhallinta</h1>
      <nav>
        <ul>
          <li><Link to="/kartta">Kartta</Link></li> 
          {user.role === 'driver' && <li><Link to="/ajonhallinta/luouusi">Luo uusi ajo</Link></li>}
          <li><Link to="/ajonhallinta/ajopage">Tarkastele keikkojasi</Link></li>
        </ul>
      </nav>

      {/* AjoPage pysyy osana AjoHallintaPage:ä */}
      <Routes>
        <Route path="ajopage" element={<AjoPage />} />
      </Routes>
    </div>
  );
};

export default AjoHallintaPage;