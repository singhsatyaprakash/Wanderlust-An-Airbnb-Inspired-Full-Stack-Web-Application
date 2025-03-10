const User=require("../models/user");

module.exports.renderSignUP=(req,res)=>{
    // res.send("form");
    res.render("./users/signup.ejs");
};

module.exports.signUp=async(req,res)=>{
    try{
        let {username,email,password}=req.body;
        const newUser=new User({email,username});
        const registeredUser=await User.register(newUser,password); //saving
        //console.log(registeredUser);
        //login automatically on signup...
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }  
            req.flash("success","Welcome to Wanderlust.");
            res.redirect("/listings");
        });
    }catch(err){
        //console.log(err);
        req.flash("error",err.message);
        res.redirect("/signup");
    }
};

module.exports.renderLogin=(req,res)=>{
    res.render("./users/login.ejs");
};

module.exports.login=async(req,res)=>{
    try{
       req.flash("success","Welcome Back to WanderLust.");
       let redirectUrl=res.locals.redirectUrl || "/listings";
       res.redirect(redirectUrl);
    }
    catch(err){
        req.flash("error","Something went wrong.");
        res.redirect("/login");
    }
};