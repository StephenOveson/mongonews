API = {
    getComment: (id) => {
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
    }
};

$(document).on("click", "#newComment", function() {
    let id = $(this).data("id")
    let commentSet = $("#commentSet")
    let commentForm = $("#commentForm")
    API.getComment(id).then(function(result) {
        commentForm.empty();
        commentForm.append("<input id='titleinput' name='name' placeholder='Your name' >");
        commentForm.append("<textarea id='bodyinput' name='body' placeholder='Comment'></textarea>");
        commentForm.append("<button data-id='" + result._id + "' id='sendComment'>Comment</button>");
        commentSet.empty();
        commentSet.append("<h1>Comments</h1>")
        result.comments.map(function(data){
            commentSet.append("<h4>Comment: " + data.body + "</h4>")
            commentSet.append("<p>Name: " + data.name + "</p>");
            commentSet.append("<hr>")
        })
    })
})

$(document).on("click", "#sendComment", function() {
    let id = $(this).data("id");
    let name = $("#titleinput").val();
    let body = $("#bodyinput").val();
    API.saveComment(id, name, body)
      .then(function(data) {
        console.log(data);
      });
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });
  