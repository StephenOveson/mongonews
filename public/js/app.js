API = {
    getScrape: () => {
        return $.ajax({
            url: "scrape",
            method: "GET"
        })
    },
    getArticle: () => {
        return $.ajax({
            url: "articles",
            method: "GET"
        })
    },
    getComment: id => {
        return $.ajax({
            url: "articles/" + id,
            method: "GET"
        })
    },
    saveComment: (id, name, body) => {
        return $.ajax({
            url: "articles/" + id,
            method: "POST",
            data: {
                name: name,
                body: body
            }
        })
    },
    deleteComment: id => {
        return $.ajax({
            url: "articles/" + id,
            method: "DELETE"
        })
    }
};

// get new articles and put them on page
API.getScrape().then(function() {
    API.getArticle();
});

$(document).on("click", "#newComment", function() {
    let id = $(this).data("id")
    let commentGet = $("#commentGet")
    let commentForm = $("#commentForm")

    // get comments from article and create a form to add comments to article selected
    API.getComment(id).then(result => {
        commentForm.empty();
        commentForm.append("<input id='titleinput' class='form-control' name='name' placeholder='Your name' >");
        commentForm.append("<textarea id='bodyinput' class='form-control' name='body' placeholder='Comment'></textarea>");
        commentForm.append("<button data-id='" + result._id + "' class='form-control' id='sendComment'>Comment</button>");
        commentGet.empty();
        $("#hideComment").toggle();

        // Display comment header if there are any comments
        result.comments[0].body ? commentGet.append("<h2>Comments</h2>") && commentGet.append("<hr>"): null

        // Display comments associated with article
        result.comments.map(data => {
            commentGet.append("<h5>" + data.body + "</h5>");
            commentGet.append("<p><small>Name: " + data.name + "</small></p>");
            commentGet.append("<button data-id='" + data._id + "' class='btn btn-outline-danger' id='removeComment'>X</button>")
            commentGet.append("<hr>");
        });
    });
});

$(document).on("click", "#sendComment", function() {
    let id = $(this).data("id");
    let name = $("#titleinput").val();
    let body = $("#bodyinput").val();
    $("#hideComment").toggle();
    if (name === "" || body === "") {
        $("#commentForm").prepend("<h5 class='text-danger' id='commentFail'>Name and/or comment required</h5>");
    } else {
        API.saveComment(id, name, body)
            .then(function (data) {
                console.log(data);
                $("#commentFail").empty();
                $("#commentForm").prepend("<h5 class='text-success'>Comment Sent</h5>");
            });
        $("#titleinput").val("");
        $("#bodyinput").val("");
    }
});

$(document).on("click", "#removeComment", function() {
    let removeId = $(this).data("id");
    $("#hideComment").toggle();
    API.deleteComment(removeId).then(removed => {
        console.log(removed)
    }).catch( err => {
        console.log(err);
    })
});

