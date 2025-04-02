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
    callback: undefined,
  });

  private modalOpenedSubject = new Subject<number>();
  public notification$ = this.notificationSubject.asObservable();
  public modalOpened$ = this.modalOpenedSubject.asObservable();
  public displayingExpiringSessionModal = false;

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
    const modalElement = document.getElementById('notificationModal');
    if (modalElement) {
      const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
        document.body.classList.remove('modal-open'); // Backdrop ঠিক করার জন্য
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) backdrop.remove();
      }
    }
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
      this.modalOpenedSubject.next(targetTime);
    }
  }
}

const sharedService = new SharedService();
export default sharedService;