var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");

mongoose.connect('mongodb://localhost:27017/yelp_camp', { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//SCHEMA SETUP
var campgroundSchema = new mongoose.Schema(
  {
    name: String,
    image: String,
    description: String
  });

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
//   {
//     name: "Granite Hill",
//     image: "https://source.unsplash.com/random",
//     description: "This is a huge granite, no bathrooms. No water, beautiful granite!"
//   },
//   function(err, campground)
//   {
//     if(err)
//     {
//       console.log(err);
//     }
//     else
//     {
//       console.log("Newly Created Campground");
//       console.log(campground);
//     }
//   });

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
      res.render("index", {campgrounds: allCampgrounds});
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
  res.render("new");
});

//SHOW - shows more info about one campground
app.get("/campgrounds/:id", function(req, res)
{
  //find the campground with provided
  Campground.findById(req.params.id, function(err, foundCampground)
  {
    if(err)
    {
      console.log(err);
    }
    else
    {
      res.render("show", {campground: foundCampground});
    }
  });
});

app.listen(8080, 'localhost', function()
{
  console.log("YelpCamp Server has started!");
});
