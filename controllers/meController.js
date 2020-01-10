const { User } = require("../models/user");
const { Detail, validateUpdateDetails } = require("../models/detail");
const _ = require("lodash");
const getUserDetails = async (req, res) => {
  try {
    // console.log(req.userId);
    let user = await User.findById(req.userId, "-__v -password")
      .populate("details", "-__v -_id")
      .populate({
        path: "addresses",
        model: "addresses",
        populate: [
          {
            path: "tech_park_id",
            model: "tech_parks"
          },
          {
            path: "stall_loc_id",
            model: "stall_locations"
          }
        ]
      });
    res.status(200).send({
      _status: "success",
      _data: user
    });
  } catch (ex) {
    res.status(400).send({
      _status: "fail",
      _message: ex.message
    });
  }
};

const postUserDetails = async (req, res) => {
  try {
    const mDetails = _.pick(req.body, [
      "firstName",
      "lastName",
      "phoneNumber",
      "location",
      "dateOfBirth",
      "preferredMeal",
      "description"
    ]);
    const keys = Object.keys(mDetails);
    keys.map(x => {
      if (mDetails[x] === null) {
        delete mDetails[x];
      }
    });
    // console.log(mDetails);
    // console.log("Post - Details");
    const { error } = validateUpdateDetails(mDetails);
    if (error) {
      if (
        error.details[0].message === 'firstName" is not allowed to be empty'
      ) {
        return res.status(400).send({
          _status: "fail",
          _message: "First Name is required"
        });
      } else {
        return res.status(400).send({
          _status: "fail",
          _message: error.details[0].message
        });
      }
    }
    let user = await User.findById(req.userId).select("details");
    if (user.details) {
      let details = await Detail.findById(user.details);
      keys.map(x => {
        if (mDetails[x]) {
          details[x] = mDetails[x];
        }
      });
      // console.log(details);
      await details.save();
      // console.log(details);
      res.status(200).send({
        _status: "success",
        _data: details
      });
    }
  } catch (ex) {
    res.status(400).send({
      _status: "fail",
      _message: ex.message
    });
  }
};

const postUserImage = async (req, res) => {
  const avatarFile = _.get(req, "file", null) || null;
  var response;
  if (!avatarFile) {
    response = {
      _status: "fail",
      _message: "Unsupported file."
    };
    return res.status(400).send(response);
  } else {
    try {
      var fileName = _.get(avatarFile, "filename");
      let user = await User.findById(req.userId).select("details");
      if (user.details) {
        let details = await Detail.findById(user.details);
        details.userImageUrl = `/uploads/avatars/${fileName}`;
        await details.save();
        res.status(200).send({
          _status: "success",
          _data: details
        });
        return res.status(200).send(response);
      }
    } catch (err) {
      response = {
        _status: "fail",
        _message: err.message
      };
      return res.status(400).send(response);
    }
  }
};

const postNotifToken = async (req, res) => {
  try {
    const { pushNotificationToken } = req.body;
    if (!pushNotificationToken) {
      res.status(400).send({
        _status: "fail"
      });
    }
    let user = await User.findById(req.userId).select("details");
    if (user.details) {
      let details = await Detail.findById(user.details);
      if (details["pushNotifToken"] !== pushNotificationToken) {
        details["pushNotifToken"] = pushNotificationToken;
        await details.save();
      }
      res.status(200).send({
        _status: "success"
      });
    }
  } catch (ex) {
    res.status(400).send({
      _status: "fail"
    });
  }
};
module.exports = {
  getUserDetails,
  postUserDetails,
  postUserImage,
  postNotifToken
};
