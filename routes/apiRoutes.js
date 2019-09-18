module.exports = function(app) {
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
            result.date = moment().format();
            db.Article.create(result)
              .then(function (dbArticle) {
                console.log(dbArticle);
              })
              .catch(function (err) {
                console.log(err);
              });
          })
        });
        res.send("Scrape Complete")
      });
      
      app.get("/", function (req, res) {
        db.Article.find({}).sort({ date: -1 }).then(function (found) {
          res.render("index", { found: found })
        })
      });
      
      app.get("/articles", function (req, res) {
        db.Article.find({}, function (err, found) {
          if (err) {
            res.json(err)
          } else {
            res.render("index", { found: found })
          }
        })
      });
      
      app.get("/articles/:id", function (req, res) {
        db.Article.findOne({ _id: req.params.id })
          .populate("comments")
          .then(function (foundOne) {
            res.json(foundOne)
          })
          .catch(function (err) {
            res.json(err)
          })
      });
      
      app.post("/articles/:id", function (req, res) {
        db.Comment.create(req.body)
          .then(function (dbComment) {
            return db.Article.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.params.id) }, { $push: { 'comments': [dbComment._id] } }, { "new": true, "upsert": true });
          })
          .then(function (dbArticle) {
            res.json(dbArticle)
          })
          .catch(function (err) {
            res.json(err)
          })
      });
      
      app.delete("/articles/:id", function (req, res) {
        db.Comment.findByIdAndRemove(req.params.id, function (err, removed) {
          if (err) {
            console.log(err);
          } else {
            console.log(removed);
          }
        })
      });
}