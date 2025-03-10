const express=require("express");
const router=express.Router({mergeParams:true});//params wahi rah jati hai parent route ka for that mergeparams true...
const User=require("../models/user.js");
const passport=require("passport");
const {savedRedirectUrl}=require("../middleware.js");
const wrapAsync = require("../utils/wrapAsync.js");
const userController=require("../controllers/user.js");

router.route("/signup")
    .get(userController.renderSignUP)
    .post(wrapAsync(userController.signUp));


router.route("/login")
    .get(userController.renderLogin)
    .post(savedRedirectUrl,
        passport.authenticate("local",
            {failureRedirect:"/login",
                failureFlash:true
            }),
            //after authenication passport by deafult reset the session.So, to store the redirectUrl we have to use req.local to store..
            wrapAsync(userController.login));

router.get("/logout",(req,res,next)=>{
    //logout to terminate the session..
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","You are logged out.");
        res.redirect("/listings");
    })
});

module.exports=router;