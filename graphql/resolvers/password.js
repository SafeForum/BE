const bcrypt = require("bcryptjs");

//models
const User = require("../../models/user");
const password = require("../../models/password")

module.exports = {
    editPassword: async (args, req) => {
        try {
           
            const hashedOldPassword = await bcrypt.hash(args.oldPassword,12);
            console.log("harshing",hashedOldPassword);
            const hashedNewPassword = await bcrypt.hash(args.password,12);

            const user = await User.findById(args.userId);
            console.log("user Id",args.userId);
          //  console.log("user details",user)

            if (!user) {
                throw new Error("User does not exit")
            }
            const update={
                password:hashedNewPassword
            }
            const isEqual = await bcrypt.compare(args.oldPassword, user.password);
            console.log("isEqual",isEqual)
            if (!isEqual) {
                throw new Error("Password is incorrect!");
            }
            try {
                const updatePassword = await User.findOneAndUpdate({_id:user}, update,{new:true});
                console.log("updatedpassword",updatePassword)

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
            console.log("error")
            throw err
        }
    }
}
