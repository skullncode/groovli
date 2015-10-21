var genrePageSidebarContext = new ReactiveVar(null);

Template.genrePageSideBarArtistThumbs.helpers({
	artistImage: function() {
		if(!_.isUndefined(this.mediumImage))
		{
			if(!_.isEmpty(this.mediumImage['#text']))
				return this.mediumImage['#text'];
			else
				return "http://semantic-ui.com/images/wireframe/square-image.png";
		}
	},	
	genreHasArtists: function() {
		if(!_.isUndefined(Session.get(genrePageSidebarContext.get().params._id+'_arts')) && !_.isEmpty(Session.get(genrePageSidebarContext.get().params._id+'_arts')))
		  return true;
		else
		  return false;
	},

	artistsForThisGenre: function() {
		return Session.get(genrePageSidebarContext.get().params._id+'_arts');
	},

	artistCountForGenre: function() {
		return Session.get(genrePageSidebarContext.get().params._id+'_arts').length;
	}
});

Template.genrePageSideBarArtistThumbs.onCreated(function() {
	var self = this;
	self.autorun(function() {
		FlowRouter.watchPathChange();
	    var context = FlowRouter.current();
	    genrePageSidebarContext.set(context);
	});
});