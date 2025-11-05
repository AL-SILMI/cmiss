require('dotenv').config();
const axios = require('axios');

const API = 'http://localhost:5000/api';

async function run() {
  try {
    console.log('Logging in as staff...');
    const login = await axios.post(`${API}/auth/staff/login`, {
      email: 'hod.cse@msec.edu.in',
      password: 'Pass@123',
    });
    const token = login.data.token;
    console.log('Staff logged in:', login.data.staff.name);

    console.log('Upserting mark for ST2025001 / CS301 / sem 3');
    const resp = await axios.post(
      `${API}/staff/marks`,
      { studentId: 'ST2025001', courseId: 'CS301', internal: 42, external: 78, semester: '3' },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('Result:', resp.data.message, 'Total:', resp.data.mark.total, 'Grade:', resp.data.mark.grade);
  } catch (err) {
    console.error('Error:', err.response?.data || err.message);
  }
}

run();