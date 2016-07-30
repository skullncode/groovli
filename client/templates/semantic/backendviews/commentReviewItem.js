Template.commentReviewItem.helpers({
    humanTimestamp: function() {
      return new moment(this.createdAt).format('llll')
    },
    youtubeThumbnail: function() {
      var ytImgLink = 'https://i.ytimg.com/vi/' + this.referenceId.substring(this.referenceId.indexOf("v=")+2) + '/default.jpg';
      return ytImgLink;
    }
});

Template.commentReviewItem.events({
  'click #deleteComment': function(e) {
    console.log('CLICKED delete comment button:');
    var commentID = $(e.currentTarget.parentElement.parentElement).find('#commentID').text()
    console.log(commentID);
    //console.log('FOR THIS ARTIST: ' + artName);
    //console.log(artistObjectDiv);
    Meteor.call('deleteCommentForSong', commentID, function(error,result){
        if(error){
          return toastr.error(error.reason);
        }
        else{
            // do something with result
          //$(genreObjectDiv).hide();
          return toastr.success('Successfully deleted comment: ' + commentID);
        };
    });
  }
});