class SharedService {
  displayingExpiringSessionModal = false;
  private modalOpenedCallbacks: ((targetTime: number) => void)[] = [];
  private notificationCallbacks: ((data: { isSuccess: boolean; title: string; message: string; callback?: () => void }) => void)[] = [];

  // Subscribe to Expiring Session Modal
  onModalOpened(callback: (targetTime: number) => void) {
    this.modalOpenedCallbacks.push(callback);
  }

  // Subscribe to Notification Modal
  onNotification(callback: (data: { isSuccess: boolean; title: string; message: string; callback?: () => void }) => void) {
    this.notificationCallbacks.push(callback);
  }

  // Show Notification Modal
  showNotification(isSuccess: boolean, title: string, message: string, callback?: () => void) {
    this.notificationCallbacks.forEach(cb => cb({ isSuccess, title, message, callback }));
    this.openNotificationModal();
  }

  private openNotificationModal() {
    const modalElement = document.getElementById('notificationModal');
    if (modalElement) {
      modalElement.classList.add('show');
      modalElement.style.display = 'block';
      document.body.classList.add('modal-open');
    }
  }

  // Open Expiring Session Modal
  openExpiringSessionCountdown(targetTime: number = 5) {
    this.modalOpenedCallbacks.forEach(cb => cb(targetTime));
    const modalElement = document.getElementById('sessionModal');
    if (modalElement) {
      modalElement.classList.add('show');
      modalElement.style.display = 'block';
      document.body.classList.add('modal-open');
    }
  }
}

// Singleton Instance
const sharedService = new SharedService();
export default sharedService;