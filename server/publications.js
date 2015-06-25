Meteor.publish('songs', function(userID) {
  //return Songs.find({iTunesValid:'PENDING'});
  console.log('THIS IS THE user ID that will be publishing for: ' + this.userId)
  //return Songs.find({$or: [{iTunesValid:'VALID'},{LFMValid:'VALID'}], aeCount: {$lt: 1}});
  console.log('FROM THE PUBLISHing CODE; this is the USER ID to get data for: ' + userID);
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

Meteor.publish('artists', function (){ 
  return Artists.find({},
     {
      fields: 
        {
          "name": 1,
          "genres": 1
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