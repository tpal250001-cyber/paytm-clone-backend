const express = require("express");

const userRouter = require("./user");
const Accountuser = require("./Account")
const Router = express.Router()
console.log('router')
Router.use('/user',userRouter)
Router.use('/account',Accountuser)

module.exports = Router