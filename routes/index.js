const express = require("express");
const router = express.Router();
const { checkLogin } = require("../middlewares");
const uploadCloud = require("../config/cloudinary");
const Post = require("../models/Post");
const Comment = require("../models/Comment");

/* GET home page */
router.get("/", (req, res, next) => {
  Post.find()
    .populate("_creator") // The field "_creator" is going to be replaced by the user with the same id
    .then(posts => {
      Comment.find()
        .populate("_creator")
        .then(comments => {
          // posts is an array of object with 4 properties: content, picPath, _creator, _id
          let newPosts =  posts.map(post => {
            return {
              ...post, // To insert all the properties of the post
              _id: post._id,
              comments: comments.filter(comment => comment._post.toString() === post._id.toString())
            }
          }) 
          // newPosts is an array of object with 5 properties: content, picPath, _creator, _id, comments
          res.render("index", { posts: newPosts});
        })
    })
    .catch(next);
});

router.get("/profile", checkLogin, (req, res, next) => {
  res.render("profile", { user: req.user });
});

router.get("/add-post", checkLogin, (req, res, next) => {
  res.render("add-post");
});

router.post(
  "/add-post",
  checkLogin,
  uploadCloud.single("picture"),
  (req, res, next) => {
    console.log("DEBUG req.body.content", req.body.content); // Comes from <input name="content">
    console.log("DEBUG req.file.secure_url", req.file.secure_url); // Comes from <input type="file" name="picture"> && uploadCloud.single("picture")
    console.log("DEBUG req.user._id", req.user._id); // Defined if connected

    Post.create({
      content: req.body.content,
      picPath: req.file.secure_url,
      _creator: req.user._id
    })
      .then(createdPost => {
        res.redirect("/profile");
      })
      .catch(err => next(err));
    // .catch(next) // Shortcut
  }
);

router.post("/add-comment/:postId", checkLogin, (req,res,next) => {
  console.log("DEBUG req.body.text", req.body.text)
  console.log("DEBUG req.params.postId", req.params.postId)
  console.log("DEBUG req.user._id", req.user._id)

  Comment.create({
    text: req.body.text,
    _post: req.params.postId,
    _creator: req.user._id
  })
    .then(createdComment => {
      res.redirect("/")
    })
    .catch(next)
})

module.exports = router;
