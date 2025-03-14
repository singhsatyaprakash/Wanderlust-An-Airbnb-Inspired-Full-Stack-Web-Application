const Review=require("../models/review");
const Listing=require("../models/listing");

module.exports.addReview=async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
    await newReview.save(); 
    await listing.save();
    // console.log("New review saved");
    req.flash("success","Thanks for review.");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.destoryReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted.");
    res.redirect(`/listings/${id}`)
};