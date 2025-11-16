import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = {
  getDoctors: () => axios.get(`${API_URL}/doctors`),
  getDoctorByName: (name) => axios.get(`${API_URL}/doctors/${name}`),
  createAppointment: (appointmentData) => axios.post(`${API_URL}/appointments`, appointmentData),
  getAppointments: () => axios.get(`${API_URL}/appointments`),
  createDoctor: (doctorData) => axios.post(`${API_URL}/doctors`, doctorData),
};

export default api;
