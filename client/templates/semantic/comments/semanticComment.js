Template.semanticComment.helpers({
  createdAgo: function() {
    //return new moment(this.createdAt).calendar();
    return new moment(this.createdAt).fromNow();
  },
  nameForComment: function() {
    var userForComment = this.nameOfUser;
    /*console.log('THIS IS THE USER obj for this comment: ');
    console.log(this);
    console.log('THIS IS HTE USER NAMEEEE')
    console.log(userForComment);*/
    if(!_.isUndefined(userForComment))
    {
      //console.log('RETURNING THIS NAME: ');
      //console.log(userForComment.profile.name)
      return userForComment.split(' ')[0];
    }
  },
  isOwnComment: function() {
    return isOwnComment(this);
  },
  isOwnCommentAndLessThanFiveMinutes: function() {
    //console.log("CHECKING if comment is own or not");
    //console.log('METEOR USER ID: ' + Meteor.user()._id);
    //console.log('comment USER ID: ' + this.userId);
    var nowTime = new moment();
    var diff = nowTime - new moment(this.createdAt);
    //console.log('diff for this comment is: ' + diff);
    if((Meteor.user()._id == this.userId) && (diff < 300000)) //comment is your own and comment was posted in the past 5 minutes
      return true;
    else
      return false;
  },
  commentHasLikes: function() {
    if(this.likes.length > 0)
      return true;
    else
      return false;
  },
  likesCount: function() {
    if(this.likes.length > 0)
      return this.likes.length;
    else
      return "";
  }
});

Template.semanticComment.events({
  "click .delete": function (event) {
    // This function is called when the new task form is submitted
    console.log("CLICKED BUTTON for DELETING comment!!!");
    var commentID = $(event.currentTarget).attr('id');
    console.log('THIS IS THE COMMENT ID: ' + commentID);
    if(!_.isEmpty(commentID))
    {
      //console.log("THIS IS THE COMMENT: ");
      //console.log(commentContent)
      Meteor.call('deleteCommentForSong', commentID, function(error, result) {
        if(error)
          console.log('Encountered error while trying to post comment for song!');
        else
        {
          console.log('SUCCESSFULLY deleted comment for this song!!');
          //$("#commentContent").val("");
        }
      });
    }
    return false;
  },
  "click .likeComment": function (event) {
    var commentID = $(event.currentTarget).attr('id');
    console.log('CLICKED button for LIKING comment! : ' + commentID);
    if(!_.isEmpty(commentID))
    {
      //console.log("THIS IS THE COMMENT: ");
      //console.log(commentContent)
      if(!isOwnComment(this))
      {
        Meteor.call('likeCommentForSong', Meteor.user()._id, Meteor.user().profile.name, Meteor.user().services.facebook.id, commentID, function(error, result) {
          if(error)
            console.log('Encountered error while trying to post comment for song!');
          else
          {
            console.log('SUCCESSFULLY liked comment for this song!!');
            //$("#commentContent").val("");
          }
        });
      }
    }
    return false;
  }
});

function isOwnComment(commentObj){
  return Meteor.user()._id == commentObj.userId;
}