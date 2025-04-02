// src/services/SharedService.ts
import { BehaviorSubject, Subject } from 'rxjs';

interface NotificationState {
  isOpen: boolean;
  isSuccess: boolean;
  title: string;
  message: string;
  callback?: () => void; // Angular-এর মতো callback যোগ করা হয়েছে
}

class SharedService {
  private notificationSubject = new BehaviorSubject<NotificationState>({
    isOpen: false,
    isSuccess: true,
    title: '',
    message: '',
    callback: undefined,
  });

  private modalOpenedSubject = new Subject<number>();
  public notification$ = this.notificationSubject.asObservable();
  public modalOpened$ = this.modalOpenedSubject.asObservable();
  public displayingExpiringSessionModal = false; // Angular-এর মতো property রাখা হয়েছে

  showNotification(isSuccess: boolean, title: string, message: string, callback?: () => void) {
    console.log('Showing notification:', { isSuccess, title, message });
    this.notificationSubject.next({
      isOpen: true,
      isSuccess,
      title,
      message,
      callback,
    });
    this.openNotificationModal();
  }

  closeNotification() {
    console.log('Closing notification...');
    this.notificationSubject.next({
      ...this.notificationSubject.getValue(),
      isOpen: false,
    });
  }

  private openNotificationModal() {
    const modalElement = document.getElementById('notificationModal');
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  openExpiringSessionCountdown(targetTime: number = 5) {
    this.displayingExpiringSessionModal = true;
    const modalElement = document.getElementById('sessionModal');
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
      this.modalOpenedSubject.next(targetTime); // Angular-এর মতো targetTime emit করা হয়েছে
    }
  }
}

const sharedService = new SharedService();
export default sharedService;