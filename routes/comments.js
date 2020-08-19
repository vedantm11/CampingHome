var express  =  require("express");
var router   =  express.Router({mergeParams: true});
var campground = require("../models/campground");
var comment = require("../models/comment");
var middleware=require("../middleware/index.js");
//comments new
router.get("/new",middleware.isloggedin,function(req,res)
	   {
	//find the campground by id
campground.findById(req.params.id,function(err,campground)
	 {
		if(err)
			{
				console.log(err);
			}
		else
			{
				res.render("comments/new",{campground:campground});
			}
		
	});
//comments create
router.post("/",middleware.isloggedin,function(req,res)
			{
		//search campground using id
		campground.findById(req.params.id,function(err,foundcampground)
	 {
		if(err)
			{
				console.log(err);
			res.redirect("/campgrounds");
			}
		else
			{
			//create new comments
		comment.create(req.body.comment,function(err,comment)
		{
			if(err)
				{
					console.log(err);
				}
			else
				{
				//add username and id to comment
comment.author.id=req.user._id;
comment.author.username=req.user.username;
comment.save();
					//link comment to campground
					foundcampground.comments.push(comment);		
					foundcampground.save();		
		     	//redirect to show page
	req.flash("succes","Successfully added Comment");				res.redirect('/campgrounds/' +foundcampground._id);
				}
		});
		    			
			}
		
	})
	})
	
});

//Edit the comment
router.get("/:comment_id/edit",middleware.checkcommentowner,function(req,res)
	{
	campground.findById(req.params.id,function(err,foundcamp)
	{
		if(err || !foundcamp)
			{
				res.flash("error","No Campground Found");
			return res.redirect("back");	
			}
		comment.findById(req.params.comment_id,function(err,foundcomment)
					{
		if(err)
			{
				res.redirect("back");
			}
		else
			{
				res.render("comments/edit",{campground_id:req.params.id,comment:foundcomment});
			}
	});
	});
	});
	

//comments update route
router.put("/:comment_id",middleware.checkcommentowner,function(req,res)
		  {
	comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedcomment)
			{
		if(err)
			{
				res.redirect("back");
				
			}
		else
			{
				res.redirect("/campgrounds/" + req.params.id);
			}
	});
});

//Delete comment
router.delete("/:comment_id",middleware.checkcommentowner,function(req,res)
	{
	comment.findByIdAndRemove(req.params.comment_id,function(err)
	{
		if(err)
			{
				res.redirect("back");
			}
		else
			{
			req.flash("success","Comment deleted");		res.redirect("/campgrounds/"+req.params.id);
			}
	});
	
});

		


module.exports=router;