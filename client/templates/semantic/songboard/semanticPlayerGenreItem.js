Template.semanticPlayerGenreItem.onRendered(function () {
  var self = this;
  self.autorun(function() {
    //var postId = FlowRouter.getParam('postId');
    if(!_.isNull(Session.get('CS')) && !_.isUndefined(Session.get('CS')))
    {
      //console.log('GOING TO activate genre popups for this song');
      Meteor.setTimeout(activateGenrePopupsForThisSong, 800);
    }
  });
});

function activateGenrePopupsForThisSong(){
  var genItems = Genres.find().fetch();
  _.each(genItems, function(x){
    var popupSelector = '.songGenrePopup.' + x._id;
    //console.log('GOING TO INITIATE this popup now!');
    //console.log(popupSelector);
    $(popupSelector).popup({
      hoverable: true,
      inline: true
    });
  });
}

Template.semanticPlayerGenreItem.events({
  'click #filterForThisGenre': function(event, template) {
    changeGenreSelectionsProgrammatically([template.data.name]);
    return true;
  },
  'click #addToExistingFilter': function(event, template) {
    var existingGenList = Session.get('selGens');
    if(!_.contains(Session.get('selGens'),template.data.name))
    {
      existingGenList.push(template.data.name);
      changeGenreSelectionsProgrammatically(existingGenList);
    }
    return true;
  }
});
