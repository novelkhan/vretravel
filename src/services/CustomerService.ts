import axios from 'axios';
import { environment } from '../environments';
import accountService from './AccountService'; // JWT টোকেনের জন্য

const API_URL = `${environment.apiUrl}/api/customer`;

class CustomerService {
  async getCustomers() {
    try {
      const response = await axios.get(`${API_URL}/get-customers`, {
        headers: {
          'Authorization': `Bearer ${accountService.getJWT()}`
        }
      });
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data || 'Failed to fetch customers');
    }
  }
}

const customerService = new CustomerService();
export default customerService;