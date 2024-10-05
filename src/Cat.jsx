import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addCatFavorite } from './features/favorites/favoritesSlice'; // Redux action for adding to favorites

const Cat = () => {
  const [breeds, setBreeds] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState("");
  const [breedDetails, setBreedDetails] = useState(null);
  const [catImage, setCatImage] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const catFavorites = useSelector((state) => state.favorites.catFavorites); // Access cat favorites from Redux

  // Fetch the list of cat breeds
  useEffect(() => {
    fetch("https://api.thecatapi.com/v1/breeds", {
      headers: {
        "x-api-key":
          "live_FCuQpzIMhT4UPrEPFN0JLr2kEQBEpZU98u48fEvi8D8cp7PpCw9y9WOHrApB4MFO", // API key
      },
    })
      .then((response) => response.json())
      .then((data) => setBreeds(data));
  }, []);

  // Fetch breed details and image on breed selection
  const handleBreedChange = (e) => {
    const breedId = e.target.value;
    setSelectedBreed(breedId);

    const selectedBreed = breeds.find((breed) => breed.id === breedId);

    if (selectedBreed) {
      setBreedDetails(selectedBreed);

      // Fetch the breed image if available
      if (selectedBreed.reference_image_id) {
        fetch(`https://api.thecatapi.com/v1/images/${selectedBreed.reference_image_id}`, {
          headers: {
            "x-api-key": "live_FCuQpzIMhT4UPrEPFN0JLr2kEQBEpZU98u48fEvi8D8cp7PpCw9y9WOHrApB4MFO", // API key
          },
        })
          .then((response) => response.json())
          .then((imageData) => setCatImage(imageData.url));
      } else {
        setCatImage(null); // No image available
      }
    }
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("password");
    navigate("/"); // Redirect to login page
  };

  // Add the selected cat breed to favorites
  const handleAddToFavorites = () => {
    if (breedDetails) {
      const alreadyFavorited = catFavorites.some(breed => breed.id === breedDetails.id);

      if (!alreadyFavorited) {
        dispatch(addCatFavorite({ breed: breedDetails, type: 'cat' }));
        alert(`${breedDetails.name} added to favorites!`);
      } else {
        alert(`${breedDetails.name} is already in your favorites!`);
      }
    }
  };

  return (
    <div className="cat-container">
      <div className="header">
        <h2>Select a Cat Breed</h2>
        <div className="ad">
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
          <button className="logout-btn">
            <a href="/favorites">Favorites</a>
          </button>
          <button className="logout-btn">
            <a href="/dog">Dog Search</a>
          </button>
        </div>
      </div>
      <select onChange={handleBreedChange} value={selectedBreed}>
        <option value="">Select a breed</option>
        {breeds.map((breed) => (
          <option key={breed.id} value={breed.id}>
            {breed.name}
          </option>
        ))}
      </select>

      {breedDetails && (
        <div className="cat-info">
          <h3>{breedDetails.name}</h3>
          {catImage ? (
            <img src={catImage} alt={breedDetails.name} className="breed-image" />
          ) : (
            <p>No image available</p>
          )}
          <p><strong>Origin:</strong> {breedDetails.origin || "Unknown"}</p>
          <p><strong>Temperament:</strong> {breedDetails.temperament || "Unknown"}</p>
          <p><strong>Life Span:</strong> {breedDetails.life_span}</p>
          <div>
            <button onClick={handleAddToFavorites}>Add to Favorites</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cat;