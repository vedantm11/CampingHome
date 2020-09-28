var express           =  require("express");
var app               =  express();
var bodyparser        =  require("body-parser");
var mongoose          =  require("mongoose");
var campground        =  require("./models/campground.js");
var seeddb            =  require("./seed");
var comment           =  require("./models/comment.js");
var passport          =  require("passport");
var localstrategy     =  require("passport-local");
var methodoverride    =  require("method-override");
var user              =  require("./models/user");
var commentroutes     =  require("./routes/comments.js");
var campgroundroutes  =  require("./routes/campgrounds.js");
var indexroutes     =  require("./routes/index.js");
var flash  =  require("connect-flash");
mongoose.connect(process.env.DATABASEURL);
//mongoose.connect("mongodb+srv://vedant:vedant11a@campinghome.v4yax.mongodb.net/test?retryWrites=true&w=majority");
app.use(bodyparser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname +"/public"));
app.listen(process.env.PORT || 3000,process.env.IP,function(){console.log("Server has started")});
//seed the database
//seeddb();
//use methodoverride
app.use(methodoverride("_method"));
//flash configuration
app.use(flash());
//Passport Configuration
app.use(require("express-session")
	   ({
		secret:"Hi this is camping webapp",
		resave: false,
		saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());


//middleware to give data of user to every page

app.use(function(req,res,next)
	   {
	res.locals.currentuser=req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
	});

//Schema Setup

/*campground.create({
	name:"lonvala",
   image:"https://www.photosforclass.com/download/pixabay-4363073?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2F52e3d3404a55af14f6da8c7dda793f7f1636dfe2564c704c7c2f7fd39649c65d_1280.png&user=bowl_of_nicole"},
	function(err,campground){
	if(err)
		{
			console.log(err);
		}
	else
		{
			console.log("Newly created campground");
			console.log(campground);
		}
});
campground.create({name:"pawna",image:"https://www.photosforclass.com/download/px_699558",description:"This is a very nic place to visit"},function(err,campground){
	if(err)
		{
			console.log(err);
		}
	else
		{
			console.log("Newly created campground");
			console.log(campground);
		}
	});*/

// requiring routes
app.use(indexroutes);
app.use("/campgrounds",campgroundroutes);
app.use("/campgrounds/:id/comments",commentroutes);

