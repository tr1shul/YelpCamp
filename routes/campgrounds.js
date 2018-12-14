var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment")

//INDEX - show all campgrounds
router.get("/", function(req, res)
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
router.post("/", function(req, res)
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
router.get("/new", function(req, res)
{
  res.render("campgrounds/new");
});

//SHOW - shows more info about one campground
router.get("/:id", function(req, res)
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

module.exports = router;
