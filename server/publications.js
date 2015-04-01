Meteor.publish('songs', function() {
  //return Songs.find({iTunesValid:'PENDING'});
  //console.log('THIS IS THE user ID that will be publishing for: ' + this.userId)
  //return Songs.find({$or: [{iTunesValid:'VALID'},{LFMValid:'VALID'}], aeCount: {$lt: 1}});
  return Songs.find({$or: [{iTunesValid:'VALID'},{LFMValid:'VALID'}]});
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
          "profile": 1
       	}
     });
  } else {
    this.ready();
  }
});