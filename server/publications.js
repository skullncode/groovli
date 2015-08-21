Meteor.publish('allSongsForSongBoard', function(userID) {
  if(userID !== null)
  {
    var options = {
      fields: {
      "songSearchText": 0, 
      "aeCount": 0, 
      "meCount": 0, 
      "iTunesValid": 0, 
      "LFMValid": 0, 
      "cleanedTrackSearchQuery": 0, 
      "wuzzyFactor": 0, 
      "error": 0, 
      "iTunesMediumAlbumArt": 0, 
      "iTunesLargeAlbumArt": 0, 
      "iTunesAlbumURL": 0, 
      "iTunesAlbumPrice": 0,
      "iTunesPriceCurrency": 0,
      "iTunesTrackPrice": 0,
      "iTunesTrackURL": 0,
      "discCount": 0,
      "discNumber": 0
    }};
    //return Songs.find({$or: [{iTunesValid:'VALID'},{LFMValid:'VALID'},{manualApproval:'VALID'}]},{'sharedBy.uid': String(userID)}, options);
    //was returning only songs for that user so had to change it; original publish selection was wrong and was not removing extra fields
    //return Songs.find({'sharedBy.uid': String(userID), $or: [{iTunesValid:'VALID'},{LFMValid:'VALID'},{manualApproval:'VALID'}]},options);
    return Songs.find({$or: [{iTunesValid:'VALID'},{LFMValid:'VALID'},{manualApproval:'VALID'}]},options);
  }
});

Meteor.publish('allSongsForSpecificArtist', function(artistName) {
  //console.log('METHOD 1 - FROM THE PUBLISHing CODE; this is the USER ID to get data for: ' + userID);
  if(this.userId !== null)
  {
    var options = {
      fields: {
      "songSearchText": 0, 
      "aeCount": 0, 
      "meCount": 0, 
      "iTunesValid": 0, 
      "LFMValid": 0, 
      "cleanedTrackSearchQuery": 0, 
      "wuzzyFactor": 0, 
      "error": 0, 
      "iTunesMediumAlbumArt": 0, 
      "iTunesLargeAlbumArt": 0, 
      "iTunesAlbumURL": 0, 
      "iTunesAlbumPrice": 0,
      "iTunesPriceCurrency": 0,
      "iTunesTrackPrice": 0,
      "iTunesTrackURL": 0,
      "discCount": 0,
      "discNumber": 0
    }};

    if(artistName.indexOf(' & ') >= 0)
    {
      //console.log('IN FIRST IF CONDITION');
      //console.log(artistName);
      var x = Songs.find({sa: {$regex: new RegExp('^' + artistName + '$', 'i')}}, options).fetch();
      if(!_.isEmpty(x))
      {
        //console.log('THIS IS THE artist specific song LENGTH : ' + x.length);
        //return x;
        Songs.find({sa: {$regex: new RegExp('^' + artistName + '$', 'i')}}, options);
      }
      else
      {
        artistName = artistName.replace(/ & /g, ' and ');
        //console.log('DID not find anything with just &; replaced with AND and now searching again!');
        //console.log(artistName);
        return Songs.find({sa: {$regex: new RegExp('^' + artistName + '$', 'i')}}, options);
      }
    }
    else if(artistName.indexOf(' and ') >= 0)
    {
      //console.log('IN SECOND IF CONDITION');
      //console.log(artistName);
      var x = Songs.find({sa: {$regex: new RegExp('^' + artistName + '$', 'i')}}, options).fetch();
      if(!_.isEmpty(x))
      {
        //console.log('THIS IS THE artist specific song LENGTH : ' + x.length);
        //return x;
        return Songs.find({sa: {$regex: new RegExp('^' + artistName + '$', 'i')}}, options);
      }
      else
      {
        artistName = artistName.replace(/ and /g, ' & ');
        //console.log('DID not find anything with just AND; replaced with & and now searching again!');
        //console.log(artistName);
        return Songs.find({sa: {$regex: new RegExp('^' + artistName + '$', 'i')}}, options);
      }
    }
    else
    {
      //console.log('IN ELSE CONDITION');
      return Songs.find({sa: {$regex: new RegExp('^' + artistName + '$', 'i')}}, options);
    }
  }
});

