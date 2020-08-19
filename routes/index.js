var express=require("express");
var router   =  express.Router();
var passport=require("passport");
var user=require("../models/user");

//index route
router.get("/",function(req,res){
		 res.render("landing");
		 });

//show register forms

router.get("/register",function(req,res)
	   {
		res.render("register");
});

//handle signup
router.post("/register",function(req,res)
		{
		var newuser=new user({username:req.body.username});
		user.register(newuser,req.body.password,function(err,User)
		{
			if(err)
				{
				return res.render("register", {"error": err.message});
				}
			passport.authenticate("local")(req,res,function(){
		req.flash("success","Welcome to CampingHome "+newuser.username);
				
				res.redirect("/campgrounds");
			});
			
		});
	
});

router.get("/login",(req,res)=>
	   {
		res.render("login");	
});

//login login with middleware

router.post("/login",passport.authenticate("local",
	{
		successRedirect:"/campgrounds",
		failureRedirect:"/login"
    }),function(req,res)
{});
// logout route
router.get("/logout",(req,res)=>
	   {
		req.logout();
		res.redirect("/campgrounds");
});

//middleware for checking if user is logged in

module.exports=router;