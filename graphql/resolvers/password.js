const bcrypt = require("bcryptjs");
//models
const User = require("../../models/user");
const password = require("../../models/password")

module.exports = {
    editPassword: async (args, req) => {
        try {   
            const hashedNewPassword = await bcrypt.hash(args.password,12);
            const user = await User.findById(args.userId);
            if (!user) {
                throw new Error("User does not exit")
            }
            const update={
                password:hashedNewPassword
            }
            const isEqual = await bcrypt.compare(args.oldPassword, user.password);
            if (!isEqual) {
                throw new Error("Password is incorrect!");
            }
            try {
                const updatePassword = await User.findOneAndUpdate({_id:user}, update,{new:true});
                if (!updatePassword) {
                    throw new Error("Password cannot be updated")
                }
                return user
            }
            catch (err) {
                throw err;
            }
        }
        catch (err) {
            throw err
        }
    }
}
