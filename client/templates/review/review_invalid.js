Template.reviewInvalid.helpers({
	retrieveInvalidItemsForReview: function()
	{
		getInvalidItemsForReview();
	},

	existingSongsForReview: function() 
	{
		return Session.get('invalidReview');
	},

	existingCount: function()
	{
		return Session.get('invalidReviewCount');
	}
});

Template.reviewInvalid.events({
	"click #getMissingAlbumArt": function (event) {
      console.log('CLICKED get missing album art button!!');
      var songList = Session.get('invalidReview');
      var x = 0;
      while(x < songList.length)
      {
      	if(!_.isUndefined(songList[x].LFMLargeAlbumArt) && songList[x].LFMLargeAlbumArt.indexOf('http') !== 0)
      	{
      		//console.log('THIS SONG: ' + songList[x].st + ' DOES NOT HAVE ALBUM ART!!!!');
      		Meteor.call('doManualLFMValidationForLink', songList[x].sl, songList[x].sa, songList[x].st, 'YT');
      	}
      	x++;	
      }
      location.reload();
    }
});

function getInvalidItemsForReview()
{
	Meteor.call('reviewInvalidSongs', function(error, result) {
		if(error){
	        console.log(error.reason);
	    }
	    else{
	    	//console.log('REVIEW EXISTING SUCCESS: ');
	    	//console.log(result);
	    	Session.set('invalidReview', result);
	    	Session.set('invalidReviewCount', result.length);
	    }
	});
}

