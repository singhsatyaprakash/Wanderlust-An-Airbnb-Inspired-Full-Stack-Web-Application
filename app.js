if(process.env.NODE_ENV!="production"){
  require("dotenv").config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
//const Listing = require("./models/listing.js");
//const Review = require("./models/review.js");
const path = require("path");
const methodOverride = require("method-override");
const port=3000;

const ejsMate=require("ejs-mate");
//const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
//const {listingSchema, reviewSchema}=require("./schema.js");

const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

const listingRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");

const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");


//const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl=process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
  //await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);

const store=MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*60*60, //time in seconds
});

store.on("error",()=>{
  console.log("ERROR in MONGO SESSION STORE",err);
});

const sessionOptions={
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized: true,
  cookie:{
    expries:Date.now()+7*24*60*60*1000, // in miliseconds
    maxAge:7*24*60*60*1000,
    httpOnly:true, //to prevent from cross scripting aatacks...
  }
};




app.use(session(sessionOptions)); //midleware 

app.use(flash()); //use before routes because using this with routes

app.use(passport.initialize());
app.use(passport.session()); //to identify user as theys browse from page to page...
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  next();  
});


// app.get("/demouser",async(req,res)=>{
//   let fakeUser=new User({
//     email:"yashrai@gmail.com",
//     username:"yash_rai",
//   });
//   const registeredUser=await User.register(fakeUser,"helloWorld"); //helloworld is password... (user,password,callback)
//   res.send(registeredUser);
// })

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);

// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   });

//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successful testing");
// });




app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"Page not found"));
});
app.use((err,req,res,next)=>{
  let {statusCode=500,message="Something went wrong."}=err;
  res.render("listings/error.ejs",{err});
  //res.status(statusCode).send(message)
  //res.send("Something went wrong.");
});
app.listen(port, () => {
  console.log("server is listening to port 3000");
});