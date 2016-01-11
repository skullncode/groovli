var favesForThisSong = {};

Template.semanticFaveAction.helpers({
  songFavoritedByThisUser: function() {
    //console.log('CHECKING FOR FAVE!!!');
    if(!_.isEmpty(Session.get('ffts')))
    {
      //console.log('THERE ARE FAVES!!!');
      if(_.isUndefined(_.findWhere(favesForThisSong, {userId: Meteor.user()._id})))
        return false;
      else
        return true;
    }
    else
    {
      //console.log('THERE ARE noooooo FAVES!!!');
      return false;
    }
  },
  faveCount: function() {
    if(!_.isUndefined(Session.get('ffts')))
      return Session.get('ffts').length;
    else
      return 0;
  }
});

Template.semanticFaveAction.onCreated(function () {
  var self = this;

  // Use self.subscribe with the data context reactively
  self.autorun(function () {
    var cs = Session.get('CS');
    //console.log("THIS IS THE SONG ID for faves: ");
    //console.log(cs.sl);
    if(!_.isUndefined(cs))
    {
      self.subscribe("favoritesForSpecificSong", cs.sl);
      favesForThisSong = Favorites.find({'referenceId': String(cs.sl)}).fetch();
      Session.set('ffts', favesForThisSong)
    }
    //console.log('THIS IS THE RESULT OF FAVES FOR CURRENT SONG ');
    //console.log(favesForThisSong);
  });
});

Template.semanticFaveAction.events({
  "click .favoriteSong": function (event) {
    //console.log('Favorite CLICKED!!!');
    //console.log(event.toElement.value);
    //songFavorited = !songFavorited;
    var cs = Session.get('CS');
    if(!_.isUndefined(cs))
    {
      Meteor.call('favoriteSong', Meteor.user()._id, Meteor.user().profile.name, Meteor.user().services.facebook.id, currentSong.sl, currentSong.sa, currentSong.st, function(error, result) {
        if(error)
          console.log('Encountered error while trying to favorite song!');
        else
        {
          amplitude.logEvent('favorited a song');
          ga('send', {
            hitType: 'event',
            eventCategory: 'songboard',
            eventAction: 'favorited a song'
          });
          //console.log('SUCCESSFULLY favorited this song!!');
          //$("#commentContent").val("");
        }
      });
    }
    else
      console.log('no song loaded to favorite!');
    return true;
  }
});