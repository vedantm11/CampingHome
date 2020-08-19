var campground=require("../models/campground");
var comment=require("../models/comment");
var middlewareobj={};
middlewareobj.checkcampgroundowner=function(req,res,next)
	{
	if(req.isAuthenticated())
		{
			campground.findById(req.params.id,function(err,foundcamp)
			 {
				if(err || !foundcamp)
					{
					req.flash("error","Campground not found")	
					res.redirect("back");
					}
				else
				{
					if(foundcamp.author.id.equals(req.user._id))
					{
						next();	
					}
					else
					{
					req.flash("error","You don't have permission to do that");	
					res.redirect("back");
					}
		}
			});

	}
	else
		{
			req.flash("error","You need to be logged in");
			res.redirect("back");
		}
}

middlewareobj.checkcommentowner=function(req,res,next)
{
	if(req.isAuthenticated())
		{
			comment.findById(req.params.comment_id,function(err,foundcomment)
			 {
				if(err || !foundcomment)
					{
					res.flash("error","Comment Not Found");	
					res.redirect("back");
					}
				else
				{
					if(foundcomment .author.id.equals(req.user._id))
					{
						next();	
					}
					else
					{
						req.flash("error","You don't have permission to do that");
					res.redirect("back");
					}
		}
			});

	}
	else
		{
			req.flash("error","You need to be Logged In to do that");
			res.redirect("back");
		}
}

middlewareobj.isloggedin=function(req,res,next)
{
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","You need to be logged in to do that");
	res.redirect("/login");
}


	
module.exports=middlewareobj;