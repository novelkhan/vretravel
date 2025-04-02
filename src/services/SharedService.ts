import { BehaviorSubject } from 'rxjs';

interface NotificationState {
  isOpen: boolean;
  isSuccess: boolean;
  title: string;
  message: string;
}

interface ExpiringSessionState {
  isOpen: boolean;
}

class SharedService {
  private notificationSubject = new BehaviorSubject<NotificationState>({
    isOpen: false,
    isSuccess: true,
    title: '',
    message: '',
  });

  private expiringSessionSubject = new BehaviorSubject<ExpiringSessionState>({
    isOpen: false,
  });

  public notification$ = this.notificationSubject.asObservable();
  public expiringSession$ = this.expiringSessionSubject.asObservable();

  public displayingExpiringSessionModal = false;

  showNotification(isSuccess: boolean, title: string, message: string) {
    console.log('Showing notification:', { isSuccess, title, message });
    this.notificationSubject.next({
      isOpen: true,
      isSuccess,
      title,
      message,
    });
  }

  closeNotification() {
    console.log('Closing notification...');
    this.notificationSubject.next({
      ...this.notificationSubject.getValue(),
      isOpen: false,
    });
  }

  openExpiringSessionCountdown() {
    console.log('Opening expiring session countdown...');
    this.expiringSessionSubject.next({ isOpen: true });
  }

  closeExpiringSessionCountdown() {
    console.log('Closing expiring session countdown...');
    this.expiringSessionSubject.next({ isOpen: false });
    this.displayingExpiringSessionModal = false;
  }
}

const sharedService = new SharedService();
export default sharedService;