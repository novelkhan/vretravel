// src/services/AccountService.ts
import axios from 'axios';
import { environment } from '../environments';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, map, take } from 'rxjs';
import sharedService from './SharedService';
import { User, Login, Register, ConfirmEmail, ResetPassword } from '../models/account';

const API_URL = `${environment.apiUrl}/api/account`;
const USER_KEY = `${environment.userKey}`;

class AccountService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  private refreshTokenTimeout: any;
  private timeoutId: any;

  constructor() {
    const savedUser = localStorage.getItem(USER_KEY);
    if (savedUser) {
      const user: User = JSON.parse(savedUser);
      this.setUser(user);
    }
  }

  public getCurrentUser(): User | null {
    return this.userSubject.getValue();
  }

  async refreshToken() {
    console.log('Refreshing token...');
    try {
      const response = await axios.post<User>(
        `${API_URL}/refresh-token`, 
        {}, 
        {
          withCredentials: true, // কুকি সেন্ড করার জন্য
          headers: {
            'Authorization': `Bearer ${this.getJWT()}` // এক্সেস টোকেন হেডারে
          }
        }
      );
  
      if (response.data) {
        this.setUser(response.data);
        console.log('Token refreshed successfully');
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Error refreshing token:', error);
      
      // 401 এর ক্ষেত্রে অটো লগআউট
      if (error.response?.status === 401) {
        this.logout();
        sharedService.showNotification(false, 'Session Expired', 'Please login again');
      }
      
      return false;
    }
  }

  async refreshUser(jwt: string | null) {
    console.log('Refreshing user with JWT:', jwt);
    if (!jwt) {
      this.userSubject.next(null);
      return;
    }
    try {
      const response = await axios.get<User>(`${API_URL}/refresh-page`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        withCredentials: true,
      });
      if (response.data) {
        this.setUser(response.data);
        console.log('User refreshed successfully:', response.data);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  }

  async login(model: Login) {
    console.log('Logging in with:', model);
    try {
      const response = await axios.post<User>(`${API_URL}/login`, model, { withCredentials: true });
      if (response.data) {
        this.setUser(response.data);
        console.log('Login successful:', response.data);
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      sharedService.showNotification(false, 'Login Failed', error.response?.data || 'Invalid credentials');
    }
  }

  async register(model: Register) {
    return axios.post(`${API_URL}/register`, model);
  }

  async confirmEmail(model: ConfirmEmail) {
    return axios.put(`${API_URL}/confirm-email`, model);
  }

  async resendEmailConfirmationLink(email: string) {
    return axios.post(`${API_URL}/resend-email-confirmation-link/${email}`, {});
  }

  async forgotUsernameOrPassword(email: string) {
    return axios.post(`${API_URL}/forgot-username-or-password/${email}`, {});
  }

  async resetPassword(model: ResetPassword) {
    return axios.put(`${API_URL}/reset-password`, model);
  }

  logout() {
    console.log('Logging out...');
    try {
      localStorage.removeItem(USER_KEY);
      this.userSubject.next(null);
      this.stopRefreshTokenTimer();
      clearTimeout(this.timeoutId);
  
      if (sharedService.isAutoLogout) {
        // স্বয়ংক্রিয় লগআউটের ক্ষেত্রে
        localStorage.setItem('autoLogout', 'true'); // ফ্ল্যাগ সেট করুন
      } else {
        localStorage.removeItem('autoLogout'); // ম্যানুয়াল লগআউটের ক্ষেত্রে ফ্ল্যাগ রিমুভ করুন
      }
  
      // হোম পেজে রিডাইরেক্ট
      window.location.href = '/';
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  getJWT() {
    const userData = localStorage.getItem(USER_KEY);
    if (userData) {
      const user: User = JSON.parse(userData);
      return user.jwt;
    }
    return null;
  }

  // ... পূর্বের কোড অপরিবর্তিত ...

checkUserIdleTimeout() {
  console.log('Checking user idle timeout...');
  clearTimeout(this.timeoutId);

  this.user$.pipe(take(1)).subscribe(user => {
    if (user) {
      if (!sharedService.displayingExpiringSessionModal) {
        console.log('Setting timeout for 10 seconds...');
        this.timeoutId = setTimeout(() => {
          console.log('Timeout reached, opening expiring session modal...');
          sharedService.displayingExpiringSessionModal = true;
          sharedService.openExpiringSessionCountdown(5); // 5 সেকেন্ডের কাউন্টডাউন
        }, 10 * 1000); // 10 সেকেন্ড (10000 মিলিসেকেন্ড)
      } else {
        console.log('Expiring session modal already displaying...');
      }
    } else {
      console.log('No user logged in, skipping idle timeout...');
    }
  });
}

// ... বাকি কোড অপরিবর্তিত ...

  private setUser(user: User) {
    this.stopRefreshTokenTimer();
    this.startRefreshTokenTimer(user.jwt);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.userSubject.next(user);

    sharedService.displayingExpiringSessionModal = false;
    this.checkUserIdleTimeout();
  }

  private startRefreshTokenTimer(jwt: string) {
    const decodedToken: any = jwtDecode(jwt);
    const expires = new Date(decodedToken.exp * 1000);
    const timeout = expires.getTime() - Date.now() - 30 * 1000;

    if (timeout > 0) {
      this.refreshTokenTimeout = setTimeout(() => this.refreshToken(), timeout);
    }
  }

  private stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeout);
  }
}

const accountService = new AccountService();
export default accountService;