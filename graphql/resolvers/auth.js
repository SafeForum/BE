const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//models
const User = require("../../models/user");
const Profile = require("../../models/profile");

let userInfo;

module.exports = {
  createUser: async (args) => {
    try {
      const existingUser = await User.findOne({ email: args.userInput.email });
      if (existingUser) {
        throw new Error("User already exists.");
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

      const user = new User({
        email: args.userInput.email,
        password: hashedPassword,
        profile: null,
      });

      const result = await user.save();
      userInfo = await User.findOne(result);
      return userInfo;
    } catch (err) {
      throw err;
    }
  },
  addProfile: async (args) => {
    const newProfile = new Profile({
      firstName: args.profileInput.firstName,
      lastName: args.profileInput.lastName,
      dob: args.profileInput.dob,
      bio: args.profileInput.bio | null,
      avatar: args.profileInput.avatar | null,
      city: args.profileInput.city,
      state: args.profileInput.state,
      occupation: args.profileInput.occupation | null,
      user: await userInfo,
    });

    ///save profile
    const profileResult = await newProfile.save();
    let mergedProfile
    try {
      mergedProfile = await User.findById(userInfo)
      mergedProfile.profile = profileResult
      mergedProfile.save()
    } catch (err) {
      throw new Error("Cannot attach profile");
    }
    console.log("This is profile merged: ", mergedProfile);
    return mergedProfile;
  },
  editProfile: async (args) => {
    const update = {
      firstName: args.profileInput.firstName,
      lastName: args.profileInput.lastName,
      bio: args.profileInput.bio | null,
      avatar: args.profileInput.avatar | null,
      city: args.profileInput.city,
      state: args.profileInput.state,
      occupation: args.profileInput.occupation | null,
    };
    try {
      const findProfile = await Profile.findOneAndUpdate(
        args.profileInput.id,
        update
      );
      if (!findProfile) {
        throw new Error("Profile does not exist.");
      }
    } catch (err) {
      throw err;
    }
  },
  login: async ({ email, password }) => {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("User does not exist!");
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new Error("Password is incorrect!");
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      "somesupersecretkey",
      {
        expiresIn: "1h",
      }
    );
    return { userId: user.id, token: token, tokenExpiration: 1 };
  },
};
