Template.reviewArtists.helpers({
	retrieveArtistsForReview: function()
	{
		getArtistsForReview();
	},

	existingArtistsForReview: function() 
	{
		return Session.get('artistsReview');
	},

	existingCount: function()
	{
		return Session.get('artistsReviewCount');
	}
});

Template.reviewArtists.events({
	"click #getArtistDetails": function (event) {
      console.log('CLICKED get artist details button!!');
      Meteor.call('setDetailsForUnsetArtists');
      location.reload();
    }
});

function getArtistsForReview()
{
	/*var result = Artists.find({}).fetch();
	Session.set('artistsReview', result);
	Session.set('artistsReviewCount', result.length);*/
	
	Meteor.call('reviewExistingArtists', function(error, result) {
		if(error){
	        console.log(error.reason);
	    }
	    else{
	    	//console.log('REVIEW ARTIST SUCCESS: ');
	    	//console.log(result);
	    	Session.set('artistsReview', result);
	    	Session.set('artistsReviewCount', result.length);
	    }
	});
}

