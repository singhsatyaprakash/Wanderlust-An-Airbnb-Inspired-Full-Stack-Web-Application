const express=require("express");
const router=express.Router({mergeParams:true});//params wahi rah jati hai parent route ka for that mergeparams true...
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema, reviewSchema}=require("../schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {validateReview,isLoggedIn, isReviewAuthor}=require("../middleware.js");
const reviewController=require("../controllers/review.js");
//Reviews Post Route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.addReview));
  
//reviews delete route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destoryReview));

module.exports=router;
