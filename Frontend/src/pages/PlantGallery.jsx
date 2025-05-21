import React, { useEffect, useState } from 'react';
import PlantCard from '../components/Plantcard';

const PlantGallery = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const response = await fetch('/api/plants');
        if (!response.ok) {
          throw new Error('Failed to fetch plants');
        }
        const data = await response.json();
        setPlants(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlants();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredPlants = plants.filter(plant => 
    plant.name.toLowerCase().includes(searchTerm) ||
    (plant.category && plant.category.toLowerCase().includes(searchTerm))
  );


  if (error) {
    return (
      <div className="alert alert-danger mt-3">
        Error loading plants: {error}
      </div>
    );
  }

  return (
    <div className='container body-bg-color py-4'>
      <div className="row d-flex justify-content-end p-3">
        <div className="input-group" style={{ width: "18rem" }}>
          <input 
            type="text" 
            value={searchTerm} 
            onChange={handleSearch} 
            className="form-control" 
            placeholder="Search plants..." 
          />
          <div className="input-group-text">
            <i className="bi bi-search"></i>
          </div>
        </div>
      </div>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 p-3">
        {filteredPlants.length > 0 ? (
          filteredPlants.map((plant) => (
            <div className="col" key={plant._id}>
              <PlantCard plant={plant} />
            </div>
          ))
        ) : (
          <div className="col-12 text-center py-5">
            <h5>No plants found matching your search</h5>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlantGallery;
