var express  =  require("express");
var router   =  express.Router();
var campground = require("../models/campground");
var comment = require("../models/comment");
var middleware=require("../middleware/index.js");

//INDEX route
router.get("/",function(req,res){
		//Get all campgrounds from mongodb
	campground.find({},function(err,allcampgrounds){
		if(err)
			{
				console.log(err);
			}
		else
			{
			res.render("campgrounds/index",{campgrounds:allcampgrounds, currentuser:req.user});	
			}
	})
	//res.render("campgrounds",{campgrounds:campgrounds});
		 });
//CREATE route
router.post("/",middleware.isloggedin,function(req,res)
		{
		var name=req.body.name;
	var image=req.body.image;
	var desc=req.body.description;
	var author={
		id:req.user._id,
		username:req.user.username
	};
	
	var newcamp={name:name,image:image,description:desc,author:author};
	campground.create(newcamp,function(err,newlycreated)
	{
		if(err)
			{
				console.log(err);
			}
		else
			{
			res.redirect("/campgrounds");	
			}
	})
	//Create a new campground to save in mongodb
	})
//NEW route
router.get("/new",middleware.isloggedin,function(req,res)
	   {
	res.render("campgrounds/new");});
//SHOW route-Shows more info of the campground
router.get("/:id",function(req,res)
	{
	campground.findById(req.params.id).populate("comments").exec(function(err,foundcampgrounds)
	{
		if(err || !foundcampgrounds)
			{
				req.flash("error","Campground Not Found");
				res.redirect("back");
			}
		else
			{
				console.log(foundcampgrounds);
				res.render("campgrounds/show",{campground:foundcampgrounds});
			}
	});
});

//Edit campground route
router.get("/:id/edit",middleware.checkcampgroundowner,function(req,res)
		  {
			campground.findById(req.params.id,function(err,foundcamp)
			{
			res.render("campgrounds/edit",{campground:foundcamp});
		});
	});	
//Update campground route
router.put("/:id",middleware.checkcampgroundowner,function(req,res)
		  {
	//find and update campground
	campground.findByIdAndUpdate(req.params.id,req.body.camp,function(err,updatedcamp)
			{
		if(err)
			{
				res.redirect("/");
				console.log(err);
			}
		else
			{
				res.redirect("/campgrounds/" + req.params.id);
			}
	});
});

//Destroy Campground Route
router.delete("/:id",middleware.checkcampgroundowner,function(req,res)
			 {
				campground.findByIdAndRemove(req.params.id,function(err)
	{
					if(err)
{
	res.redirect("/campgrounds");
}
					else
					{
					res.redirect("/campgrounds");	
					}
});
});


//middleware
function isloggedin(req,res,next)
{
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}


module.exports=router;