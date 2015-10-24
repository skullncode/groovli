var commentsForThisSong = {};

Template.commentList.helpers({
  commentsForThisSong: function() {
    return commentsForThisSong;
  },
  commentCount: function() {
    return commentsForThisSong.fetch().length;
  },
  songHasComments: function() {
    if(commentsForThisSong.fetch().length > 0)
      return true;
    else
      return false;
  }
});

Template.commentList.onCreated(function () {
  var self = this;

  // Use self.subscribe with the data context reactively
  self.autorun(function () {
    var dataContext = Template.currentData();
    //console.log("THIS IS THE SONG ID for comments: ");
    //console.log(dataContext.songID)
    self.subscribe("commentsForSpecificSong", dataContext.songID);
    commentsForThisSong = Comments.find({'referenceId': String(dataContext.songID)},  {sort: { 'createdAt': -1 }});
    //console.log('THIS IS THE RESULT OF COMMENTS FOR CURRENT SONG ');
    //console.log(commentsForThisSong.fetch().length);
  });
});

/*Template.commentList.events({
  'click .panel-heading span.clickable': function (event) {
    console.log("CLICKED SHOW COMMENT!!");
    console.log(event);
    if ($(event.currentTarget).hasClass('panel-collapsed')) {
      // expand the panel
      console.log("NEED TO COLLAPSE COMMENTS PANEL!");
      $(event.currentTarget).parents('.panel').find('.panel-body').slideDown();
      $(event.currentTarget).removeClass('panel-collapsed');
      $(".commentHider").text("HIDE COMMENTS");
      //$(event.currentTarget).find('i').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
    }
    else {
      // collapse the panel
      console.log("NEED TO EXPAND COMMENTS PANEL!");
      $(event.currentTarget).parents('.panel').find('.panel-body').slideUp();
      $(event.currentTarget).addClass('panel-collapsed');
      $(".commentHider").text("READ THEM / COMMENT");
      //$(event.currentTarget).find('i').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
    }
  }
});*/