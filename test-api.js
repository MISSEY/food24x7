const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/v1';

async function testAPI() {
  try {
    console.log('Testing Food24x7 API...\n');

    // Test 1: Health check (GET restaurants)
    console.log('1. Testing GET /restaurants...');
    const restaurantsResponse = await axios.get(`${BASE_URL}/restaurants`);
    console.log(`✅ Status: ${restaurantsResponse.status}`);
    console.log(`   Response: ${restaurantsResponse.data.success ? 'Success' : 'Failed'}`);
    console.log(`   Count: ${restaurantsResponse.data.count || 0} restaurants\n`);

    // Test 2: Register a new user
    console.log('2. Testing POST /auth/register...');
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      phone: '9876543210',
      role: 'customer',
      address: {
        street: '123 Test Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400001',
        country: 'India'
      }
    };

    try {
      const registerResponse = await axios.post(`${BASE_URL}/auth/register`, userData);
      console.log(`✅ Status: ${registerResponse.status}`);
      console.log(`   User registered: ${registerResponse.data.data.name}`);
      console.log(`   Token received: ${registerResponse.data.token ? 'Yes' : 'No'}\n`);
      
      const token = registerResponse.data.token;

      // Test 3: Get user profile
      console.log('3. Testing GET /auth/me...');
      const profileResponse = await axios.get(`${BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(`✅ Status: ${profileResponse.status}`);
      console.log(`   Profile: ${profileResponse.data.data.name} (${profileResponse.data.data.role})\n`);

    } catch (registerError) {
      if (registerError.response?.status === 400 && registerError.response.data.error.includes('duplicate')) {
        console.log('⚠️  User already exists, trying to login...');
        
        // Test login instead
        const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
          email: userData.email,
          password: userData.password
        });
        console.log(`✅ Login Status: ${loginResponse.status}`);
        console.log(`   User logged in: ${loginResponse.data.data.name}\n`);
      } else {
        throw registerError;
      }
    }

    // Test 4: Create a restaurant (register restaurant owner first)
    console.log('4. Testing restaurant creation...');
    const restaurantOwnerData = {
      name: 'Restaurant Owner',
      email: 'owner@restaurant.com',
      password: 'password123',
      phone: '9876543211',
      role: 'restaurant'
    };

    try {
      const ownerResponse = await axios.post(`${BASE_URL}/auth/register`, restaurantOwnerData);
      const ownerToken = ownerResponse.data.token;

      const restaurantData = {
        name: 'Test Restaurant',
        description: 'A test restaurant for API testing',
        cuisine: ['Indian', 'Chinese'],
        address: {
          street: '456 Restaurant Street',
          city: 'Delhi',
          state: 'Delhi',
          zipCode: '110001',
          country: 'India'
        },
        phone: '9876543212',
        email: 'contact@testrestaurant.com',
        openingHours: {
          monday: { open: '09:00', close: '22:00' },
          tuesday: { open: '09:00', close: '22:00' },
          wednesday: { open: '09:00', close: '22:00' },
          thursday: { open: '09:00', close: '22:00' },
          friday: { open: '09:00', close: '22:00' },
          saturday: { open: '09:00', close: '23:00' },
          sunday: { open: '10:00', close: '22:00' }
        },
        deliveryRadius: 15,
        minimumOrder: 100,
        deliveryFee: 30
      };

      const restaurantResponse = await axios.post(`${BASE_URL}/restaurants`, restaurantData, {
        headers: { Authorization: `Bearer ${ownerToken}` }
      });
      console.log(`✅ Status: ${restaurantResponse.status}`);
      console.log(`   Restaurant created: ${restaurantResponse.data.data.name}\n`);

    } catch (restaurantError) {
      if (restaurantError.response?.status === 400) {
        console.log('⚠️  Restaurant owner already exists or has restaurant\n');
      } else {
        console.log(`❌ Restaurant creation failed: ${restaurantError.response?.data?.error || restaurantError.message}\n`);
      }
    }

    console.log('🎉 API testing completed successfully!');

  } catch (error) {
    console.error('❌ API test failed:', error.response?.data || error.message);
  }
}

// Run the test
testAPI();