Meteor.publish('commentsForSpecificSong', function(songID) {
  //console.log('METHOD 1 - FROM THE PUBLISHing CODE; this is the SONG ID to get data for: ' + songID);
  if(songID !== null)
  {
    /*var options = {
      fields: {
      "songSearchText": 0, 
      "aeCount": 0, 
      "meCount": 0, 
      "iTunesValid": 0, 
      "LFMValid": 0, 
      "cleanedTrackSearchQuery": 0, 
      "wuzzyFactor": 0, 
      "error": 0, 
      "iTunesMediumAlbumArt": 0, 
      "iTunesLargeAlbumArt": 0, 
      "iTunesAlbumURL": 0, 
      "iTunesAlbumPrice": 0,
      "iTunesPriceCurrency": 0,
      "iTunesTrackPrice": 0,
      "iTunesTrackURL": 0,
      "discCount": 0,
      "discNumber": 0
    }};*/

    //need to return only comments for that song
    return Comments.find({'referenceId': String(songID)});
  }
});

Meteor.publish('favoritesForSpecificSong', function(songID) {
  //console.log('METHOD 1 - FROM THE PUBLISHing CODE; this is the SONG ID to get data for: ' + songID);
  if(songID !== null)
  {
    /*var options = {
      fields: {
      "songSearchText": 0, 
      "aeCount": 0, 
      "meCount": 0, 
      "iTunesValid": 0, 
      "LFMValid": 0, 
      "cleanedTrackSearchQuery": 0, 
      "wuzzyFactor": 0, 
      "error": 0, 
      "iTunesMediumAlbumArt": 0, 
      "iTunesLargeAlbumArt": 0, 
      "iTunesAlbumURL": 0, 
      "iTunesAlbumPrice": 0,
      "iTunesPriceCurrency": 0,
      "iTunesTrackPrice": 0,
      "iTunesTrackURL": 0,
      "discCount": 0,
      "discNumber": 0
    }};*/

    //need to return only comments for that song
    return Favorites.find({'referenceId': String(songID)});
  }
});
Meteor.publish('favoritesForSpecificUser', function(userID) {
  //console.log('METHOD 1 - FROM THE PUBLISHing CODE; this is the SONG ID to get data for: ' + songID);
  if(userID !== null)
  {
    /*var options = {
      fields: {
      "songSearchText": 0, 
      "aeCount": 0, 
      "meCount": 0, 
      "iTunesValid": 0, 
      "LFMValid": 0, 
      "cleanedTrackSearchQuery": 0, 
      "wuzzyFactor": 0, 
      "error": 0, 
      "iTunesMediumAlbumArt": 0, 
      "iTunesLargeAlbumArt": 0, 
      "iTunesAlbumURL": 0, 
      "iTunesAlbumPrice": 0,
      "iTunesPriceCurrency": 0,
      "iTunesTrackPrice": 0,
      "iTunesTrackURL": 0,
      "discCount": 0,
      "discNumber": 0
    }};*/

    //need to return only comments for that song
    return Favorites.find({'userId': String(userID)});
  }
});


Meteor.publish('allSongsForSpecificUser', function(userID) {
  //console.log('METHOD 1 - FROM THE PUBLISHing CODE; this is the USER ID to get data for: ' + userID);
  if(userID !== null)
  {
    var options = {
      fields: {
      "songSearchText": 0, 
      "aeCount": 0, 
      "meCount": 0, 
      "iTunesValid": 0, 
      "LFMValid": 0, 
      "cleanedTrackSearchQuery": 0, 
      "wuzzyFactor": 0, 
      "error": 0, 
      "iTunesMediumAlbumArt": 0, 
      "iTunesLargeAlbumArt": 0, 
      "iTunesAlbumURL": 0, 
      "iTunesAlbumPrice": 0,
      "iTunesPriceCurrency": 0,
      "iTunesTrackPrice": 0,
      "iTunesTrackURL": 0,
      "discCount": 0,
      "discNumber": 0
    }};

    var targetedUser = Meteor.users.findOne({_id: userID});
    if(!_.isUndefined(targetedUser))
    {
      var socID = targetedUser.services.facebook.id;
      if(!_.isEmpty(socID) && !_.isNull(socID))
      {
        //need to return only songs for that user
        return Songs.find({'sharedBy.uid': String(socID), $or: [{iTunesValid:'VALID'},{LFMValid:'VALID'},{manualApproval:'VALID'}]},options);
      }
    }
    else
      return null;
  }
});

Meteor.publish("userObjectForProfilePage", function (userID) {
  //return Songs.find({iTunesValid:'PENDING'});
  //console.log('METHOD 2 - FROM THE PUBLISHING CODE: getting USER profile object for this USER ID: ' + userID)

  if(userID !== null)
  {
    //console.log('THIS IS THE user ID that will be publishing for: ' + this.userId)
    var options = {
      fields: 
        {
          "services.facebook": 1,
          "emails.address[0]": 1,
          "profile": 1,
          "fbFriends": 1,
          "tastemakers": 1,
          "unfollowedFriends": 1,
          "createdAt": 1,
          "status": 1,
          "baseLocation": 1
        }};
    var targetedUser = Meteor.users.findOne(userID);
    if(!_.isUndefined(targetedUser) && !_.isEmpty(targetedUser))
    {
      //console.log('FOUND AN ACTUAL USER OBJECT FOR THIS USER ID: ' + userID);
      return Meteor.users.find({_id: userID}, options);
    }
    else
    {
      //console.log('DID NOT FIND SHIT FOR THIS USER ID: ' + userID);
      this.error(new Meteor.Error("erroneous-user", "Can't find this user!"));
      return Meteor.users.find({_id: userID}, options);
    }
  } else {
    this.ready();
  }
});

