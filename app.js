var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    seedDB = require("./seeds");

mongoose.connect('mongodb://localhost:27017/yelp_camp', { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
//seedDB();

app.get("/", function(req, res)
{
  res.render("landing");
});

//INDEX - show all campgrounds
app.get("/campgrounds", function(req, res)
{
  Campground.find({}, function(err, allCampgrounds)
  {
    if(err)
    {
      console.log(err);
    }
    else
    {
      res.render("campgrounds/index", {campgrounds: allCampgrounds});
    }
  });
});

//CREATE - add new campground to database
app.post("/campgrounds", function(req, res)
{
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;
  var newCampround = {name: name, image: image, description: description};
  Campground.create(newCampround, function(err, newlyCreated)
  {
    if(err)
    {
      console.log(err);
    }
    else
    {
      res.redirect("/campgrounds");
    }
  });
});

//NEW - show form to create new campground
app.get("/campgrounds/new", function(req, res)
{
  res.render("campgrounds/new");
});

//SHOW - shows more info about one campground
app.get("/campgrounds/:id", function(req, res)
{
  //find the campground with provided
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground)
  {
    if(err)
    {
      console.log(err);
    }
    else
    {
      console.log(foundCampground);
      res.render("campgrounds/show", {campground: foundCampground});
    }
  })
});

//==========================================
//COMMENTS ROUTES
//==========================================

app.get("/campgrounds/:id/comments/new", function(req, res)
{
  Campground.findById(req.params.id, function(err, campground)
  {
    if(err)
    {
      console.log(err);
    }
    else
    {
      res.render("comments/new", {campground: campground});
    }
  });
});

app.post("/campgrounds/:id/comments", function(req, res)
{
  Campground.findById(req.params.id, function(err, campground)
  {
    if(err)
    {
      console.log(err);
      redirect("/campgrounds");
    }
    else
    {
      Comment.create(req.body.comment, function(err, comment)
      {
        if(err)
        {
          console.log(err);
        }
        else
        {
          campground.comments.push(comment);
          campground.save();
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  });
});

app.listen(8080, 'localhost', function()
{
  console.log("YelpCamp Server has started!");
});
