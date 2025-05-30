 // API Configuration
const API_BASE_URL = 'http://localhost:3000/api/v1';
let authToken = localStorage.getItem('authToken');
let currentUser = null;

// DOM Elements
const authStatus = document.getElementById('auth-status');
const logoutBtn = document.getElementById('logout-btn');
const resultsDiv = document.getElementById('results');
const loadingDiv = document.getElementById('loading');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    initializeAuth();
    initializeEventListeners();
    
    // Check if user is already logged in
    if (authToken) {
        getCurrentUser();
    }
});

// Tab Management
function initializeTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            btn.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

// Authentication Management
function initializeAuth() {
    updateAuthStatus();
    
    logoutBtn.addEventListener('click', logout);
}

function updateAuthStatus() {
    if (authToken && currentUser) {
        authStatus.textContent = `Logged in as: ${currentUser.name} (${currentUser.role})`;
        logoutBtn.style.display = 'block';
    } else {
        authStatus.textContent = 'Not logged in';
        logoutBtn.style.display = 'none';
    }
}

function logout() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('authToken');
    updateAuthStatus();
    displayResult({ message: 'Logged out successfully' });
}

// Event Listeners
function initializeEventListeners() {
    // Authentication
    document.getElementById('register-form').addEventListener('submit', handleRegister);
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('get-user-btn').addEventListener('click', getCurrentUser);
    
    // Restaurants
    document.getElementById('get-restaurants-btn').addEventListener('click', getRestaurants);
    document.getElementById('create-restaurant-form').addEventListener('submit', handleCreateRestaurant);
    document.getElementById('search-restaurants-btn').addEventListener('click', searchRestaurants);
    
    // Menus
    document.getElementById('get-menu-btn').addEventListener('click', getRestaurantMenu);
    document.getElementById('create-menu-form').addEventListener('submit', handleCreateMenuItem);
    document.getElementById('search-menu-btn').addEventListener('click', searchMenuItems);
    
    // Orders
    document.getElementById('get-orders-btn').addEventListener('click', getMyOrders);
    document.getElementById('create-order-form').addEventListener('submit', handleCreateOrder);
    document.getElementById('update-order-form').addEventListener('submit', handleUpdateOrderStatus);
    document.getElementById('add-item-btn').addEventListener('click', addOrderItem);
    
    // Admin
    document.getElementById('get-dashboard-btn').addEventListener('click', getDashboard);
    document.getElementById('get-all-users-btn').addEventListener('click', getAllUsers);
    document.getElementById('get-all-restaurants-admin-btn').addEventListener('click', getAllRestaurantsAdmin);
    document.getElementById('get-all-orders-admin-btn').addEventListener('click', getAllOrdersAdmin);
    document.getElementById('verify-restaurant-form').addEventListener('submit', handleVerifyRestaurant);
}

// Utility Functions
function showLoading() {
    loadingDiv.style.display = 'block';
    resultsDiv.textContent = '';
}

function hideLoading() {
    loadingDiv.style.display = 'none';
}

function displayResult(data, isError = false) {
    hideLoading();
    resultsDiv.textContent = JSON.stringify(data, null, 2);
    resultsDiv.className = isError ? 'error' : 'success';
}

function getAuthHeaders() {
    return authToken ? { 'Authorization': `Bearer ${authToken}` } : {};
}

async function makeRequest(url, options = {}) {
    showLoading();
    
    try {
        const response = await fetch(`${API_BASE_URL}${url}`, {
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders(),
                ...options.headers
            },
            ...options
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || `HTTP error! status: ${response.status}`);
        }
        
        displayResult(data);
        return data;
    } catch (error) {
        displayResult({ error: error.message }, true);
        throw error;
    }
}

// Authentication Functions
async function handleRegister(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('reg-name').value,
        email: document.getElementById('reg-email').value,
        password: document.getElementById('reg-password').value,
        phone: document.getElementById('reg-phone').value,
        role: document.getElementById('reg-role').value,
        address: {
            street: document.getElementById('reg-street').value,
            city: document.getElementById('reg-city').value,
            state: document.getElementById('reg-state').value,
            zipCode: document.getElementById('reg-zipcode').value,
            country: document.getElementById('reg-country').value
        }
    };
    
    try {
        const data = await makeRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify(formData)
        });
        
        if (data.token) {
            authToken = data.token;
            currentUser = data.data;
            localStorage.setItem('authToken', authToken);
            updateAuthStatus();
        }
    } catch (error) {
        console.error('Registration failed:', error);
    }
}

async function handleLogin(e) {
    e.preventDefault();
    
    const formData = {
        email: document.getElementById('login-email').value,
        password: document.getElementById('login-password').value
    };
    
    try {
        const data = await makeRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify(formData)
        });
        
        if (data.token) {
            authToken = data.token;
            currentUser = data.data;
            localStorage.setItem('authToken', authToken);
            updateAuthStatus();
        }
    } catch (error) {
        console.error('Login failed:', error);
    }
}

