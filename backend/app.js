require("dotenv").config();
const express= require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.locals._ = lodash;
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect(process.env.MONGO_DB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection err:"));
db.once("open", () => {
  console.log("we are connected!");
});

const postSchema = new mongoose.Schema({
  title: String,
  text: String
});

const Post = mongoose.model("Post", postSchema);

app.get("/", (req, res) =>{
    Post.find({}, function(err, posts) {
      res.render("home", { entry: homeStartingContent, posts: posts });
    });
  });
  
  app.get("/about", (req, res) => {
    res.render("about", { entry: aboutContent });
  });
  
  app.get("/contact", (req, res) => {
    res.render("contact", { entry: contactContent });
  });
  
  app.get("/compose", (req, res) => {
    res.render("compose");
  });
  
  app.get("/posts/:id", (req, res) => {
    Post.findById({ _id: req.params.id }, function(err, post) {
      res.render("post", { post: post });
    });
  });
  
  app.post("/compose", (req, res) => {
    const newPost = new Post({
      title: req.body.publishTitle,
      text: req.body.publishText
    });
  
    newPost.save((err) => {
      if (!err) {
        res.redirect("/");
      }
    });
  });
  
  app.listen(process.env.PORT || 3000, () => {
    console.log("Server started");
  });