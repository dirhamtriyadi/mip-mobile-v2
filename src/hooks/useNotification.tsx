import notifee, { AndroidImportance } from '@notifee/react-native';

export const useNotification = () => {
    const showNotification = async (title: string, body: string) => {
        try {
            // Request permissions (required for iOS)
            await notifee.requestPermission()
            // Create a channel (required for Android)
            const channelId = await notifee.createChannel({
                id: 'sound',
                name: title,
                sound: 'dutifully',
                importance: AndroidImportance.HIGH,
            });

            await notifee.displayNotification({
                title,
                body,
                android: {
                    channelId,
                },
            });
        } catch (error) {
            console.error(error);
        }
    };

    return { showNotification };
};