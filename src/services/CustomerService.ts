import axios from 'axios';
import { environment } from '../environments';
import accountService from './AccountService';

const API_URL = `${environment.apiUrl}/api/customer`;

class CustomerService {
  async getCustomers() {
    try {
      const response = await axios.get(`${API_URL}/get-customers`, {
        headers: {
          'Authorization': `Bearer ${accountService.getJWT()}`
        },
        // রেসপন্স ডাটা সরাসরি value field এ পেতে
        transformResponse: [(data) => {
          const parsed = JSON.parse(data);
          return parsed.value; // সরাসরি value field return করবে
        }]
      });
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data || 'Failed to fetch customers');
    }
  }
}

const customerService = new CustomerService();
export default customerService;