const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:7000';

export const API = {
  run: `${BASE_URL}/run`
};