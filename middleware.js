const Listing=require("./models/listing");
const Review=require("./models/review");
const { listingSchema } = require("./schema"); 
const { reviewSchema } = require("./schema");
const ExpressError = require("./utils/ExpressError"); 


//midddle for authentication that user is logged in before any any changes to server or database...
module.exports.isLoggedIn=(req,res,next)=>{
    //console.log(req.user);
    //console.log(req.path,"..",req.originalUrl);
    if(!req.isAuthenticated()){
        //redirectUrl save
        req.session.redirectUrl=req.originalUrl;//now by session every page have url every middle ware where have access to that url.. 
        req.flash("error","You must be logged in to create listings!");
        return res.redirect("/login");
    }
    next();
};

module.exports.savedRedirectUrl=(req,res,next)=>{
  if(req.session.redirectUrl){//if redirect url is present
    res.locals.redirectUrl=req.session.redirectUrl;
  }
  next();
}

module.exports.isOwner=async (req,res,next)=>{
  const { id } = req.params;
  let listing = await Listing.findById(id);
  if(!listing.owner.equals(res.locals.currUser._id)){
    req.flash("error","You are not the owner of listing.");
    return res.redirect(`/listings/${id}`);
  }
  next();
}

module.exports.validateListing=(req,res,next)=>{
  console.log(req.body.listing);//why is showing us=ndefined
  const {error}= listingSchema.validate(req.body);
  if(error){
    let errMsg=error.details.map((el)=>el.message).join(",");
    throw (new ExpressError(404,errMsg));
  }else{
    next();
  }
}; 

module.exports.validateReview=(req,res,next)=>{
  const {error}=reviewSchema.validate(req.body);
  //console.log(result);
  if(error){
    let errMsg=error.details.map((el)=>el.message).join(",");
    throw (new ExpressError(404,errMsg));
  }else{
    next();
  }
};

module.exports.isReviewAuthor=async (req,res,next)=>{
  const { id,reviewId } = req.params;
  let review= await Review.findById(reviewId);
  if(!review.author.equals(res.locals.currUser._id)){
    req.flash("error","You are not the author of this Review.");
    return res.redirect(`/listings/${id}`);
  }
  next();
}