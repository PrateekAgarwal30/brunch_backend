const _ = require("lodash");
const Fawn = require("fawn");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const format = require("util").format;
const { Storage: googleStorage } = require("@google-cloud/storage");
const storage = new googleStorage({
  projectId: "brunch-pvt-ltd",
  keyFilename: path.join(__dirname, "../brunch-pvt-ltd-firebase-adminsdk.json")
});
const bucket = storage.bucket("brunch-pvt-ltd.appspot.com");
const {
  TechParkAddress,
  validateTechParkAddress,
  validateLocation,
  StallLocation
} = require("../models/tech_parks");

const { Meal, validateMeal } = require("../models/meals");

const postNewTechPark = async (req, res) => {
  try {
    console.log("Post - Tech Address");
    let addAddress = _.pick(req.body, [
      "techPark",
      "company",
      "tPark_location",
      "address",
      "area",
      "city"
    ]);
    let { error } = validateTechParkAddress(addAddress);
    if (error) {
      return res.status(400).send({
        _status: "fail",
        _message: error.details[0].message
      });
    }
    const newAddress = new TechParkAddress({
      ...addAddress,
      stall_locations: []
    });
    await newAddress.save();
    res.status(200).send({
      _status: "success",
      _data: { newAddress }
    });
  } catch (ex) {
    res.status(400).send({
      _status: "fail",
      _message: ex.message
    });
  }
};
const postNewStallLocationForTechPark = async (req, res) => {
  try {
    console.log("Post - Stall Location");
    let addLocation = _.pick(req.body, ["location", "tag"]);
    let { error } = validateLocation(addLocation);
    if (error) {
      return res.status(400).send({
        _status: "fail",
        _message: error.details[0].message
      });
    }

    let tech_park = await TechParkAddress.findById(req.body.tech_park_id);
    if (!tech_park) {
      return res.status(400).send({
        _status: "fail",
        _message: "Invalid Tech Park Id"
      });
    }
    const newLocation = new StallLocation(
      _.pick(req.body, ["location", "tag"])
    );
    tech_park.stall_locations.push(newLocation._id);
    await Fawn.Task()
      .save("stall_locations", newLocation)
      .update(
        "tech_parks",
        { _id: tech_park._id },
        { stall_locations: tech_park.stall_locations }
      )
      .run();
    res.status(200).send({
      _status: "success",
      _data: { tech_park, newLocation }
    });
  } catch (ex) {
    res.status(400).send({
      _status: "fail",
      _message: ex.message
    });
  }
};

const postNewMeal = async (req, res) => {
  try {
    if (!req.file) {
      throw new Error(
        "Meal Image not passed.\nPlease select png/jpg file only."
      );
    }
    let mealDeatils = _.pick(req.body, [
      "name",
      "status",
      "type",
      "mealType",
      "price",
      "subtitle",
      "body",
      "quantityAvailable"
    ]);
    let { error } = validateMeal(mealDeatils);
    if (error) {
      throw new Error(error);
    }
    const imageThumbBuffer = await sharp(req.file.buffer)
      .resize(105, 75)
      .png()
      .toBuffer();
    const imageThumbInfo = {
      buffer: imageThumbBuffer,
      mimetype: "image/png",
      uploadFileName: `mealsThumbmail/meal_${Date.now()}`
    };
    const uploadThumbnailImageResponse = await uploadImageToStorage(
      imageThumbInfo
    );
    req.file.uploadFileName = `meals/meal_${Date.now()}`;
    const uploadImageResponse = await uploadImageToStorage(req.file);
    mealDeatils["mealImageUrl"] = uploadImageResponse;
    mealDeatils["mealThumbnailUrl"] = uploadThumbnailImageResponse;
    const newMeal = new Meal({
      ...mealDeatils
    });
    await newMeal.save();
    res.status(200).send({
      _status: "success",
      _data: { newMeal }
    });
  } catch (ex) {
    res.status(400).send({
      _status: "fail",
      _message: ex.message
    });
  }
};

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
module.exports = {
  postNewTechPark,
  postNewStallLocationForTechPark,
  postNewMeal
};
