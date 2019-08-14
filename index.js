var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var camps = require('./models/campground');
var Comment = require('./models/comment');
var User = require('./models/users');
var seedDB = require('./seeds');
var passport = require('passport');
var LocalStrategy = require('passport-local');

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

seedDB();

//Passport Configuration

app.use(require('express-session')({
    secret:"This time not funny",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
});


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
                res.render("campgrounds/campgrounds",{campgrounds:allCamps});
            }
    });
});

app.get("/campgrounds/new", function (req, res) {
    res.render("campgrounds/new");
});
//Used to show more info about the campground

app.get("/campgrounds/:id",function(req,res)
{
    camps.findById(req.params.id).populate("comments").exec(function(err,foundId){
        if(err)
        {
            console.log("Id Not Found");
            console.log(err);
        }
        else
        {
            res.render("campgrounds/show",{campground:foundId});
        }
    });
    
});



//REST API Convention says to use the same url for both post and get request.
app.post("/campgrounds", function (req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name:name,image:image,description:desc};
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

app.get("/campgrounds/:id/comments/new",isLoggedIn,function(req,res){
    camps.findById(req.params.id,function(err,camp){
        if(err)
        {
            console.log(err);
        }
        else
            {
                res.render("comments/new",{camp:camp});
            }
    })
});

app.post("/campgrounds/:id/comments",isLoggedIn,function(req,res){
    //look up campground with corresponding id
    camps.findById(req.params.id,function(err,camp){
        if(err)
        {
            console.log(err);
            res.redirect('/campgrounds');
        }
        else
        {
            Comment.create(req.body.comment,function(err,comment){
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    camp.comments.push(comment);
                    camp.save();
                    res.redirect('/campgrounds/' + camp.id);
                }
            })
        }
    })
    //create new comments
    //connect it to this campground
    //redirect to show page

});

//Auth Routes

app.get('/register',function(req,res){
    res.render("register");
});

app.post('/register',function(req,res){
    var newUser = new User({username:req.body.username});
    User.register(newUser,req.body.password,function(err,user){
        if(err)
        {
            console.log(err);
           return res.redirect('/register');
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect('/campgrounds');
        })
    });

});

app.get('/login',function(req,res){
    res.render('login');
});


app.post('/login',passport.authenticate("local",{
    successRedirect:'/campgrounds',
    failureRedirect:'/login'
}),function(req,res){});


//Logout Route

app.get('/logout',function(req,res){
    req.logout();
    res.redirect('/campgrounds');
});

app.get("*", function (req, res) {
    res.send("Check the url Correctly\nTry Again");
});

function isLoggedIn(req,res,next)
{
    if(req.isAuthenticated())
    {
        return next();
    }
    else
        {
            res.redirect('/login');
        }
}

app.listen(3000, "localhost", function () {
    console.log("Server Started Successfully");
});