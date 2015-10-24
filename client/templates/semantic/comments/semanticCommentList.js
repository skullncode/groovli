var commentsForThisSong = {};

Template.semanticCommentList.helpers({
  commentsForThisSong: function() {
    //console.log("GOING TO RETURN COMMENTS FOR THIS SONG: " + Session.get('CS').st);
    var cs = Session.get('CS');
    return Session.get(cs._id+"_commentsForSong");
  },
  commentCount: function() {
    var cs = Session.get('CS');
    if(!_.isUndefined(Session.get(cs._id+"_commentsForSong")))
      return Session.get(cs._id+"_commentsForSong").length;
    else
      return 0;
  },
  songHasComments: function() {
    //console.log("CHECKING if song has comments:");
    var cs = Session.get('CS');
    if(!_.isEmpty(Session.get(cs._id+"_commentsForSong")))
    {
      return true;
    }
    else
    {
      return false;
    }
  }
});

Template.semanticCommentList.onCreated(function () {
  var self = this;

  // Use self.subscribe with the data context reactively
  self.autorun(function () {
    var cs = Session.get('CS');
    //console.log("Gonna get some new comments for this song:  "+ cs.st);
    //console.log(dataContext.songID)
    self.subscribe("commentsForSpecificSong", cs.sl);
    commentsForThisSong = Comments.find({'referenceId': String(cs.sl)},  {sort: { 'createdAt': -1 }}).fetch();
    Session.set(cs._id+"_commentsForSong", commentsForThisSong);
  });
});