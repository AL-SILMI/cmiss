require('dotenv').config();
const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
let authToken = '';

const testUser = {
    name: 'Test Student',
    email: 'test.student@example.com',
    password: 'Test123!@#',
    studentId: 'ST2025001',
    department: 'Computer Science',
    semester: 1,
    batch: '2025'
};

// Helper function to print response or error
const logResponse = (action, response, error = null) => {
    if (error) {
        console.error(`❌ ${action} failed:`, error.response?.data || error.message);
        return false;
    }
    console.log(`✓ ${action} successful`);
    return true;
};

// Register a new user
async function registerUser() {
    try {
        console.log('\n1. Testing Registration...');
        console.log('Sending registration data:', testUser);
        const response = await axios.post(`${API_URL}/auth/register`, testUser);
        console.log('User created:', response.data.user);
        return logResponse('Registration', response);
    } catch (error) {
        console.error('Full error:', error);
        if (error.response?.status === 400 && error.response.data.message === 'Email already registered') {
            console.log('Note: User already exists, proceeding with tests...');
            return true;
        }
        return logResponse('Registration', null, error);
    }
}

// Login with the test user
async function loginUser() {
    try {
        console.log('\n2. Testing Login...');
        const response = await axios.post(`${API_URL}/auth/login`, {
            email: testUser.email,
            password: testUser.password
        });
        authToken = response.data.token;
        console.log('Token received:', authToken.substring(0, 20) + '...');
        return logResponse('Login', response);
    } catch (error) {
        return logResponse('Login', null, error);
    }
}

// Test protected profile route
async function getProfile() {
    try {
        console.log('\n3. Testing Protected Profile Route...');
        const response = await axios.get(`${API_URL}/auth/profile`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        console.log('Profile data:', response.data);
        return logResponse('Profile fetch', response);
    } catch (error) {
        return logResponse('Profile fetch', null, error);
    }
}

// Test invalid authentication
async function testInvalidAuth() {
    try {
        console.log('\n4. Testing Invalid Authentication...');
        await axios.get(`${API_URL}/auth/profile`, {
            headers: { 'Authorization': 'Bearer invalid_token' }
        });
    } catch (error) {
        if (error.response?.status === 401) {
            console.log('✓ Invalid token correctly rejected');
            return true;
        }
        return logResponse('Invalid auth test', null, error);
    }
}

// Check if server is available
async function checkServer() {
    try {
        const response = await axios.get(`${API_URL}/api/health`);
        console.log('Server health check:', response.data);
        return true;
    } catch (error) {
        console.error('❌ Server is not running. Please start the server first:');
        console.log('1. Open a new terminal');
        console.log('2. Navigate to the server directory: cd server');
        console.log('3. Start the server: node index.js');
        return false;
    }
}

// Run all tests
async function runTests() {
    console.log('Starting Authentication Tests...');
    console.log('=================================');
    
    // Check if server is running
    const serverAvailable = await checkServer();
    if (!serverAvailable) return;
    
    const registrationSuccess = await registerUser();
    if (!registrationSuccess) return;
    
    const loginSuccess = await loginUser();
    if (!loginSuccess) return;
    
    const profileSuccess = await getProfile();
    if (!profileSuccess) return;
    
    await testInvalidAuth();
    
    console.log('\n=================================');
    console.log('✓ All tests completed!');
    
    console.log('\nTo verify in MongoDB:');
    console.log('1. Open MongoDB Compass');
    console.log('2. Connect to mongodb://127.0.0.1:27017');
    console.log('3. Check the "students" collection');
    console.log('4. Verify the test user data is stored correctly');
}

runTests();