Meteor.publish("genreObjectForProfilePage", function (genreName) {
  //return Songs.find({iTunesValid:'PENDING'});
  //console.log('METHOD 2 - FROM THE PUBLISHING CODE: getting USER profile object for this USER ID: ' + userID)

  if(this.userId !== null)
  {
    var genreForPage = Genres.findOne({'name': {$regex: new RegExp('^' + genreName + '$', 'i')}});

    if(!_.isUndefined(genreForPage) && !_.isEmpty(genreForPage))
    {
      //console.log('FOUND A VALID GENRE!!!');
      return Genres.find({'name': {$regex: new RegExp('^' + genreName + '$', 'i')}});
    }
    else
    {
      //console.log('NO GENRE FOUND!!!');
      this.error(new Meteor.Error("erroneous-genre", "Can't find this genre!"));
      return Genres.find({'name': {$regex: new RegExp('^' + genreName + '$', 'i')}});
    }
  }
});

Meteor.publish("artistsForGenre", function(genreName) {
  return Artists.find({'genres': {$regex: new RegExp(genreName, 'i')}}, {fields: {'name':1}});
});

Meteor.publish("userData", function () {
  if (this.userId) {
  	//console.log('THIS IS THE user ID that will be publishing for: ' + this.userId)
    return Meteor.users.find({_id: this.userId},
     {
     	fields: 
       	{
       		"services.facebook": 1,
       		"emails.address[0]": 1,
          "profile": 1,
          "fbFriends": 1,
          "tastemakers": 1,
          "unfollowedFriends": 1,
          "createdAt": 1,
          "status": 1,
          "baseLocation": 1
       	}
     });
  } else {
    this.ready();
  }
});

Meteor.publish(null, function (){ 
  return Meteor.roles.find({})
});


Meteor.publish('artistObjectForProfilePage', function (artistName){
  var artistForPage = Artists.findOne({'name': {$regex: new RegExp('^' + artistName + '$', 'i')}});

  if(!_.isUndefined(artistForPage) && !_.isEmpty(artistForPage))
  {
    //console.log('FOUND A VALID ARTIST!!!');
    return Artists.find({'name': {$regex: new RegExp('^' + artistName + '$', 'i')}});
  }
  else
  {
    //console.log('NO ARTIST FOUND!!!');
    this.error(new Meteor.Error("erroneous-artist", "Can't find this artist!"));
    return Artists.find({'name': {$regex: new RegExp('^' + artistName + '$', 'i')}});
  }

});

Meteor.publish('artists', function (){ 
  return Artists.find({},
     {
      fields: 
        {
          "name": 1,
          "genres": 1,
          'mediumImage': 1
        }
     })
});

Meteor.publish('messages', function(userID) {
  //console.log('INSIDE THE messages publish function with this userID: ');
  //console.log(userID);
  if(userID !== null)
  {
    //var foundMsgs = Messages.find({$or: [{'from': String(userID)},{'to': String(userID)}]});
    //console.log('THIS IS THE MESSAGES FOUND:')
    //console.log(foundMsgs.fetch());
    //return foundMsgs;
    return Messages.find({$or: [{'from': String(userID)},{'to': String(userID)}]});
  }
});

Meteor.publish('userStatus', function() {
  return Meteor.users.find({'status.online': true }, 
  { 
    fields: 
    {
      "status": 1
    }
  });
});

Meteor.publish('/invites', function() {
  //console.log("INSIDE THE INVITES publishing code: ");
  //console.log(this.userId);
  if (Roles.userIsInRole(this.userId, ['admin'])) {
    //console.log("USER IS IN ADMIN ROLE");
    return Invites.find({}, {
      fields: {
        "_id": 1,
        "inviteNumber": 1,
        "requested": 1,
        "email": 1,
        "fbID": 1,
        "token": 1,
        "dateInvited": 1,
        "invited": 1,
        "accountCreated": 1
      }
    });
  }
  else
  {
    console.log("USER IS not an admin");
    return Invites.find({});
  }
});

Meteor.publish('inviteCount', function() {
  return Invites.find({}, {
    fields: {
      "_id": 1
    }
  });
});