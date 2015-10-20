var genrePageSidebarContext = new ReactiveVar(null);

Template.genrePageSidebar.helpers({
	genObjLoadedAndExists: function() {
		if(Session.get(genrePageSidebarContext.get().params._id+'_genObjLoaded') && !_.isUndefined(Session.get(genrePageSidebarContext.get().params._id+'_genObj')))
			return true;
		else
			return false;
	}
});

Template.genrePageSidebar.onCreated(function() {
	var self = this;
	self.autorun(function() {
		FlowRouter.watchPathChange();
	    var context = FlowRouter.current();
	    genrePageSidebarContext.set(context);
	});
});