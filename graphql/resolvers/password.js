const bcrypt = require("bcryptjs");

//models
const User = require("../../models/user");

module.exports = {
    editPassword: async (args, req) => {
        try {
            const hashedOldPassword= await bcrypt.hash(args.oldPassword);
            const hashedNewPassword=await bcrypt.hash(args.newPassword);
            const user = await User.findById(args.userId);
            
            if (!user) {
                throw new Error("User does not exit")
            }
            const isEqual = await bcrypt.compare(req.password, args.oldPassword);
            if (!isEqual) {
                throw new Error("Password is incorrect!");
            }
            try{
                const updatePassword= await User.findOneAndUpdate(args.userId,hashedNewPassword);
                if(!updatePassword){
                    throw new Error("Password cannot be updated")
                }
            }
            catch(err){
                throw err;
            }
            

        }
        catch (err) {
            throw err
        }
    }
}
