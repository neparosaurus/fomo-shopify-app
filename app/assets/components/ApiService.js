import axios from 'axios';

let jwtToken = null;
let shop = null;

const setJwtToken = (token) => {
    jwtToken = token;
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
};

export const getJwtToken = () => jwtToken;

const setShop = (_shop) => {
    shop = _shop;
}

const getShop = () => {
    return shop;
}

const apiClient = axios.create({
    baseURL: '/api',
});

apiClient.interceptors.request.use(config => {
    let jwtToken = getJwtToken();

    if (!jwtToken) {
        console.error("JWT token is not set.");
    } else {
        config.headers['Authorization'] = `Bearer ${jwtToken}`;
    }

    return config;
}, error => {
    return Promise.reject(error);
});

export const login = async (shop) => {
    try {
        const response = await axios.post('/api/token', {
            host: shop
        });
        setShop(shop);
        setJwtToken(response.data.token);
    } catch (error) {
        console.error("Error fetching JWT token:", error);
        setJwtToken(null);
    }
}

export const refreshToken = async () => {
    try {
        const response = await axios.post('/api/token_refresh');
        if (response.data && response.data.token) {
            setJwtToken(response.data.token);
            return response.data.token; // Return the new token
        }
    } catch (error) {
        console.error("Error refreshing token:", error);
    }
}

export const getConfiguration = async () => {
    try {
        const response = await apiClient.get('/api/configuration');
        return response.data;
    } catch (error) {
        console.error("Error fetching configuration:", error);
    }
};

export const updateConfiguration = async () => {
    try {
        const response = await apiClient.post('/api/configuration');
        return response.data;
    } catch (error) {
        console.error("Error updating configuration tag:", error);
    }
}