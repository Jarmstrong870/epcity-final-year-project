import React from 'react';
import MapComponent from './MapComponent'; // Import the MapComponent
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>Google Maps Location Search</h1>
      <MapComponent /> {/* Use the MapComponent */}
    </div>
  );
}

export default App;