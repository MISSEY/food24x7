const axios = require('axios');

async function simpleTest() {
  try {
    console.log('Testing Food24x7 API Health Check...\n');
    
    // Test health endpoint
    const healthResponse = await axios.get('http://localhost:3000/health');
    console.log('✅ Health Check Status:', healthResponse.status);
    console.log('✅ Response:', healthResponse.data);
    
    console.log('\n🎉 Basic API test completed successfully!');
    console.log('\n📋 API Endpoints Available:');
    console.log('   🔐 Authentication: /api/v1/auth/*');
    console.log('   🏪 Restaurants: /api/v1/restaurants/*');
    console.log('   👥 Users: /api/v1/users/*');
    console.log('   🍽️  Menus: /api/v1/menus/*');
    console.log('   📦 Orders: /api/v1/orders/*');
    console.log('   ⚙️  Admin: /api/v1/admin/*');
    
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    console.log('\n⚠️  Server may not be running. Try: npm run dev');
  }
}

simpleTest();
