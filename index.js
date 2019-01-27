var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));

app.use('/', express.static(__dirname + '/www')); // redirect root
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));

 var campgrounds = [{
         name: "Patnitop",
         image: "http://gamingtrend.com/wp-content/uploads/2011/06/new-assassins-creed-revelations-details-revealed-240x180.jpg"
     },
     {
         name: "Nathatop",
         image: "http://wallpoper.com/images/00/37/61/87/agent-orangehere_00376187_thumb.png"
     },
     {
         name: "Dalhousie",
         image: "http://wallpoper.com/images/00/37/61/87/agent-orangehere_00376187_thumb.png"
     },
     {
         name: "Patnitop",
         image: "http://gamingtrend.com/wp-content/uploads/2011/06/new-assassins-creed-revelations-details-revealed-240x180.jpg"
     }, {
         name: "Nathatop",
         image: "http://forum.treasurewars.net/data/avatars/l/29/29402.jpg?1462773599"
     }, {
         name: "Dalhousie",
         image: "http://wallpoper.com/images/00/37/61/87/agent-orangehere_00376187_thumb.png"
     },
     {
         name: "Patnitop",
         image: "http://gamingtrend.com/wp-content/uploads/2011/06/new-assassins-creed-revelations-details-revealed-240x180.jpg"
     }, {
         name: "Nathatop",
         image: "http://forum.treasurewars.net/data/avatars/l/29/29402.jpg?1462773599"
     }, {
         name: "Dalhousie",
         image: "http://wallpoper.com/images/00/37/61/87/agent-orangehere_00376187_thumb.png"
     },
     {
         name: "Patnitop",
         image: "http://gamingtrend.com/wp-content/uploads/2011/06/new-assassins-creed-revelations-details-revealed-240x180.jpg"
     }, {
         name: "Nathatop",
         image: "http://forum.treasurewars.net/data/avatars/l/29/29402.jpg?1462773599"
     }, {
         name: "Dalhousie",
         image: "http://wallpoper.com/images/00/37/61/87/agent-orangehere_00376187_thumb.png"
     }

 ];

app.get("/", function (req, res) {
    res.render("landing");
});

app.get("/campgrounds", function (req, res) {
   
    res.render("campgrounds", {
        campgrounds: campgrounds
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
    campgrounds.push(newCampground);
    res.redirect("/campgrounds");
});

app.get("*", function (req, res) {
    res.send("Check the url Correctly\nTry Again");
});

app.listen(3000, "localhost", function () {
    console.log("Server Started Successfully");
});