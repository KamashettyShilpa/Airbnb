const User=require("../models/user")

module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signUp.ejs");
}

module.exports.signup=async(req,res)=>{
    try{
        let {username,email,password}=req.body;
        let newUser=new User({username,email});
        let registeredUser=await User.register(newUser,password);
        console.log(registeredUser);  
        req.login(registeredUser,(err)=>{
            if(err){
                return next();
            }
        req.flash("success","Welcome to Wanderlust!");
        res.redirect("/listings");
        })     
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signUp");
    }
}

module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login=async(req,res)=>{
    req.flash("success","Welcome back to WanderLust!");
    redirectUrl=res.locals.redirectUrl || "/listings";
      res.redirect(redirectUrl);  
    //   console.log(res.locals.reDirectUrl); //req.session.redirectUrl=undefined 
}
module.exports.logOut=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
          return next(err);
        }
        req.flash("success","You successfully logged out!");
        res.redirect("/listings");
    })
}