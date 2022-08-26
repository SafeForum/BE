const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//models
const User = require("../../models/user");
const Profile = require("../../models/profile");
const { findOne } = require("../../models/profile");
const profile = require("../../models/profile");

let userInfo;

const user = async (userId) => {
  try {
    const userData = await User.findById(userId)
    return {
      ...userData._doc,
      _id: userData.id
    }
  } catch (err) {
   throw err 
  }
}

const attachProfile = async (profileId) => {
  try {
    const profileData = await Profile.findById(profileId)
    return {
      ...profileData._doc,
      _id: profileData.id
    }
  } catch (err) {
    throw err
  }
}

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
      return userInfo
    } catch (err) {
      throw err;
    }
  },
  addProfile: async (args) => {
    const userData = await User.findOne(userInfo)
    const newProfile = new Profile({
      firstName: args.profileInput.firstName,
      lastName: args.profileInput.lastName,
      dob: args.profileInput.dob,
      bio: args.profileInput.bio || null,
      avatar: args.profileInput.avatar || null,
      city: args.profileInput.city,
      state: args.profileInput.state,
      occupation: args.profileInput.occupation || null,
      user: userData.id,
    });

    ///save profile
    let mergedProfile;
    try {
      const result = await newProfile.save();
      const mergeUser = await User.findById(userData.id)
      mergeUser.profile = result
      mergeUser.save()      
      mergedProfile = {
        ...result._doc,
        user: user.bind(this, result._doc.user)
      }
    } catch (err) {
      throw new Error("Cannot attach profile");
    }
    return mergedProfile;
  },
  editProfile: async (args) => {
    const update = {
      firstName: args.profileInput.firstName,
      lastName: args.profileInput.lastName,
      bio: args.profileInput.bio || null,
      avatar: args.profileInput.avatar || null,
      city: args.profileInput.city,
      state: args.profileInput.state,
      occupation: args.profileInput.occupation || null,
    };
    try {
      const findProfile = await Profile.findOneAndUpdate(
        args.profId,
        update
      );
      if (!findProfile) {
        throw new Error("Profile does not exist.");
      }
      
      return await Profile.findById(args.profId)
    } catch (err) {
      throw err;
    }
  },
  getUsers: async () => {
    try {
      const users = await User.find()
      return users.map(user => {
        return {
          ...user._doc,
          _id: user.id,
          profile: attachProfile.bind(this, user.profile)
        }
       })
    } catch (err) {
      throw new Error("No users")
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
