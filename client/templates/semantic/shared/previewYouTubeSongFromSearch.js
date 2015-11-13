Template.previewYouTubeSongFromSearch.helpers({
	youtubeSongObjectSelected: function() {
		if(!_.isUndefined(Session.get('selYTsrchRes')) && !_.isNull(Session.get('selYTsrchRes')))
			return true;
		else
			return false;
	},
	searchedYouTubeSongVideoID: function() {
		if(!_.isUndefined(Session.get('selYTsrchRes')))
			return Session.get('selYTsrchRes').songObject.id.videoId;
	}
});