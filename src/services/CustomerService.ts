import axios from 'axios';
import { environment } from '../environments';

const getCustomers = () => {
  return axios.get(`${environment.apiUrl}/api/customer/get-customers`);
};

export default {
  getCustomers,
};