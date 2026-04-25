export class NotificationManager {
    static async requestPermission() {
        if (!("Notification" in window)) return false;
        if (Notification.permission === "granted") return true;

        const permission = await Notification.requestPermission();
        return permission === "granted";
    }

    static async notify(title: string, body: string, icon = "/icon.png") {
        if (Notification.permission !== "granted") {
            const ok = await this.requestPermission();
            if (!ok) return;
        }

        return new Notification(`NAFSI: ${title}`, {
            body,
            icon,
            silent: false,
        });
    }

    // Schedule a reminder (simulation)
    static schedulePulseReminders() {
        // In a real app, this would use a Background Worker or Electrobun's native scheduler
        // For MVP, we'll just check if it's 9am or 9pm every few minutes
        setInterval(() => {
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();

            if (minutes === 0 && (hours === 9 || hours === 21)) {
                this.notify("Neural Mapping Required", "Initialize your pulse synchronization for the current window.");
            }
        }, 60000); // Check every minute
    }
}
