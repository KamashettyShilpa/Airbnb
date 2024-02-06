const express=require("express");
const router=express.Router();
const Listing=require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controllers/listings.js");
const multer  = require('multer');
const {storage}=require("../cloudinary.config.js");
const upload = multer({ storage });

router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(listingController.createListing));
// In this case, after the user is confirmed to be logged in (isLoggedIn), the image file from the form field listing[image] is processed and uploaded (upload.single("listing[image]")). After the image is uploaded, the listing is validated (validateListing). If all these steps are successful, the listing is created (listingController.createListing).

//=============================================NEW ROUTE

router.get("/new",isLoggedIn,listingController.renderNewForm);
router.get("/categoryListings/:category",listingController.renderCategoryListingsForm);
router.post("/countryListings",listingController.rendercountryListings);
router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));

//==============================================EDIT ROUTE

router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

module.exports=router;
