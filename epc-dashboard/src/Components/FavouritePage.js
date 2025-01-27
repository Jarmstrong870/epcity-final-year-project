import React, { useEffect, useState } from 'react';
import TopRatedPropertyCard from './TopRatedPropertyCard';

const FavouritesPage = ({ userEmail, language }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      const response = await fetch(`/favourites/getFavourites?email=${userEmail}`);
      if (response.ok) {
        const data = await response.json();
        setFavorites(data);
      } else {
        console.error('Failed to fetch favorite properties');
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [userEmail]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>My Favourites</h2>
      {loading ? (
        <p>Loading favorites...</p>
      ) : favorites.length > 0 ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {favorites.map((property) => (
            <TopRatedPropertyCard
              key={property.uprn}
              property={property}
              language={language}
            />
          ))}
        </div>
      ) : (
        <p>No favorite properties yet.</p>
      )}
    </div>
  );
};

export default FavouritesPage;