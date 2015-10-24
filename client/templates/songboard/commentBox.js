Template.commentBox.helpers({
  commentCount: function() {
    return commentsForThisSong.fetch().length;
  }
});

Template.commentBox.events({
  "click #btnPostComment": function (event) {
    // This function is called when the new task form is submitted
    console.log("CLICKED BUTTON for posting comment!!!");
    var commentContent = $("#commentContent").val().trim();
    if(!_.isEmpty(commentContent))
    {
      console.log("THIS IS THE COMMENT: ");
      console.log(commentContent)
      Meteor.call('postCommentForSong', Session.get('CS').sl, Meteor.user()._id, Meteor.user().profile.name, Meteor.user().services.facebook.id, commentContent, function(error, result) {
        if(error)
          console.log('Encountered error while trying to post comment for song!');
        else
        {
          console.log('SUCCESSFULLY posted comment for this song!!');
          $("#commentContent").val("");
        }
      });
    }
    return false;
  }
});