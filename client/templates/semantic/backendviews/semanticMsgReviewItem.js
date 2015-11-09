Template.semanticMsgReviewItem.helpers({
    humanTimestamp: function() {
      return new moment(this.timestamp * 1000).format('llll')
    },
    recipientIsGroup: function() {
      if(this.to.indexOf('group') >= 0)
        return true;
      else
        return false;
    },
    groupLink: function() {
      if(this.to.indexOf('artist') >= 0)
      {
        return "/artist/"+this.to.split('_')[0];
      }
      else if(this.to.indexOf('genre') >= 0)
      {
        return "/genre/"+this.to.split('_')[0];
      }
    }
});

Template.semanticMsgReviewItem.events({
  'click #deleteMsg': function(e) {
    console.log('CLICKED delete genre button:');
    var msgID = $(e.currentTarget.parentElement.parentElement).find('#msgID').text()
    console.log(msgID);
    //console.log('FOR THIS ARTIST: ' + artName);
    //console.log(artistObjectDiv);
    Meteor.call('deleteMsgDuringReview', msgID, function(error,result){
        if(error){
          return toastr.error(error.reason);
        }
        else{
            // do something with result
          //$(genreObjectDiv).hide();
          return toastr.success('Successfully deleted MSG: ' + msgID);
        };
    });
  }
});