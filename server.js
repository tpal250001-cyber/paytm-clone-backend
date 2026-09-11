const express = require("express")
const jwt = require("jsonwebtoken")
const AuthRoutes = require("./routes/index")
const Cors = require("cors")
require("dotenv").config()

const app = express()
app.use(Cors({ origin: ["https://paytm-clone-frontend-eight.vercel.app/","http://localhost:5173"],
    credentials:true
}))
app.use(express.json())



app.use('/api/auth/v1',AuthRoutes)


app.listen(process.env.PORT)
