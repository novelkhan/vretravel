import axios from 'axios';

const OrderService = {
  cartCheckout: (selectedCartItems) => axios.post('/api/order/cart-checkout', selectedCartItems),
  singleCheckout: (packageId) => axios.post('/api/order/single-checkout', packageId),
  getOrderHistory: () => axios.get('/api/order/order-history'),
  getOrderDetails: (orderId) => axios.get(`/api/order/order-details/${orderId}`),
};

export default OrderService;