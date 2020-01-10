const Expo = require("expo-server-sdk").Expo;
let expo = new Expo();
const pushNotificationForUser = async (pushToken, body, data) => {
  try {
    if (!Expo.isExpoPushToken(pushToken)) {
      console.error(`Push token ${pushToken} is not a valid Expo push token`);
    }
    const message = {
      to: pushToken,
      sound: "default",
      body: body,
      data: data
    };
    const messages = [message];
    let chunks = expo.chunkPushNotifications(messages);
    for (let chunk of chunks) {
      await expo.sendPushNotificationsAsync(chunk);
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  pushNotificationForUser
};
