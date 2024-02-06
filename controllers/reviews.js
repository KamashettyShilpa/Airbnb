const Listing=require("../models/listing");
const Review=require("../models/review");

module.exports.createReview=async (req,res,next)=>{
    console.log(req.params.id);
        let listing=await Listing.findById(req.params.id);
        let newReview=new Review(req.body.review);
        newReview.author=req.user._id;
        console.log(newReview);
        listing.review.push(newReview);
        await newReview.save();
        await listing.save();
        // res.send("review was saved");
        req.flash("success","New Review is created");
        res.redirect(`/listings/${listing.id}`);
}

module.exports.destroyReview=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{review:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review is deleted");
     res.redirect(`/listings/${id}`);
}