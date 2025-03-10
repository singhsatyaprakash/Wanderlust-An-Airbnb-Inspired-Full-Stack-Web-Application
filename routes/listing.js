const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema, reviewSchema}=require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const listingController=require("../Controllers/listing.js");
const multer=require("multer");
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});


router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingController.CreateListing));
//New Route
router.get("/new",isLoggedIn,listingController.RenderNewForm);

router.route("/:id")
    .get(wrapAsync(listingController.ShowListing))
    .put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing, wrapAsync(listingController.UpdateListing))
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.DestoryListing));
    
//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.RenderEditForm));

module.exports=router;