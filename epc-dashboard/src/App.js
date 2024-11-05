import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>EPC City</h1>
      <nav className="navbar">
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>
      <div className="table-container">
        <h2>Table Area</h2>
        <div className="table-border">
          <table>
            <thead>
              <tr>
                <th>Header 1</th>
                <th>Header 2</th>
                <th>Header 3</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Row 1 Col 1</td>
                <td>Row 1 Col 2</td>
                <td>Row 1 Col 3</td>
              </tr>
              <tr>
                <td>Row 2 Col 1</td>
                <td>Row 2 Col 2</td>
                <td>Row 2 Col 3</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
