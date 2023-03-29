const mongoose=require('mangoose');
const user = require('./user');

const Schema=mongoose.schema;

const passwordSchema= new Schema({
    password:{
        type:String,
        required:true
    },
    userId:{
        type:Schema.types.ObjectId,
        ref:'user'
    }
});

module.exports=mongoose.model('password',passwordSchema)