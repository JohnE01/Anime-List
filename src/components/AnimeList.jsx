import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';
import './AnimeList.css'; 

const AnimeList = () => {
  const [animeList, setAnimeList] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortOption, setSortOption] = useState('POPULARITY_DESC');
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const [searchResults, setSearchResults] = useState([]); // State for search results
  const [isSearching, setIsSearching] = useState(false); // State to track if a search is in progress
  const itemsPerPage = 10; 

  const fetchAnime = async (page) => {
    try {
      const genreFilter = selectedGenre ? `genre_in: ["${selectedGenre}"]` : '';
      const response = await axios.post('https://graphql.anilist.co', {
        query: `
          query {
            Page(page: ${page}, perPage: ${itemsPerPage}) {
              media(type: ANIME, sort: ${sortOption}, ${genreFilter}) {
                id
                title {
                  romaji
                  english
                }
                coverImage {
                  large
                }
                description
                episodes
                genres
                averageScore
                popularity
              }
              pageInfo {
                lastPage
              }
            }
          }
        `
      });

      const { media, pageInfo } = response.data.data.Page;
      setAnimeList(media);
      setTotalPages(pageInfo.lastPage);
    } catch (error) {
      console.error('Error fetching the anime data', error);
    }
  };

  useEffect(() => {
    fetchAnime(currentPage);
  }, [currentPage, selectedGenre, sortOption]);

  const cleanDescription = (description) => {
    return description.replace(/<br\s*\/?>/gi, '\n');
  };

  const handleFavorite = (id) => {
    setFavorites(prevFavorites => {
      const updatedFavorites = new Set(prevFavorites);
      if (updatedFavorites.has(id)) {
        updatedFavorites.delete(id); // Remove from favorites
      } else {
        updatedFavorites.add(id); // Add to favorites
      }
      return updatedFavorites;
    });
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  const handleGenreChange = (event) => {
    setSelectedGenre(event.target.value);
    setCurrentPage(1); // Reset to the first page
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
    setCurrentPage(1); // Reset to the first page
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSearching(true); // Set searching state to true
    try {
      const response = await axios.post('https://graphql.anilist.co', {
        query: `
          query ($search: String) {
            Page(page: 1, perPage: 10) {
              media(search: $search, type: ANIME) {
                id
                title {
                  romaji
                  english
                }
                coverImage {
                  large
                }
                description
                episodes
                genres
                averageScore
                popularity
              }
            }
          }
        `,
        variables: { search: searchTerm }
      });
      setSearchResults(response.data.data.Page.media); // Update search results state with full anime details
    } catch (error) {
      console.error('Error fetching anime search data', error);
      setSearchResults([]); // Clear search results in case of error
    } finally {
      setIsSearching(false); // Set searching state back to false
    }
  };

  return (
    <div className="anime-container">
      <div className="filter-options">
        <select value={selectedGenre} onChange={handleGenreChange}>
          <option value="">All Genres</option>
          <option value="Action">Action</option>
          <option value="Adventure">Adventure</option>
          <option value="Comedy">Comedy</option>
          <option value="Drama">Drama</option>
          <option value="Fantasy">Fantasy</option>
          <option value="Slice of Life">Slice of Life</option>
          {/* Add more genres as needed */}
        </select>

        <select value={sortOption} onChange={handleSortChange}>
          <option value="POPULARITY_DESC">Most Popular</option>
          <option value="TRENDING_DESC">Trending</option>
          <option value="SCORE_DESC">Highest Rated</option>
          {/* Add more sorting options as needed */}
        </select>
      </div>

      <form onSubmit={handleSubmit}>
        <input 
          type="search" 
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button type="submit">
          <FaSearch />
        </button>
      </form>

      {/* Render search results if there are any */}
      {isSearching ? (
        <p>Loading...</p>
      ) : searchResults.length > 0 ? (
        <div className="anime-list">
          {searchResults.map(anime => (
            <div key={anime.id} className="anime-card">
              <img src={anime.coverImage.large} alt={anime.title.romaji} />
              <div className="anime-info">
                <div className="anime-titles">
                  <h2>{anime.title.romaji}</h2>
                  <h3>{anime.title.english}</h3>
                </div>
                <p><strong>Episodes:</strong> {anime.episodes || 'N/A'}</p>
                <p><strong>Genres:</strong> {anime.genres.join(', ')}</p>
                <p><strong>Score:</strong> {anime.averageScore || 'N/A'}</p>
                <p><strong>Popularity:</strong> {anime.popularity || 'N/A'}</p>
                <div className="description-overlay">
                  <p>{cleanDescription(anime.description)}</p>
                </div>
                <button
                  className={`favorite-btn ${favorites.has(anime.id) ? 'favorited' : ''}`}
                  onClick={() => handleFavorite(anime.id)}
                >
                  {favorites.has(anime.id) ? 'Unfavorite' : 'Favorite'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : searchTerm && searchResults.length === 0 ? (
        <p>No anime found</p>
      ) : null}

      {/* Render main anime list if no search results */}
      {searchResults.length === 0 && !searchTerm && (
        <div className="anime-list">
          {animeList.length > 0 ? (
            animeList.map(anime => (
              <div key={anime.id} className="anime-card">
                <img src={anime.coverImage.large} alt={anime.title.romaji} />
                <div className="anime-info">
                  <div className="anime-titles">
                    <h2>{anime.title.romaji}</h2>
                    <h3>{anime.title.english}</h3>
                  </div>
                  <p><strong>Episodes:</strong> {anime.episodes || 'N/A'}</p>
                  <p><strong>Genres:</strong> {anime.genres.join(', ')}</p>
                  <p><strong>Score:</strong> {anime.averageScore || 'N/A'}</p>
                  <p><strong>Popularity:</strong> {anime.popularity || 'N/A'}</p>
                  <div className="description-overlay">
                    <p>{cleanDescription(anime.description)}</p>
                  </div>
                  <button
                    className={`favorite-btn ${favorites.has(anime.id) ? 'favorited' : ''}`}
                    onClick={() => handleFavorite(anime.id)}
                  >
                    {favorites.has(anime.id) ? 'Unfavorite' : 'Favorite'}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No anime found</p>
          )}
        </div>
      )}

      <div className="pagination">
        <button 
          className="page-btn" 
          onClick={handlePreviousPage} 
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="page-number">Page {currentPage} of {totalPages}</span>
        <button 
          className="page-btn" 
          onClick={handleNextPage} 
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AnimeList;
