// const API_BASE_URL = 'http://localhost:5000/api/plants';
const API_BASE_URL = '/api/plants';

export const getPlants = async () => {
  const response = await fetch(API_BASE_URL);
  return await response.json();
};

export const getPlant = async (id) => {
  const response = await fetch(`${API_BASE_URL}/${id}`);
  return await response.json();
};

export const createPlant = async (plantData) => {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(plantData),
  });
  return await response.json();
};

export const updatePlant = async (id, plantData) => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(plantData),
  });
  return await response.json();
};

export const deletePlant = async (id) => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  return await response.json();
};

export const getEcomStats = async () => {
  const response = await fetch(`${API_BASE_URL}/stats/ecom`);
  return await response.json();
};

export const getOrderStats = async () => {
  const response = await fetch(`${API_BASE_URL}/stats/orders`);
  return await response.json();
};

