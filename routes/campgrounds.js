var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

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
      res.render("campgrounds/index", {campgrounds: allCampgrounds, page: "campgrounds"});
    }
  });
});

//CREATE - add new campground to database
router.post("/", middleware.isLoggedIn, function(req, res)
{
  var name = req.body.name;
  var price = req.body.price;
  var image = req.body.image;
  var description = req.body.description;
  var author =
  {
    id: req.user._id,
    username: req.user.username
  };
  var newCampround = {name: name, price: price, image: image, description: description, author: author};
  Campground.create(newCampround, function(err, newlyCreated)
  {
    if(err)
    {
      console.log(err);
    }
    else
    {
      req.flash("success", "Successfully created campground.");
      res.redirect("/campgrounds");
    }
  });
});

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res)
{
  res.render("campgrounds/new");
});

//SHOW - shows more info about one campground
router.get("/:id", function(req, res)
{
  //find the campground
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

//EDIT - form to edit a campground
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res)
{
    Campground.findById(req.params.id, function(err, foundCampground)
    {
      res.render("campgrounds/edit", {campground: foundCampground});
    });
});

//UPDATE - update campground in database
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res)
{
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updateCampground)
  {
    if(err)
    {
      res.redirect("/campgrounds");
    }
    else
    {
      req.flash("success", "Successfully updated campground.");
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

//DESTROY - delete campground from database
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res)
{
  Campground.findByIdAndRemove(req.params.id, function(err)
  {
    if(err)
    {
      res.redirect("/campgrounds");
    }
    else
    {
      req.flash("success", "Successfully deleted campground.");
      res.redirect("/campgrounds");
    }
  });
});

module.exports = router;
