var express = require("express"),

bodyParser = require("body-parser"),
methodOverride = require("method-override"),
mongoose = require("mongoose");
app = express();

//App config
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));

//create schema
var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {type:Date, default: Date.now}
});

//compile into model
var Blog = mongoose.model("Blog", blogSchema);

//restful routes

//index routes
app.get("/",function(req,res){
  res.redirect("/blogs");
});

app.get("/blogs", function (req,res){
  Blog.find({}, function (err,blogs){
    if (err){
      console.log("ERROR");
    } else {
      res.render("index", {blogs:blogs});
    }
  });
});

//NEW routes
app.get("/blogs/new", function(req,res) {
  res.render("new");
});

//CREATE routes
app.post("/blogs", function(req,res){
  //create blogs
  Blog.create(req.body.blog, function(err, newBlog){
    if (err){
      res.render("new");

    }else {
      //then redirect to the index
      res.redirect("/blogs");
    }
  });
  //redirect to index
});

app.get("/blogs/:id", function (req,res){
  Blog.findById(req.params.id, function(err,foundBlog){
    if(err){
      res.redirect("/blogs")
    } else {
      res.render("show",{blog: foundBlog});
    }
  });
});

//EDIT route
app.get("/blogs/:id/edit", function(req,res){
  Blog.findById(req.params.id, function(err,foundBlog){
    if(err){
      res.redirect("/blogs");
    } else {
      res.render("edit", {blog: foundBlog});
    }
  });
  //res.render("edit");
});

//update
app.put("/blogs/:id/", function (req,res) {
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err,updatedBlog){
    if(err){
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs/"+req.params.id);
    }
  });
});




//DELETE routes
app.delete('/blogs/:id', function(req, res){
  //destroy blogs
  Blog.findByIdAndRemove(req.params.id, function(err){
    if(err){
      res.redirect("/blogs");
    }else {
      res.redirect("/blogs");
    }
  });
  //redirect
});

app.listen(3000, function (){
  console.log("SERVER IS RUNNING");
});
