Meteor.publish('songs', function(userID) {
  //return Songs.find({iTunesValid:'PENDING'});
  //console.log('THIS IS THE user ID that will be publishing for: ' + this.userId)
  //return Songs.find({$or: [{iTunesValid:'VALID'},{LFMValid:'VALID'}], aeCount: {$lt: 1}});
  console.log('FROM THE PUBLISHing CODE; this is the USER ID to get data for: ' + userID);
  if(userID !== null)
  {
    var options = {songSearchText: 0, aeCount: 0, meCount: 0, iTunesValid: 0, LFMValid: 0, _id: 0};
    return Songs.find({$or: [{iTunesValid:'VALID'},{LFMValid:'VALID'},{manualApproval:'VALID'}]},{'sharedBy.uid': String(userID)}, options);
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
          "status": 1
       	}
     });
  } else {
    this.ready();
  }
});

Meteor.publish(null, function (){ 
  return Meteor.roles.find({})
})

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
  console.log("INSIDE THE INVITES publishing code: ");
  console.log(this.userId);
  if (Roles.userIsInRole(this.userId, ['admin'])) {
    console.log("USER IS IN ADMIN ROLE");
    return Invites.find({}, {
      fields: {
        "_id": 1,
        "inviteNumber": 1,
        "requested": 1,
        "email": 1,
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