async function getCurrentUser() {
    if (!authToken) {
        displayResult({ error: 'Please login first' }, true);
        return;
    }
    
    try {
        const data = await makeRequest('/auth/me');
        currentUser = data.data;
        updateAuthStatus();
    } catch (error) {
        console.error('Failed to get user:', error);
    }
}

// Restaurant Functions
async function getRestaurants() {
    const params = new URLSearchParams();
    
    const cuisine = document.getElementById('cuisine-filter').value;
    const city = document.getElementById('city-filter').value;
    const rating = document.getElementById('rating-filter').value;
    
    if (cuisine) params.append('cuisine', cuisine);
    if (city) params.append('city', city);
    if (rating) params.append('rating', rating);
    
    const queryString = params.toString();
    const url = `/restaurants${queryString ? '?' + queryString : ''}`;
    
    await makeRequest(url);
}

async function handleCreateRestaurant(e) {
    e.preventDefault();
    
    if (!authToken) {
        displayResult({ error: 'Please login first' }, true);
        return;
    }
    
    const formData = {
        name: document.getElementById('rest-name').value,
        description: document.getElementById('rest-description').value,
        cuisine: document.getElementById('rest-cuisine').value.split(',').map(c => c.trim()),
        address: {
            street: document.getElementById('rest-street').value,
            city: document.getElementById('rest-city').value,
            state: document.getElementById('rest-state').value,
            zipCode: document.getElementById('rest-zipcode').value,
            country: 'India'
        },
        phone: document.getElementById('rest-phone').value,
        email: document.getElementById('rest-email').value,
        openingHours: {
            monday: { open: '09:00', close: '22:00' },
            tuesday: { open: '09:00', close: '22:00' },
            wednesday: { open: '09:00', close: '22:00' },
            thursday: { open: '09:00', close: '22:00' },
            friday: { open: '09:00', close: '22:00' },
            saturday: { open: '09:00', close: '22:00' },
            sunday: { open: '09:00', close: '22:00' }
        },
        deliveryRadius: parseInt(document.getElementById('rest-delivery-radius').value),
        minimumOrder: parseInt(document.getElementById('rest-min-order').value),
        deliveryFee: parseInt(document.getElementById('rest-delivery-fee').value)
    };
    
    await makeRequest('/restaurants', {
        method: 'POST',
        body: JSON.stringify(formData)
    });
}

async function searchRestaurants() {
    const params = new URLSearchParams();
    
    const query = document.getElementById('search-query').value;
    const location = document.getElementById('search-location').value;
    
    if (query) params.append('q', query);
    if (location) params.append('location', location);
    
    const queryString = params.toString();
    const url = `/restaurants/search${queryString ? '?' + queryString : ''}`;
    
    await makeRequest(url);
}

// Menu Functions
async function getRestaurantMenu() {
    const restaurantId = document.getElementById('restaurant-id-menu').value;
    
    if (!restaurantId) {
        displayResult({ error: 'Please enter a restaurant ID' }, true);
        return;
    }
    
    const params = new URLSearchParams();
    const category = document.getElementById('category-filter').value;
    
    if (category) params.append('category', category);
    
    const queryString = params.toString();
    const url = `/menus/restaurant/${restaurantId}${queryString ? '?' + queryString : ''}`;
    
    await makeRequest(url);
}

async function handleCreateMenuItem(e) {
    e.preventDefault();
    
    if (!authToken) {
        displayResult({ error: 'Please login first' }, true);
        return;
    }
    
    const ingredients = document.getElementById('menu-ingredients').value;
    
    const formData = {
        name: document.getElementById('menu-name').value,
        description: document.getElementById('menu-description').value,
        price: parseFloat(document.getElementById('menu-price').value),
        category: document.getElementById('menu-category').value,
        isVegetarian: document.getElementById('menu-vegetarian').value === 'true',
        isVegan: document.getElementById('menu-vegan').value === 'true',
        spiceLevel: document.getElementById('menu-spice').value,
        preparationTime: parseInt(document.getElementById('menu-prep-time').value),
        ingredients: ingredients ? ingredients.split(',').map(i => i.trim()) : [],
        allergens: ['none'],
        nutritionalInfo: {
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0
        }
    };
    
    await makeRequest('/menus', {
        method: 'POST',
        body: JSON.stringify(formData)
    });
}

async function searchMenuItems() {
    const params = new URLSearchParams();
    
    const query = document.getElementById('menu-search-query').value;
    const vegetarian = document.getElementById('menu-search-vegetarian').value;
    
    if (query) params.append('q', query);
    if (vegetarian) params.append('vegetarian', vegetarian);
    
    const queryString = params.toString();
    const url = `/menus/search${queryString ? '?' + queryString : ''}`;
    
    await makeRequest(url);
}

