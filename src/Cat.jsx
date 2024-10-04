import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // For navigation

const Cat = () => {
  const [breeds, setBreeds] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState("");
  const [breedDetails, setBreedDetails] = useState(null);
  const [catImage, setCatImage] = useState(null);
  const navigate = useNavigate();

  // Fetch the list of cat breeds with API key
  useEffect(() => {
    fetch("https://api.thecatapi.com/v1/breeds", {
      headers: {
        "x-api-key":
          "live_FCuQpzIMhT4UPrEPFN0JLr2kEQBEpZU98u48fEvi8D8cp7PpCw9y9WOHrApB4MFO", // Your actual API key
      },
    })
      .then((response) => response.json())
      .then((data) => setBreeds(data));
  }, []);

  // Fetch cat breed details and image on breed selection
  const handleBreedChange = (e) => {
    const breedId = e.target.value;
    setSelectedBreed(breedId);

    const selectedBreed = breeds.find((breed) => breed.id === breedId);

    if (selectedBreed) {
      setBreedDetails(selectedBreed);

      // If breed has a reference_image_id, fetch the image using it
      if (selectedBreed.reference_image_id) {
        fetch(`https://api.thecatapi.com/v1/images/${selectedBreed.reference_image_id}`, {
          headers: {
            "x-api-key":
              "live_FCuQpzIMhT4UPrEPFN0JLr2kEQBEpZU98u48fEvi8D8cp7PpCw9y9WOHrApB4MFO", // Your actual API key
          },
        })
          .then((response) => response.json())
          .then((imageData) => setCatImage(imageData.url));
      } else {
        setCatImage(null); // Handle cases where no image is available
      }
    }
  };

  // Handle logout functionality
  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("password");
    navigate("/"); // Redirect to login page
  };

  return (
    <div className="cat-container">
      <div className="header">
        <h2>Select a Cat Breed</h2>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
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
          <p>
            <strong>Origin:</strong> {breedDetails.origin || "Unknown"}
          </p>
          <p>
            <strong>Temperament:</strong> {breedDetails.temperament || "Unknown"}
          </p>
          <p>
            <strong>Life Span:</strong> {breedDetails.life_span}
          </p>
        </div>
      )}
    </div>
  );
};

export default Cat;