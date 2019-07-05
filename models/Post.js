const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
  content: { type: String, required: true },
  picPath: { type: String, required: true },
  _creator: { type: Schema.Types.ObjectId, required: true, ref: "User" }
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
