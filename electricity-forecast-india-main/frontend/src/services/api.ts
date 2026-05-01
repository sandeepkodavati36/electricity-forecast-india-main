import axios from 'axios';
import { buildForecast, STATES, YEARS } from './mockData';

const API = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getForecast = async (state: string, year: number) => {
  try {
    const response = await API.get('/predict', {
      params: {
        state,
        year,
      },
    });
    return response.data;
  } catch (error) {
    return buildForecast(state, year);
  }
};

export const getStates = async () => STATES;
export const getYears = async () => YEARS;

export default API;
