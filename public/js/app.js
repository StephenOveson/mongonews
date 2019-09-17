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
    console.log("button press")
    let id = $(this).data("id")
    API.getComment(id).then(function(result) {
        $("#comments").append("<input id='titleinput' name='name' placeholder='Your name' >");
        $("#comments").append("<textarea id='bodyinput' name='body' placeholder='Comment'></textarea>");
        $("#comments").append("<button data-id='" + result._id + "' id='sendComment'>Comment</button>");
        if(result.body) {
            $("#titleinput").val(result.comment.name);
            $("#bodyinput").val(result.comment.body);
        }
    })
})