// LocalStorage-based API - No backend required
const DOCTORS_KEY = 'dhanu_doctors';
const APPOINTMENTS_KEY = 'dhanu_appointments';

// Initialize with sample data if not exists
const initializeData = () => {
  if (!localStorage.getItem(DOCTORS_KEY)) {
    const sampleDoctors = [
      { 
        name: "Dr. Priya Kumar", 
        specialty: "Cardiologist",
        timeSlots: [
          { time: "09:00 AM", maxBookings: 20, currentBookings: 5 },
          { time: "10:00 AM", maxBookings: 20, currentBookings: 18 },
          { time: "11:00 AM", maxBookings: 20, currentBookings: 8 },
          { time: "02:00 PM", maxBookings: 20, currentBookings: 15 },
          { time: "03:00 PM", maxBookings: 20, currentBookings: 12 }
        ]
      },
      { 
        name: "Dr. Arjun Rao", 
        specialty: "Neurologist",
        timeSlots: [
          { time: "10:00 AM", maxBookings: 20, currentBookings: 3 },
          { time: "11:30 AM", maxBookings: 20, currentBookings: 7 },
          { time: "01:00 PM", maxBookings: 20, currentBookings: 10 },
          { time: "04:00 PM", maxBookings: 20, currentBookings: 2 }
        ]
      },
      { 
        name: "Dr. Meena Iyer", 
        specialty: "Pediatrician",
        timeSlots: [
          { time: "09:30 AM", maxBookings: 20, currentBookings: 0 },
          { time: "12:00 PM", maxBookings: 20, currentBookings: 14 },
          { time: "03:30 PM", maxBookings: 20, currentBookings: 6 }
        ]
      },
      { 
        name: "Dr. Thara", 
        specialty: "Dermatologist",
        timeSlots: [
          { time: "09:00 AM", maxBookings: 20, currentBookings: 4 },
          { time: "11:00 AM", maxBookings: 20, currentBookings: 9 },
          { time: "02:00 PM", maxBookings: 20, currentBookings: 11 }
        ]
      },
      { 
        name: "Dr. Marin Kitagawa", 
        specialty: "Gynecologist",
        timeSlots: [
          { time: "10:00 AM", maxBookings: 20, currentBookings: 8 },
          { time: "01:00 PM", maxBookings: 20, currentBookings: 13 },
          { time: "03:00 PM", maxBookings: 20, currentBookings: 5 }
        ]
      }
    ];
    localStorage.setItem(DOCTORS_KEY, JSON.stringify(sampleDoctors));
  }
  
  if (!localStorage.getItem(APPOINTMENTS_KEY)) {
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify([]));
  }
};

// Helper to generate patient ID
const generatePatientId = () => {
  return 'P' + Date.now() + Math.floor(Math.random() * 1000);
};

const api = {
  // Get all doctors
  getDoctors: () => {
    initializeData();
    return new Promise((resolve) => {
      const doctors = JSON.parse(localStorage.getItem(DOCTORS_KEY) || '[]');
      resolve({ data: doctors });
    });
  },

  // Get doctor by name
  getDoctorByName: (name) => {
    initializeData();
    return new Promise((resolve, reject) => {
      const doctors = JSON.parse(localStorage.getItem(DOCTORS_KEY) || '[]');
      const doctor = doctors.find(d => d.name === name);
      if (doctor) {
        resolve({ data: doctor });
      } else {
        reject({ response: { data: { message: 'Doctor not found' } } });
      }
    });
  },

  // Create appointment
  createAppointment: (appointmentData) => {
    initializeData();
    return new Promise((resolve, reject) => {
      try {
        // Get doctors and appointments
        const doctors = JSON.parse(localStorage.getItem(DOCTORS_KEY) || '[]');
        const appointments = JSON.parse(localStorage.getItem(APPOINTMENTS_KEY) || '[]');
        
        // Find doctor and time slot
        const doctorIndex = doctors.findIndex(d => d.name === appointmentData.doctor);
        if (doctorIndex === -1) {
          reject({ response: { data: { message: 'Doctor not found' } } });
          return;
        }
        
        const doctor = doctors[doctorIndex];
        const slotIndex = doctor.timeSlots.findIndex(s => s.time === appointmentData.slot);
        
        if (slotIndex === -1) {
          reject({ response: { data: { message: 'Time slot not found' } } });
          return;
        }
        
        const slot = doctor.timeSlots[slotIndex];
        
        // Check if slot is full
        if (slot.currentBookings >= slot.maxBookings) {
          reject({ response: { data: { message: 'This time slot is already full' } } });
          return;
        }
        
        // Increment booking count
        doctors[doctorIndex].timeSlots[slotIndex].currentBookings += 1;
        localStorage.setItem(DOCTORS_KEY, JSON.stringify(doctors));
        
        // Create appointment
        const patientId = generatePatientId();
        const newAppointment = {
          ...appointmentData,
          patientId,
          date: new Date().toLocaleString(),
          id: Date.now()
        };
        
        appointments.push(newAppointment);
        localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
        
        resolve({ data: { patientId, appointment: newAppointment } });
      } catch (error) {
        reject({ response: { data: { message: 'Failed to create appointment' } } });
      }
    });
  },

  // Get all appointments
  getAppointments: () => {
    initializeData();
    return new Promise((resolve) => {
      const appointments = JSON.parse(localStorage.getItem(APPOINTMENTS_KEY) || '[]');
      resolve({ data: appointments });
    });
  },

  // Create doctor
  createDoctor: (doctorData) => {
    initializeData();
    return new Promise((resolve, reject) => {
      try {
        const doctors = JSON.parse(localStorage.getItem(DOCTORS_KEY) || '[]');
        
        // Check if doctor already exists
        if (doctors.some(d => d.name === doctorData.name)) {
          reject({ response: { data: { message: 'Doctor with this name already exists' } } });
          return;
        }
        
        const newDoctor = {
          ...doctorData,
          id: Date.now()
        };
        
        doctors.push(newDoctor);
        localStorage.setItem(DOCTORS_KEY, JSON.stringify(doctors));
        
        resolve({ data: { doctorId: newDoctor.id, doctor: newDoctor } });
      } catch (error) {
        reject({ response: { data: { message: 'Failed to create doctor' } } });
      }
    });
  }
};

export default api;
