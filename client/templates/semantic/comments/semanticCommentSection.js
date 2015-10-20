Template.semanticCommentSection.helpers({
  songPlaying: function() {
    var cs = Session.get('CS');
    if(!_.isUndefined(cs) && !_.isEmpty(cs))
      return true;
    else
      return false;
  }
});