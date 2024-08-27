import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { FaSearch } from 'react-icons/fa';
import { request } from 'graphql-request';

const ANIME_SEARCH_QUERY = `
  query ($search: String) {
    Page(page: 1, perPage: 10) {
      media(search: $search, type: ANIME) {
        id
        title {
          romaji
        }
      }
    }
  }
`;

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [animeList, setAnimeList] = useState([]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const variables = { search: searchTerm };
    const data = await request('https://graphql.anilist.co', ANIME_SEARCH_QUERY, variables);
    setAnimeList(data.Page.media);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="fire-text">AnimeList</Link>
      </div>
      <div className="navbar-right">
{/*         <form onSubmit={handleSubmit}>
          <input 
            type="search" 
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button type="submit">
            <FaSearch />
          </button>
        </form> */}
        {/* <Link to="/login" className="fire-text">Login</Link>
        <Link to="/signup" className="fire-text" >Signup</Link> */}
      </div>
      <div className="search-results">
        {animeList.map(anime => (
          <div key={anime.id}>{anime.title.romaji}</div>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
