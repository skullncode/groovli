Votes = new Mongo.Collection('votes');

Votes.allow({
  insert: function() {
    return false;
  },
  update: function() {
    return false;
  },
  remove: function() {
    return false;
  }
});

Meteor.methods({
	updateSiteVote: function(userRating){
		console.log('INSIDE THE UPDATE VOTE / POLL METHOD FOR Poll SERVER CONTROLLER');
		var userID = Meteor.user().services.facebook.id;
		console.log('going to update the user poll for this user ID: ' + userID + ' WITH THIS rating: ' + userRating);
		
		Votes.upsert({'uid': userID}, {$set: { rating: userRating }}, function(error) {
	      if (error) {
	        // display the error to the user
	        return console.log(error.reason);
	      }
	      //else{
	      	console.log('################ site rating succesfully updated for: ' + userID);
	      //}
		});
	},
	getPersonalSiteRating: function(){
		var userID = Meteor.user().services.facebook.id;
		var personalRating = Votes.find({'uid': userID}).fetch();

		if(personalRating.length > 0)
		{
			console.log('Will be returning personalRating because it is not empty:');
			console.log(personalRating[0].rating);
			return personalRating[0].rating;
		}
	}
});