const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//models
const User = require("../../models/user");
const Profile = require("../../models/profile");
const cp = require("../../models/cityPortal");

// let userInfo;

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
      const bioLimit = args.profileInput.occupation.length <= 20 ? true : false;
      if (existingUser) {
        throw new Error("User already exists.");
      }
      if (!bioLimit) {
        throw new Error("Max Characters for Occupation is 20");
      }
      //add user to portal
      const findPortal = await cp.findOne({
        city: args.userInput.city,
        state: args.userInput.state,
      });
      if (!findPortal) {
        throw new Error("Portal does not exist, please submit application")
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
      const user = new User({
        email: args.userInput.email,
        password: hashedPassword,
        city: args.userInput.city,
        state: args.userInput.state,
        firstName: args.userInput.firstName,
        lastName: args.userInput.lastName,
        dob: args.userInput.dob,
        cityPortal:  findPortal,
        profile: null,
      });
      const savedUser = await user.save();
      const userData = await User.findOne(savedUser);
      findPortal.user.push(userData)
      await findPortal.save();
      const newProfile = new Profile({
        bio: args.profileInput.bio || null,
        avatar: args.profileInput.avatar || null,
        occupation: args.profileInput.occupation || null,
        user: userData,
      });
      const savedProfile = await newProfile.save();
      ///save profile
      let merged;
      try {
        const mergeUser = await User.findById(userData.id);
        mergeUser.profile = savedProfile;
        const mergedUser = await mergeUser.save();
        merged = {
          ...mergedUser._doc,
          profile: attachProfile.bind(this, mergedUser._doc.profile),
          password: null,
        };
      } catch (err) {
        throw new Error("Cannot attach profile");
      }

      try {
        const login = await User.findOne({ email: args.userInput.email });
        if (!login) {
          throw new Error("User does not exist!");
        }
        const isEqual = await bcrypt.compare(args.userInput.password, login.password);
        if (!isEqual) {
          throw new Error("Password is incorrect!");
        }
    
        const token = jwt.sign(
          { userId: login.id, email: login.email },
          `${process.env.JWT_SECRET}`,
          {
            expiresIn: "1h",
          }
        );
        return { userId: login.id, token: token, tokenExpiration: 1, cityPortal: login.cityPortal };
      }
       catch (error) {
        throw new Error("Your account has been created, please log in!")
      }
    } catch (err) {
      throw err;
    }
  },
  editProfile: async (args) => {
    const update = {
      bio: args.profileInfo.bio,
      avatar: args.profileInfo.avatar,
      occupation: args.profileInfo.occupation,
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
          password: null,
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
      `${process.env.JWT_SECRET}`,
      {
        expiresIn: "1h",
      }
    );
    return { userId: user.id, token: token, tokenExpiration: 1, cityPortal: user.cityPortal };
  },
};
