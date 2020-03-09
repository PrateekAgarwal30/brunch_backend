const format = require("util").format;
const path = require("path");
const { Storage: googleStorage } = require("@google-cloud/storage");
const storage = new googleStorage({
  projectId: "brunch-pvt-ltd",
  keyFilename: path.join(__dirname, "../brunch-pvt-ltd-firebase-adminsdk.json")
});
const bucket = storage.bucket("brunch-pvt-ltd.appspot.com");
const uploadImageToStorage = file => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("No image file"));
    }
    let fileUpload = bucket.file(file.uploadFileName);
    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype
      }
    });
    blobStream.on("error", error => {
      console.log("error", error);
      reject(new Error("Something is wrong! Unable to upload at the moment."));
    });

    blobStream.on("finish", () => {
      const url = format(
        `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`
      );
      resolve(url);
    });

    blobStream.end(file.buffer);
  });
};
module.exports = uploadImageToStorage;
