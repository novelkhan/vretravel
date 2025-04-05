// src/services/SharedService.ts
import { BehaviorSubject, Subject } from 'rxjs';

interface NotificationState {
  isOpen: boolean;
  isSuccess: boolean;
  title: string;
  message: string;
  callback?: () => void;
}

class SharedService {
  private notificationSubject = new BehaviorSubject<NotificationState>({
    isOpen: false,
    isSuccess: true,
    title: '',
    message: '',
  });
  
  private modalOpenedSubject = new Subject<number>();
  
  public notification$ = this.notificationSubject.asObservable();
  public modalOpened$ = this.modalOpenedSubject.asObservable();
  public displayingExpiringSessionModal = false;
  public isAutoLogout: boolean = false; // নতুন ফ্ল্যাগ যোগ করা

  showNotification(isSuccess: boolean, title: string, message: string, callback?: () => void) {
    this.notificationSubject.next({
      isOpen: true,
      isSuccess,
      title,
      message,
      callback,
    });
  }

  closeNotification() {
    const currentState = this.notificationSubject.getValue();
    if (currentState.callback) {
      currentState.callback();
    }
    this.notificationSubject.next({
      ...currentState,
      isOpen: false,
    });
    this.isAutoLogout = false; // নোটিফিকেশন বন্ধ হলে ফ্ল্যাগ রিসেট
  }

  openExpiringSessionCountdown(targetTime: number = 5) {
    this.displayingExpiringSessionModal = true;
    this.modalOpenedSubject.next(targetTime);
  }
}

const sharedService = new SharedService();
export default sharedService;