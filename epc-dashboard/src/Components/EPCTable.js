// Home.js
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => (
  <div className="table-container">
    <h2>Property Information</h2>
    <div className="table-border">
      <table>
        <tbody>
          <tr>
            <td>
              <Link to="/property" state={{ address: "44 Gladstone Court, Spring Drive SG2 8AY" }}>
                30 Sep 2024
              </Link>
            </td>
            <td>
              <Link to="/property" state={{ address: "44 Gladstone Court, Spring Drive SG2 8AY" }}>
                44 Gladstone Court, Spring Drive SG2 8AY
              </Link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

export default Home;
