import axios from 'axios';
import { environment } from '../environments';
import { MemberView, MemberAddEdit } from '../models/admin';

const API_URL = `${environment.apiUrl}/api/admin`;

class AdminService {
  async getMembers(): Promise<MemberView[]> {
    const response = await axios.get<MemberView[]>(`${API_URL}/get-members`);
    return response.data;
  }

  async getMember(id: string): Promise<MemberAddEdit> {
    const response = await axios.get<MemberAddEdit>(`${API_URL}/get-member/${id}`);
    return response.data;
  }

  async getApplicationRoles(): Promise<string[]> {
    const response = await axios.get<string[]>(`${API_URL}/get-application-roles`);
    return response.data;
  }

  async addEditMember(model: MemberAddEdit): Promise<void> {
    await axios.post(`${API_URL}/add-edit-member`, model);
  }

  async lockMember(id: string): Promise<void> {
    await axios.put(`${API_URL}/lock-member/${id}`, {});
  }

  async unlockMember(id: string): Promise<void> {
    await axios.put(`${API_URL}/unlock-member/${id}`, {});
  }

  async deleteMember(id: string): Promise<void> {
    await axios.delete(`${API_URL}/delete-member/${id}`);
  }
}

const adminService = new AdminService();
export default adminService;