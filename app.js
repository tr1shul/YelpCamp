var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var campgrounds = [
  {name: "Salmon Creek", image: "https://picsum.photos/200/300/?random"},
  {name: "Granite Hill", image: "https://picsum.photos/200/300/?random"},
  {name: "Mountain Goat's Rest", image: "https://picsum.photos/200/300/?random"}
];

app.get("/", function(req, res)
{
  res.render("landing");
});

app.get("/campgrounds", function(req, res)
{
  res.render("campgrounds", {campgrounds: campgrounds});
});

app.post("/campgrounds", function(req, res)
{
  var name = req.body.name;
  var image = req.body.image;
  var newCampround = {name: name, image: image};
  campgrounds.push(newCampround);
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
