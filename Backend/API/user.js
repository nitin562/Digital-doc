const express=require("express")
const { postUser, getUser, logout } = require("../Controller/user")
const {check,query}=require("express-validator")
const router=express.Router()

//signup
router.post("/signup",[check("name","Name is empty").isLength({min:1}),check("email","Invalid email").isEmail(),check("password","Password must be of 6 length").isLength({min:6})],postUser)

router.get("/login",[query("email","Invalid email").isEmail(),query("password","Password must be of 6 length").isLength({min:6})],getUser)
router.get("/logout",logout)
module.exports=router