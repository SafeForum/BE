const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//models
const User = require("../../models/user");
const Profile = require("../../models/profile");

// let userInfo;

const user = async (userId) => {
  try {
    const userData = await User.findById(userId);
    return {
      ...userData._doc,
      _id: userData.id,
    };
  } catch (err) {
    throw err;
  }
};

const attachProfile = async (profileId) => {
  try {
    const profileData = await Profile.findById(profileId);
    return {
      ...profileData._doc,
      _id: profileData.id,
    };
  } catch (err) {
    throw err;
  }
};

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
      const savedUser = await user.save();
      const userData = await User.findOne(savedUser);
      console.log("This is args: ", args);
      const newProfile = new Profile({
        firstName: args.profileInput.firstName,
        lastName: args.profileInput.lastName,
        dob: args.profileInput.dob,
        bio: args.profileInput.bio || null,
        avatar: args.profileInput.avatar || null,
        city: args.profileInput.city,
        state: args.profileInput.state,
        occupation: args.profileInput.occupation || null,
        user: userData,
      });
      console.log(newProfile)
      const savedProfile = await newProfile.save();
      console.log("This is saved profile: ", savedProfile);
      ///save profile
      let merged;
      try {
        const mergeUser = await User.findById(userData.id);
        mergeUser.profile = savedProfile;
        const mergedUser = await mergeUser.save();
        merged = {
          ...mergedUser._doc,
          profile: attachProfile.bind(this, mergedUser._doc.profile),
        };
      } catch (err) {
        throw new Error("Cannot attach profile");
      }
      return merged;
    } catch (err) {
      throw err;
    }
  },
  editProfile: async (args) => {
    const update = {
      firstName: args.profileInfo.firstName,
      lastName: args.profileInfo.lastName,
      bio: args.profileInfo.bio || null,
      avatar: args.profileInfo.avatar || null,
      city: args.profileInfo.city,
      state: args.profileInfo.state,
      occupation: args.profileInfo.occupation || null,
    };
    try {
      const findProfile = await Profile.findOneAndUpdate(args.profId, update);
      if (!findProfile) {
        throw new Error("Profile does not exist.");
      }

      return await Profile.findById(args.profId);
    } catch (err) {
      throw err;
    }
  },
  getUsers: async () => {
    try {
      const users = await User.find();
      return users.map((user) => {
        return {
          ...user._doc,
          _id: user.id,
          profile: attachProfile.bind(this, user.profile),
        };
      });
    } catch (err) {
      throw new Error("No users");
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
