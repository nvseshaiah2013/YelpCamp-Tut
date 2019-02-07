var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

//connecting to yelpcamp db

mongoose.connect('mongodb://localhost/yelp_camp',{useNewUrlParser:true});

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));

app.use('/', express.static(__dirname + '/www')); // redirect root
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));


//Setting Up Schema for Campgrounds

var campSchema = new mongoose.Schema({name:String,image:String});
//Creating Model for Schema
var camps = new mongoose.model("Camp",campSchema);

app.get("/", function (req, res) {
    res.render("landing");
});

app.get("/campgrounds", function (req, res) {
    camps.find({},function(err,allCamps){
            if(err)
            {
                console.log("error caught!");
                console.log(err);
            }
            else
            {
                res.render("campgrounds",{campgrounds:allCamps});
            }
    });
});

app.get("/campgrounds/new", function (req, res) {
    res.render("new");
});

//REST API Convention says to use the same url for both post and get request.
app.post("/campgrounds", function (req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name:name,image:image};
    //Adding campground to DB
    camps.create(newCampground,function(err,camp){
        if(err)
        {
            console.log("Error Occured!");
            console.log(err);
        }
        else
        {
            console.log("added Campground");
            console.log(camp);
        }
    });
    res.redirect("/campgrounds");
});

app.get("*", function (req, res) {
    res.send("Check the url Correctly\nTry Again");
});

app.listen(3000, "localhost", function () {
    console.log("Server Started Successfully");
});