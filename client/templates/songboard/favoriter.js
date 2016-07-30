var favesForThisSong = {};

Template.favoriter.helpers({
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
    return Session.get('ffts').length;
  }
});

Template.favoriter.onCreated(function () {
  var self = this;

  // Use self.subscribe with the data context reactively
  self.autorun(function () {
    var dataContext = Template.currentData();
    //console.log("THIS IS THE SONG ID for faves: ");
    //console.log(dataContext.sl);
    self.subscribe("favoritesForSpecificSong", dataContext.sl);
    favesForThisSong = Favorites.find({'referenceId': String(dataContext.sl)}).fetch();
    Session.set('ffts', favesForThisSong)
    //console.log('THIS IS THE RESULT OF FAVES FOR CURRENT SONG ');
    //console.log(favesForThisSong);
  });
});

Template.favoriter.events({
  "click .favoriteSong": function (event) {
    //console.log('Favorite CLICKED!!!');
    //console.log(event.toElement.value);
    //songFavorited = !songFavorited;
    Meteor.call('favoriteSong', Meteor.user()._id, Meteor.user().profile.name, Meteor.user().services.facebook.id, currentSong.sl, currentSong.sa, currentSong.st, function(error, result) {
      if(error)
        console.log('Encountered error while trying to favorite song!');
      else
      {
        //console.log('SUCCESSFULLY favorited this song!!');
        //$("#commentContent").val("");
      }
    });
    return true;
  }
});