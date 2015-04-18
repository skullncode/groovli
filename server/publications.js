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
          "createdAt": 1
       	}
     });
  } else {
    this.ready();
  }
});