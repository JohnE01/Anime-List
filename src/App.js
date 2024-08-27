import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BlogProvider } from './context/BlogContext';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Home from './components/Home';
import Navbar from './components/Navbar';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AnimeList from './components/AnimeList';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <BlogProvider>
          <Navbar />
          <div className="app-container">
            <div className="content">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/" element={<Home />} />
              </Routes>
            </div>
          </div>
          <div className="App">
            <header className="App-header">
              <h1 className='fier'>Welcome to Anime List</h1>
            </header>
            <AnimeList />
          </div>
        </BlogProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
