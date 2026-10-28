export const API_CONFIG = {
  baseUrl: 'http://localhost:9090/api',
  endpoints: {
    restaurants: 'http://localhost:9090/api/restaurants',
    riders: 'http://localhost:9090/api/riders',
    coupons: 'http://localhost:9090/api/coupons',
    users: 'http://localhost:9090/api/users',
    foods: 'http://localhost:9090/api/foods',
    categories: 'http://localhost:9090/api/categories',
    orders: 'http://localhost:9090/api/orders',
    auth: {
      signin: 'http://localhost:9090/api/auth/signin',
      signup: 'http://localhost:9090/api/auth/signup',
    }
  }
};
