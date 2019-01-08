// button starts working
$("#scrapeButton").on("click", function () {
    console.log("scrapeButton")
    $.getJSON('/articles', function (data) {
        for (var i = 0; i <= 9; i++) {
            var Article = data[i];
            addArticle("#articles", Article);
        }
    });
})
// adding articles
function addArticle(insertDiv, article) {
    console.log("addArticle()");
    var articlePanel = $("<div>").attr({ "data-id": article.id })
    var heading = $("<div>").attr({ "class": "panel-heading" })
    var title = $("<h2>").attr({ "class": "panel-title" })
    var link = $("<div>").attr({ "class": "panel-body" })

    link.text(article.link);
    title.text(article.title);
    heading.append(title);
    articlePanel.append(heading);
    articlePanel.append(link);


    $(insertDiv).prepend(articlePanel);
}

$(document).ready(function () {
    $.get("/scrape", function (data) {
        console.log(data);
    })
});