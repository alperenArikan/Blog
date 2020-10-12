//jshint esversion:8

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const admin = require("firebase-admin");
const { firestore } = require("firebase-admin");
var serviceAccount = require("./serviceAccount.json");
require("dotenv").config();


const firebaseConfig = {
  credential: admin.credential.cert(serviceAccount),
  apiKey: process.env.MY_API_KEY,
  authDomain: process.env.MY_AUTH_DOMAIN,
  databaseURL: process.MY_DATABASE_URL,
  projectId: process.MY_PROJECT_ID,
  storageBucket: process.MY_STORAGE_BUCKET,
  messagingSenderId: process.env.MY_SENDER_ID,
  appId: process.env.MY_APP_ID,
};
admin.initializeApp(firebaseConfig);
const db = admin.firestore();
const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

var posts = [];
async function getData() {
  posts = [];
  const snapshot = await db.collection("posts").get();
  snapshot.forEach((doc) => {
    var docData = doc.data();
    posts.unshift(docData);
  });
  return posts;
}

app.get("/", (req, res) => {
  getData().then((x) => {
    res.render("home", {
      homeStartingContentVari: homeStartingContent,
      postsVari: posts,
    });
  });
});
app.get("/about", (req, res, next) => {
  res.render("about", { aboutContentVari: aboutContent });
});
app.get("/contact", (req, res, next) => {
  res.render("contact", { contactContactVari: contactContent });
});
app.get(`${process.env.MY_POST_SECTION}`, (req, res, next) => {
  res.render("compose");
});
app.post("/", (req, res, next) => {
  const d = String(Date.now());
  const post = {
    title: req.body.titleContent,
    post: req.body.postContent,
  };
  const docRef = db.collection("posts").doc(d);

  docRef
    .set(post)
    .then((response) => {})
    .catch((err) => {
      console.log(err);
    });

  res.redirect("/");
});
app.get("/posts/:title", (req, res, next) => {
  const requested = _.kebabCase(_.lowerCase(req.params.title));
  posts.forEach(function (post) {
    if (_.kebabCase(_.lowerCase(post.title)) == requested) {
      res.render("post", {
        titleVari: post.title,
        postVari: post.post,
      });
    }
  });
});

app.listen(process.env.PORT || 3000, function () {
  console.log("server started");
});
