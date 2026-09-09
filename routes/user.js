const express = require("express");
const bcrypt = require("bcrypt");
const { User, Account } = require("../models/db");
const jwt = require("jsonwebtoken");
const router = express.Router();
require("dotenv").config();
const z = require("zod");
//const middleware = require("../Middleware/Authmiddleware");

router.post("/signupp", Signup);
async function Signup(req, res) {
  const userschmea = z.object({
    Username: z.string().min(3).max(80).email(),
    Name: z.string().min(3).max(20),
    Password: z.string().min(6).max(30),
  });
  const parshedbody = userschmea.safeParse(req.body);
  if (!parshedbody.success) {
    res.json({
      message: "incorrect format",
      error: parshedbody.error,
    });
    return;
  }
  const Username = req.body.Username;
  const Name = req.body.Name;
  const Password = req.body.Password;
  try {
    const hashedpassword = await bcrypt.hash(Password, 5);

    const user = await User.create({
      Username: Username,
      Name: Name,
      Password: hashedpassword,
    });
    if (user) {
      const accountuser = await User.findOne({ Username: Username });
      if (accountuser) {
        await Account.create({
          Userid: accountuser._id,
          Balance: 1000,
        });
      }
    }
  } catch (error) {
    return res.json({
      message: "User alredy present",
    });
  }
  return res.json({
    message: "USer Created Successfully",
  });
}
router.post("/signin", Signin);

async function Signin(req, res) {
  console.log(req.body);
  const Username = req.body.Username;
  const Password = req.body.Password;

  try {
    const user = await User.findOne({
      Username: Username,
    });
    console.log(user);
    if (!user) {
      return res.status(403).json({ message: "user not found" });
    }
    const passwordmatch = await bcrypt.compare(Password, user.Password);
    console.log(Password,user.Password)
    // console.log(user, "user");
    if (passwordmatch) {
      console.log(user._id);
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      console.log(token);
      if (token) {
        return res.json({
          message: "User signin Successfully",
          Userid: user._id,
          token: token,
        });
      }
    } else {
      return res.json({
        message: "Wrond Credentials",
      });
    }
  } catch (error) {
  console.log(error)
  return res.status(500).json({message:"server error",error:error.message})

  }
}
router.get("/get", Getuser);

async function Getuser(req, res) {
  const search = req.query.search;
  const filter = {};
  if (search) {
    filter.Name = { $regex: search, $options: "i" };
  }

  const getuser = await User.find(filter);
  console.log(getuser);
  res.json({
    getuser,
  });
}
module.exports = router;
