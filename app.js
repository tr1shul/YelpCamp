var express = require("express");
var app = express();

app.set("view engine", "ejs");

app.get("/", function(req, res)
{
  res.render("landing");
});

app.get("/campgrounds", function(req, res)
{
  var campgrounds = [
    {name: "Salmon Creek", image: "https://www.pexels.com/photo/six-camping-tents-in-forest-699558/"},
    {name: "Granite Hill", image: "https://www.pexels.com/photo/adventure-alps-camp-camping-618848/"},
    {name: "Mountain Goat's Rest", image: "https://www.pexels.com/photo/photo-of-blue-and-yellow-lighted-dome-tent-surrounded-by-plants-during-night-time-712067/"}
  ];

  res.render("campgrounds");
});

app.listen(8080, 'localhost', function()
{
  console.log("YelpCamp Server has started!");
});
