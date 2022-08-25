const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//models
const User = require("../../models/user");
const Profile = require("../../models/profile");

const mergeProfile = async (profileId) => {
  try {
    const userProfile = await Profile.findById(profileId)
    return {
      ...userProfile._doc,
      user: userBind.bind(this, userProfile._doc.user)
    }
  } catch (err) {
    throw err;
  }
}

const userBind = async (userId) => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      profile: userProfile.bind(this, user._doc.userProfile),
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
      });
      
      const result = await user.save();
      
      const userInfo = await User.findOne(result);
      
      
      const newProfile = new Profile({
        bio: "Hello my name is Ted",
        user: userInfo
      });
      
      let createdProfile;
      try {
        const profileResult = await newProfile.save();
        createdProfile = await mergeProfile(profileResult)
        console.log("Profile:", createdProfile)
        return createdProfile
      } catch (error) {
        throw err
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
