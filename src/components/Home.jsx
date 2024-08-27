// src/components/Home.jsx
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import PostList from './Blog/PostList';
import CreatePost from './Blog/CreatePost';
import AnimeList from './AnimeList'; // Import AnimeList
import './Home.css';

const Home = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="home-container">
      <div className="home-content">
        <h2 className='fire'>Welcome Weebs!</h2>
        {user ? (
          <>
            <p>Hello, {user.email}!</p>
            <button onClick={logout}>Logout</button>
            <CreatePost />
            <PostList />
            <AnimeList /> {/* Add AnimeList component */}
          </>
        ) : (
          <p> Look at all those Masterpiece!</p>
        )}
      </div>
    </div>
  );
};

export default Home;
