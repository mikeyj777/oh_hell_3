// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import CardGame from './game_one_shot/CardGame_full';
import CardGame from './game/CardGame';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CardGame />} />
      </Routes>
    </Router>
  );
}

export default App;