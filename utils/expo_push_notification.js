const Expo = require("expo-server-sdk").Expo;
let expo = new Expo();
const pushNotificationForUser = async (pushToken, extraParams) => {
  try {
    if (!Expo.isExpoPushToken(pushToken)) {
      console.error(`Push token ${pushToken} is not a valid Expo push token`);
    }
    const message = { ...extraParams, to: pushToken };
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
