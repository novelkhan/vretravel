import axios from './axiosConfig'; // নতুন axiosConfig ইমপোর্ট করুন
import { environment } from '../environments';
import { MemberView, MemberAddEdit } from '../models/admin';

const API_URL = `${environment.apiUrl}/api/admin`;

class AdminService {
  async getMembers() {
    try {
      const response = await axios.get<MemberView[]>(`${API_URL}/get-members`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data || 'Failed to fetch members');
    }
  }

  async getMember(id: string) {
    try {
      const response = await axios.get<MemberAddEdit>(`${API_URL}/get-member/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data || 'Failed to fetch member');
    }
  }

  async getApplicationRoles() {
    try {
      const response = await axios.get<string[]>(`${API_URL}/get-application-roles`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data || 'Failed to fetch roles');
    }
  }

  async addEditMember(model: MemberAddEdit) {
    try {
      const response = await axios.post(`${API_URL}/add-edit-member`, model);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data || 'Failed to add/edit member');
    }
  }

  async lockMember(id: string) {
    try {
      const response = await axios.put(`${API_URL}/lock-member/${id}`, {});
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data || 'Failed to lock member');
    }
  }

  async unlockMember(id: string) {
    try {
      const response = await axios.put(`${API_URL}/unlock-member/${id}`, {});
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data || 'Failed to unlock member');
    }
  }

  async deleteMember(id: string) {
    try {
      const response = await axios.delete(`${API_URL}/delete-member/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data || 'Failed to delete member');
    }
  }
}

const adminService = new AdminService();
export default adminService;