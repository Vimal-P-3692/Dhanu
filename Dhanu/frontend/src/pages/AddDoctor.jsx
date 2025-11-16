import React, { useState } from 'react';
import { FaUserMd, FaPlus, FaClock, FaTrash } from 'react-icons/fa';
import api from '../services/api';
import AdminAuth from '../components/AdminAuth';

const AddDoctor = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [doctorData, setDoctorData] = useState({
    name: '',
    specialty: '',
    timeSlots: []
  });
  const [newSlot, setNewSlot] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAddSlot = () => {
    if (!newSlot) return;
    if (doctorData.timeSlots.some(slot => slot.time === newSlot)) {
      setError('This time slot already exists');
      return;
    }
    setDoctorData({
      ...doctorData,
      timeSlots: [...doctorData.timeSlots, { time: newSlot, maxBookings: 20, currentBookings: 0 }]
    });
    setNewSlot('');
    setError('');
  };

  const handleRemoveSlot = (slotToRemove) => {
    setDoctorData({
      ...doctorData,
      timeSlots: doctorData.timeSlots.filter(slot => slot.time !== slotToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (doctorData.timeSlots.length === 0) {
      setError('Please add at least one time slot');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.createDoctor(doctorData);
      setSuccess(`Doctor added successfully with ID: ${response.data.doctorId}`);
      setDoctorData({ name: '', specialty: '', timeSlots: [] });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add doctor');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <AdminAuth onAuth={setIsAuthenticated} />;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)',
      padding: '2rem 0',
    }}>
      <div className="container">
        <h2 className="mb-4" style={{ color: '#43c6ac' }}>
          <FaUserMd className="me-2" /> Add New Doctor
        </h2>

        <div className="card shadow-sm" style={{ maxWidth: 600, margin: '0 auto' }}>
          <div className="card-body p-4">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Doctor Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={doctorData.name}
                  onChange={(e) => setDoctorData({ ...doctorData, name: e.target.value })}
                  required
                />
              </div>
              
              <div className="mb-3">
                <label className="form-label">Specialty</label>
                <input
                  type="text"
                  className="form-control"
                  value={doctorData.specialty}
                  onChange={(e) => setDoctorData({ ...doctorData, specialty: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Time Slots</label>
                <div className="input-group mb-2">
                  <input
                    type="time"
                    className="form-control"
                    value={newSlot}
                    onChange={(e) => setNewSlot(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={handleAddSlot}
                  >
                    <FaPlus /> Add Slot
                  </button>
                </div>
                
                <div className="mt-2">
                  {doctorData.timeSlots.map((slot, index) => (
                    <div 
                      key={index}
                      className="d-flex align-items-center mb-2 p-2 bg-light rounded"
                    >
                      <FaClock className="text-primary me-2" />
                      <span>{slot.time}</span>
                      <button
                        type="button"
                        className="btn btn-link text-danger ms-auto p-0"
                        onClick={() => handleRemoveSlot(slot.time)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
                style={{
                  background: '#43c6ac',
                  border: 'none',
                  borderRadius: '2rem',
                }}
              >
                {loading ? 'Adding...' : <><FaPlus className="me-2" /> Add Doctor</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDoctor;
