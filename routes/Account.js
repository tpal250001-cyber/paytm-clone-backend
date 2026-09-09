
const express = require('express')

const { Middleware } = require('../Middleware/Authmiddleware');
const { Account } = require('../models/db');
//const { ZodMiniDiscriminatedUnion } = require('zod/mini');
const { default: mongoose } = require('mongoose');
//const { setEngine } = require('crypto');
const router = express.Router()
console.log("to")

router.post('/send',Middleware,Useraccount)

async function Useraccount(req,res){
const session = await mongoose.startSession()

session.startTransaction()
const toaccount = req.body.toaccount;
const Balances = req.body.Balances
console.log(Balances)

const userid = req.user._id;
console.log(userid,"userid")  
let accountuser = await Account.findOne({
Userid : userid
}).session(session);
console.log(accountuser,"acount user")
console.log(accountuser.Balance)
if(accountuser?.Balance < Balances){
     await session.abortTransaction();
     return res.status(401).json({message:" balance is not sufficient"})

}

const to = await Account.findOne({Userid:toaccount}).session(session)

if(!to){
    await session.abortTransaction()
return res.status(401).json({message:"this is not found"})


}

   await Account.updateOne({ Userid :userid},{ $inc :{Balance : -Balances}}).session(session)
   await Account.updateOne({Userid :toaccount},{$inc:{Balance:    Balances} } ).session(session)

await session.commitTransaction()
res.json({
    account:accountuser,
    message: "account is reached"
})






}

module.exports = router