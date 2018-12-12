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
    image: String
  }
);

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
//   {
//     name: "Granite Hill",
//     image: "https://source.unsplash.com/random"
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
      res.render("campgrounds", {campgrounds: allCampgrounds});
    }
  })
});

app.post("/campgrounds", function(req, res)
{
  var name = req.body.name;
  var image = req.body.image;
  var newCampround = {name: name, image: image};
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
  res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res)
{
  res.render("new");
});

app.listen(8080, 'localhost', function()
{
  console.log("YelpCamp Server has started!");
});
