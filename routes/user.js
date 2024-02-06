const express=require("express");
const { register } = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const router=express.Router();
const User=require("../models/user");
const passport = require("passport");
const {isLoggedIn}=require("../middleware.js");
const { saveRedirectUrl }=require("../middleware.js");
const userController=require("../controllers/users.js");

router.route("/signUp")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup));

router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl,
passport.authenticate("local",{ failureRedirect:"/login" ,failureFlash:true}),userController.login);


router.get("/logout",userController.logOut);

module.exports=router;