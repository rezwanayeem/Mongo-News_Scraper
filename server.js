//all Dependencies
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var request = require('request');
var cheerio = require('cheerio');
var express = require('express');
var app = express();
var Article = require("./Models/Article.js");

var PORT = process.env.PORT || 3030;

//body Parser
app.use(bodyParser.urlencoded({ extended: false }));

//Use public directory
app.use(express.static('public'));

//connect to the database 

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scrapeGoose";

mongoose.connect(MONGODB_URI);

//scrape route
app.get("/scrape", function (req, res) {
	var url = "http://www.streetsblog.org/";
	request(url, function (err, response, body) {
		if (err) {
			throw err;
		}
	
		var $ = cheerio.load(body);

	    // scraped entry-title
		$(".entry-title").children().each(function (i, element) {
			var title = $(element).text().trim();
			var link = $(element).attr("href");
            var result = {
				title: title,
				link: link
			};
			//shows result
			Article.find({ link: result.link }, function (err, articleArr) {
				if (articleArr.length) {
					console.log(articleArr)
				}
				else {
					var scrapedArticle = new Article(result);
					scrapedArticle.save(function (err, doc) {
						if (err) {
							console.log(err);
						} else {
							console.log(doc);
						}
					});
				}
			})
		});
		res.send("Scrape complete!")
	});
})

//displays all articles from the Database 
app.get("/articles", function (request, response) {
	Article.find({}, function (err, doc) {
		if (err) {
			console.log(err);
		} else {
			response.json(doc);
		}
	});
});
// start the server

app.listen(PORT, function() {
	console.log("app listening on PORT: " + PORT);
  });