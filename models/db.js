const mongoose = require("mongoose");
require('dotenv').config()


mongoose.connect(process.env.MONGODB)
const Schema = mongoose.Schema;

const userschema = new Schema({

Username:{type:String,unique:true,required:true},
Name:{type:String,required:true},
Password:{ type:String,required:true}


})
const User = mongoose.model('User',userschema)

const Accountschema = new Schema({

     Userid : { type:mongoose.Schema.Types.ObjectId, ref:'User',required:true},
     Balance : { type: Number, required:true }
})

const Account = mongoose.model('Account',Accountschema)

module.exports={ User,Account }