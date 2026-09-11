const jwt = require("jsonwebtoken");
const { User } = require("../models/db");
require('dotenv').config()


 async function Middleware(req,res,next){

    const token = req.headers.token;

  if(!token ||token === null|| token===undefined|| token==undefined){

  return res.json({
   message:"User is Invalid"

  })

  }
try{
  console.log("token accept")
const decodeddata = jwt.verify(token,process.env.JWT_SECRET)
console.log(decodeddata.id)
 if(decodeddata.id){
console.log(req.user,"nothind")
   req.user = await User.findById(decodeddata.id)
   console.log(req.user,"requested user")
   const userid = req.user;
if(!req.user){

    return res.status(401).json({message:"user not found"})

}
  next()
 }
}catch(error){
 console.log(error.message)

 res.status(401).json({message:"token is invalid"})
 return    

}


}

module.exports = {Middleware}