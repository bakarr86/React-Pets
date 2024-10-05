import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { addDogFavorite } from './features/favorites/favoritesSlice'; // Import the action
import './Pets.css'; // Shared CSS

const Dog = () => {
  const [breeds, setBreeds] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState("");
  const [breedDetails, setBreedDetails] = useState(null);
  const [dogImage, setDogImage] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Hook to dispatch actions

  // Use useSelector to get the favorites list from Redux state
  const dogFavorites = useSelector((state) => state.favorites.dogFavorites); // Ensure the slice is properly structured in your store

  // Fetch the list of dog breeds with API key
  useEffect(() => {
    fetch("https://api.thedogapi.com/v1/breeds", {
      headers: {
        "x-api-key": "live_FCuQpzIMhT4UPrEPFN0JLr2kEQBEpZU98u48fEvi8D8cp7PpCw9y9WOHrApB4MFO",
      },
    })
      .then((response) => response.json())
      .then((data) => setBreeds(data))
      .catch((error) => console.error("Error fetching breeds:", error)); // Add error logging
  }, []);

  const handleBreedChange = (e) => {
    const breedId = e.target.value;
    setSelectedBreed(breedId);

    const selectedBreed = breeds.find((breed) => breed.id === Number(breedId));

    if (selectedBreed) {
      setBreedDetails(selectedBreed);
      console.log("Selected Breed Details:", selectedBreed); // Debugging

      if (selectedBreed.reference_image_id) {
        fetch(`https://api.thedogapi.com/v1/images/${selectedBreed.reference_image_id}`, {
          headers: {
            "x-api-key": "live_FCuQpzIMhT4UPrEPFN0JLr2kEQBEpZU98u48fEvi8D8cp7PpCw9y9WOHrApB4MFO",
          },
        })
          .then((response) => response.json())
          .then((imageData) => setDogImage(imageData.url))
          .catch((error) => console.error("Error fetching dog image:", error)); // Log error
      } else {
        setDogImage(null); // Handle cases where no image is available
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("password");
    navigate("/");
  };

  const addToFavorites = () => {
    if (breedDetails) {
      dispatch(addDogFavorite(breedDetails)); // Dispatch the action to add to favorites
      alert(`${breedDetails.name} added to favorites!`);
    }
  };

  return (
    <div className="dog-container">
      <div className="header">
        <h2>Select a Dog Breed</h2>
        <div className="ad"> 
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
          <button className="logout-btn" >
            <a href="/favorites">Favorites</a>
          </button>
          <button className="logout-btn" >
            <a href="/cat">Cat Search</a> 
          </button>
        </div>
      </div>
      {breeds.length === 0 ? (
        <p>Loading breeds or unable to load breeds...</p>
      ) : (
        <>
          <select onChange={handleBreedChange} value={selectedBreed}>
            <option value="">Select a breed</option>
            {breeds.map((breed) => (
              <option key={breed.id} value={breed.id}>
                {breed.name}
              </option>
            ))}
          </select>

          {breedDetails && (
            <div className="dog-info">
              <h3>{breedDetails.name}</h3>
              {dogImage ? (
                <img src={dogImage} alt={breedDetails.name} className="breed-image" />
              ) : (
                <p>No image available</p>
              )}
              <p><strong>Breed Group:</strong> {breedDetails.breed_group || "Unknown"}</p>
              <p><strong>Life Span:</strong> {breedDetails.life_span}</p>
              <div>
                <button onClick={addToFavorites}>Add to Favorites</button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Display the list of favorite dogs */}
      <div className="favorites-list">
        <h3>Your Favorite Dogs</h3>
        {dogFavorites.length > 0 ? (
          <ul>
            {dogFavorites.map((fav) => (
              <li key={fav.id}>{fav.name}</li>
            ))}
          </ul>
        ) : (
          <p>No favorite dogs added yet.</p>
        )}
      </div>
    </div>
  );
};

export default Dog;