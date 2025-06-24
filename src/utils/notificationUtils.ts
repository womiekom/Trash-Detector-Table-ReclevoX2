
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

export const showTrashNotification = () => {
  if (Notification.permission === 'granted') {
    const notification = new Notification('🗑️ TRASH DETECTED!', {
      body: 'Please throw the trash in the bin immediately',
      icon: '/favicon.ico',
      requireInteraction: true,
      tag: 'trash-alert'
    });

    // Auto close after 5 seconds
    setTimeout(() => {
      notification.close();
    }, 5000);

    console.log('📱 Browser notification sent for trash detection');
  }
};
