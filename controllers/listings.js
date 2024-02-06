const Listing=require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index=async (req,res)=>{
    let allListings=await Listing.find();
    res.render("listings/index.ejs",{allListings});
 }

module.exports.renderCategoryListingsForm=async(req,res)=>{
    let category=req.params.category;
    console.log(category);
    let allListings=await Listing.find({category: category});
    // console.log(allListings);
    res.render("listings/category.ejs",{allListings});
}

module.exports.rendercountryListings=async (req,res)=>{
    let {country}=req.body;
    console.log(country);
    await Listing.collection.createIndex({ country: "text"});
    let allListings=await Listing.find({ "$text": { "$search": country } });
    // console.log(allListings);
    res.render("listings/category.ejs",{allListings});
}
 module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id).populate({path:"review",populate :{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for doesnot exist");
        res.redirect("/listings");
    }else{
        res.render("listings/show.ejs",{listing});
    }
}

module.exports.createListing=async (req,res,next)=>{
 
    // let {title,description,image,price,location,country}=req.body;
       //  let newListing=req.body.listing;
       //  console.log(newListing);
       //  new Listing(listing);       //creating new instance
       // if(!req.body.listing){
       //     throw new ExpressError(400,"Send a valid data for listing"); //400 bad request-user sent bad request by not sending data in req body
       // }
      let response=await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send();


       let url=req.file.path;
       let filename=req.file.filename;
       let newListing=new Listing(req.body.listing); 
       //will get error if user sent req to /listings without  data in req body
       newListing.owner=req.user._id; 
       newListing.image={url,filename};
       newListing.geometry=response.body.features[0].geometry;
    //    console.log(newListing.image.url,"===",newListing.image.filename);
       let listing=await newListing.save();
    //    console.log(listing);
       req.flash("success","New listing created");
       res.redirect("/listings");
      
   }

   module.exports.renderEditForm=async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for doesnot exist");
        res.redirect("/listings");
    }
    console.log(listing.image.url);
    let originalImgUrl=listing.image.url;
    originalImgUrl=originalImgUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{listing,originalImgUrl});
  
}

module.exports.updateListing=async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    
    if(typeof req.file !== "undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
        
    }
    
    req.flash("success","listing is updated");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing=async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findByIdAndDelete(id);
    console.log(listing); 
    console.log("deleted listing");
    req.flash("success","listing is deleted");
    res.redirect("/listings");
  }