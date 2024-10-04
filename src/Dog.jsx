import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Pets.css'; // Shared CSS

const Dog = () => {
  const [breeds, setBreeds] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState("");
  const [breedDetails, setBreedDetails] = useState(null);
  const [dogImage, setDogImage] = useState(null);
  const navigate = useNavigate();

  // Fetch the list of dog breeds with API key
  useEffect(() => {
    fetch("https://api.thedogapi.com/v1/breeds", {
      headers: {
        "x-api-key": "live_FCuQpzIMhT4UPrEPFN0JLr2kEQBEpZU98u48fEvi8D8cp7PpCw9y9WOHrApB4MFO",
      },
    })
      .then((response) => response.json())
      .then((data) => setBreeds(data));
  }, []);

  const handleBreedChange = (e) => {
    const breedId = e.target.value;
    setSelectedBreed(breedId);

    const selectedBreed = breeds.find((breed) => breed.id === parseInt(breedId));

    if (selectedBreed) {
      setBreedDetails(selectedBreed);

      if (selectedBreed.reference_image_id) {
        fetch(`https://api.thedogapi.com/v1/images/${selectedBreed.reference_image_id}`, {
          headers: {
            "x-api-key": "live_FCuQpzIMhT4UPrEPFN0JLr2kEQBEpZU98u48fEvi8D8cp7PpCw9y9WOHrApB4MFO",
          },
        })
          .then((response) => response.json())
          .then((imageData) => setDogImage(imageData.url));
      } else {
        setDogImage(null); // Handle cases where no image is available
      }
    }
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("password");
    navigate("/");
  };

  return (
    <div className="dog-container">
      <div className="header">
        <h2>Select a Dog Breed</h2>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
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
        <div className="dog-info">
          <h3>{breedDetails.name}</h3>
          {dogImage ? (
            <img src={dogImage} alt={breedDetails.name} className="breed-image" />
          ) : (
            <p>No image available</p>
          )}
          <p><strong>Breed Group:</strong> {breedDetails.breed_group || "Unknown"}</p>
          <p><strong>Life Span:</strong> {breedDetails.life_span}</p>
        </div>
      )}
    </div>
  );
};

export default Dog;