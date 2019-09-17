let express = require("express");
let mongoose = require("mongoose")
let path = require("path");

let axios = require("axios");
let cheerio = require("cheerio");
let db = require("./models");


let PORT = 3000;
let app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "public")));

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

mongoose.connect("mongodb://localhost/mongoNews", { useNewUrlParser: true });

app.get("/scrape", function (req, res) {
    axios.get("https://nypost.com/news/").then(function (response) {
        let $ = cheerio.load(response.data)

        $("li.article").each(function (i, element) {
            let result = {};
            result.title = $(this)
                .find("h3.entry-heading")
                .children("a")
                .text();
            result.link = $(this)
                .find("h3.entry-heading")
                .children("a")
                .attr("href");
            result.body = $(this)
                .find("div.entry-content")
                .text();
            result.image = $(this)
                .find("picture.entry-thumbnail")
                .children("source")
                .attr("data-srcset")
            result.date = Date.now();
            db.Article.find({}, function(err, found) {
                    if (found.title === result.title) {
                        console.log("skipped" + result.title)
                    } else {
                        db.Article.create(result)
                        .then(function (dbArticle) {
                            console.log(dbArticle);
                        })
                        .catch(function (err) {
                            console.log(err);
                        });
                }
            })
        });
        res.send("Scrape Complete")
    });
});

app.get("/", function(req, res) {
    db.Article.find({}).sort({date: 1}).then(function(found) {
            res.render("index", {found: found})
    })
  });

  app.get("/articles", function(req, res) {
    db.Article.find({}, function(err, found) {
      if (err) {
        res.json(err)
      } else {
        res.json(found)
      }
    })
  });

  app.get("/articles/:id", function(req, res) {
    db.Article.findOne({ _id: req.params.id})
      .populate("comments")
      .then(function(foundOne) {
        res.json(foundOne)
      })
      .catch(function(err) {
        res.json(err)
      })
  });
  
  app.post("/articles/:id", function(req, res) {
    db.Comment.create(req.body)
      .then(function(dbComment) {
        return db.Article.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.params.id)}, {$push: { 'comments': [dbComment._id]}}, { "new": true, "upsert": true });
      })
      .then(function(dbArticle) {
        res.json(dbArticle)
      })
      .catch(function(err) {
        res.json(err)
      })
  });



app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});