// Order Functions
async function getMyOrders() {
    if (!authToken) {
        displayResult({ error: 'Please login first' }, true);
        return;
    }
    
    await makeRequest('/orders');
}

function addOrderItem() {
    const orderItemsDiv = document.getElementById('order-items');
    const newItem = document.createElement('div');
    newItem.className = 'order-item';
    newItem.innerHTML = `
        <input type="text" placeholder="Menu Item ID" class="menu-item-id" required>
        <input type="number" placeholder="Quantity" class="quantity" min="1" required>
        <input type="text" placeholder="Special Instructions" class="special-instructions">
    `;
    orderItemsDiv.appendChild(newItem);
}

async function handleCreateOrder(e) {
    e.preventDefault();
    
    if (!authToken) {
        displayResult({ error: 'Please login first' }, true);
        return;
    }
    
    const orderItems = [];
    const orderItemDivs = document.querySelectorAll('.order-item');
    
    orderItemDivs.forEach(div => {
        const menuItemId = div.querySelector('.menu-item-id').value;
        const quantity = div.querySelector('.quantity').value;
        const specialInstructions = div.querySelector('.special-instructions').value;
        
        if (menuItemId && quantity) {
            orderItems.push({
                menuItem: menuItemId,
                quantity: parseInt(quantity),
                specialInstructions: specialInstructions || ''
            });
        }
    });
    
    if (orderItems.length === 0) {
        displayResult({ error: 'Please add at least one item to the order' }, true);
        return;
    }
    
    const formData = {
        restaurant: document.getElementById('order-restaurant-id').value,
        items: orderItems,
        deliveryAddress: {
            street: document.getElementById('order-street').value,
            city: document.getElementById('order-city').value,
            state: document.getElementById('order-state').value,
            zipCode: document.getElementById('order-zipcode').value
        },
        paymentMethod: document.getElementById('order-payment-method').value,
        specialInstructions: document.getElementById('order-special-instructions').value
    };
    
    await makeRequest('/orders', {
        method: 'POST',
        body: JSON.stringify(formData)
    });
}

async function handleUpdateOrderStatus(e) {
    e.preventDefault();
    
    if (!authToken) {
        displayResult({ error: 'Please login first' }, true);
        return;
    }
    
    const orderId = document.getElementById('update-order-id').value;
    const status = document.getElementById('update-order-status').value;
    
    if (!orderId || !status) {
        displayResult({ error: 'Please provide both order ID and status' }, true);
        return;
    }
    
    const formData = {
        status: status,
        estimatedDeliveryTime: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutes from now
    };
    
    await makeRequest(`/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify(formData)
    });
}

// Admin Functions
async function getDashboard() {
    if (!authToken) {
        displayResult({ error: 'Please login first' }, true);
        return;
    }
    
    await makeRequest('/admin/dashboard');
}

async function getAllUsers() {
    if (!authToken) {
        displayResult({ error: 'Please login first' }, true);
        return;
    }
    
    await makeRequest('/admin/users');
}

async function getAllRestaurantsAdmin() {
    if (!authToken) {
        displayResult({ error: 'Please login first' }, true);
        return;
    }
    
    await makeRequest('/admin/restaurants');
}

async function getAllOrdersAdmin() {
    if (!authToken) {
        displayResult({ error: 'Please login first' }, true);
        return;
    }
    
    await makeRequest('/admin/orders');
}

async function handleVerifyRestaurant(e) {
    e.preventDefault();
    
    if (!authToken) {
        displayResult({ error: 'Please login first' }, true);
        return;
    }
    
    const restaurantId = document.getElementById('verify-restaurant-id').value;
    
    if (!restaurantId) {
        displayResult({ error: 'Please enter a restaurant ID' }, true);
        return;
    }
    
    await makeRequest(`/admin/restaurants/${restaurantId}/verify`, {
        method: 'PUT'
    });
}

// Health Check Function
async function checkAPIHealth() {
    try {
        const response = await fetch('http://localhost:3000/health');
        const data = await response.json();
        displayResult(data);
    } catch (error) {
        displayResult({ error: 'API is not running. Please start the backend server.' }, true);
    }
}

// Add health check button functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add a health check button to the auth section
    const authSection = document.querySelector('#auth .form-section:last-child');
    const healthCheckDiv = document.createElement('div');
    healthCheckDiv.className = 'form-section';
    healthCheckDiv.innerHTML = `
        <h3>API Health Check</h3>
        <button type="button" onclick="checkAPIHealth()">Check API Status</button>
    `;
    authSection.parentNode.insertBefore(healthCheckDiv, authSection.nextSibling);
});
