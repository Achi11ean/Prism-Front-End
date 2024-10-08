import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './homepageNavBar/HomePage';
import NavBar from './homepageNavBar/NavBar';
import './App.css'

function App() {
  return (
    <div className="App"> 
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </div>
  )
}

export default App