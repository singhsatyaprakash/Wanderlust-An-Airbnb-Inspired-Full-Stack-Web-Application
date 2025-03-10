const Listing=require("../models/listing");

module.exports.index=async (req, res) => {
    const allListing = await Listing.find({});
    //console.log({allListing});
    res.render("listings/index.ejs", { allListing });
};

module.exports.RenderNewForm=(req, res) => {
    res.render("listings/new.ejs");
};

module.exports.ShowListing=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({
      path:"reviews", 
      populate:{
        path:"author",
      },
    })
    .populate("owner");
    // if (!listing.price) {
    //   listing.price = 0; // Default to 0 or any other value
    // }
    if(!listing){
      req.flash("error","Listing you requested for does not exist!");
      res.redirect("/listings");
    }
    //console.log(listing.owner);
    res.render("listings/show.ejs", { listing });
};

module.exports.CreateListing=async (req, res,next) => {
  // let response=await geocodingClient
  // .forwardGecode({
  //   query:req.body.listing.location,
  //   limit:1,
  // })
  // .send();
  let url=req.file.path;
  let filename=req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner=req.user._id;
  newListing.image={url,filename};
  //newListing.geometry=response.body.features[0].geomertry;

  let savedListing=await newListing.save();
  //console.log(savedListing);
  req.flash("success","New list added succesfully.");
  res.redirect("/listings");
  next();
};

module.exports.RenderEditForm=async (req, res) => {
    let { id } = req.params;
    const listing  = await Listing.findById(id);
    if(!listing){
      req.flash("error","Listing you requested for does not exist!");
      res.redirect("/listings");
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl=listing.image.url.replace("/upload","/upload/h_300,w_250/e_blur:300");
    res.render("listings/edit.ejs", {listing,originalImageUrl});
};

module.exports.UpdateListing=async(req, res) => {
  const { id } = req.params;
  //const { title, description, image, price, country, location } = req.body.listing;
  let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
  if(typeof req.file!=="undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
  }
  await listing.save();

  req.flash("success","List updated succesfully.");
  res.redirect(`/listings/${id}`);
};

module.exports.DestoryListing=async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","List deleted succesfully.");
    res.redirect("/listings");
};