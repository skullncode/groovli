Template.genreTabs.helpers({
	songsForGenre: function() {
		return Session.get(Router.current().params._name+'_gs');
	},

	coverSongsForArtist: function()	{
		return Session.get(Router.current().params._name+'_acs');
	},

	genreSpecificActivePeople: function() {
		return Session.get(Router.current().params._name+'_gusers');
	},

	songCount: function() {
		//console.log('CHECKING SONG COUNT!!!');
		if(Session.get(Router.current().params._name+'_gs_count') > 1 || Session.get(Router.current().params._name+'_gs_count') === 0)
			return '<h2><strong>'+Session.get(Router.current().params._name+'_gs_count')+'</strong></h2><p><small>songs on Groovli</small></p>';
		else if(Session.get(Router.current().params._name+'_gs_count') === 1)
			return '<h2><strong>'+Session.get(Router.current().params._name+'_gs_count')+'</strong></h2><p><small>song on Groovli</small></p>';
	},

	hasCoverSongs: function() {
		if(Session.get(Router.current().params._name+'_acs_count') > 0)
			return true;
		else
			return false;
	},

	hasUsers: function() {
		if(!_.isUndefined(Session.get(Router.current().params._name+'_gusers')) && Session.get(Router.current().params._name+'_gusers').length > 0)
			return true;
		else
			return false
	},

	userIsKing: function() {
		return isUserKing();
	}
});

function isUserProfileYou()
{
	return Router.current().params._id === Meteor.user()._id;
}