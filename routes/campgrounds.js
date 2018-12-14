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
router.post("/", isLoggedIn, function(req, res)
{
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;
  var author =
  {
    id: req.user._id,
    username: req.user.username
  };
  var newCampround = {name: name, image: image, description: description, author: author};
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
router.get("/new", isLoggedIn, function(req, res)
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

//EDIT - form to edit a campground
router.get("/:id/edit", checkCampgroundOwnership, function(req, res)
{
    Campground.findById(req.params.id, function(err, foundCampground)
    {
      res.render("campground/edit", {campground: foundCampground});
    });
});

//UPDATE - update campground in database
router.put("/:id",checkCampgroundOwnership, function(req, res)
{
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updateCampground)
  {
    if(err)
    {
      res.redirect("/campgrounds");
    }
    else
    {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

//DESTROY - delete campground from database
router.delete("/:id", checkCampgroundOwnership, function(req, res)
{
  Campground.findByIdAndRemove(req.params.id, function(err)
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
function isLoggedIn(req, res, next)
{
  if(req.isAuthenticated())
  {
    return next();
  }
  res.redirect("/login");
}

function checkCampgroundOwnership(req, res, next)
{
  if(req.isAuthenticated())
  {
    Campground.findById(req.params.id, function(err, foundCampground)
    {
      if(err)
      {
        res.redirect("back");
      }
      else
      {
        //does user own the campground?
        if(foundCampground.author.id.equals(req.user._id))
        {
          next();
        }
        else
        {
          res.redirect("back");
        }
      }
    });
  }
  else
  {
    res.redirect("back");
  }
}

module.exports = router;
