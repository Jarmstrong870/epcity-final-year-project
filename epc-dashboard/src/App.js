import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import PropertyPage from './Components/PropertyPage';

function App() {
  return (
    <Router>
      <div className="App">
        <h1>EPC City</h1>
        <nav className="navbar">
          <ul>
            {/* Using Link for navigation to prevent full page reload */}
            <li><Link to="/">Home</Link></li> 
            <li><a href="#about">About</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
        
        <Routes>
          {/* Main page route */}
          <Route
            path="/"
            element={
              <div className="table-container">
                <h2>Property Information</h2>
                <div className="table-border">
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          {/* Pass the address as state to PropertyPage */}
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
            }
          />

          {/* Property page route */}
          <Route path="/property" element={<PropertyPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
