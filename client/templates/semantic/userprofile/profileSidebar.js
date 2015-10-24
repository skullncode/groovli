var profileSidebarContext = new ReactiveVar(null);

Template.profileSidebar.helpers({
	uObjLoadedAndExists: function() {
		if(Session.get(profileSidebarContext.get().params._id+'_uObjLoaded') && !_.isUndefined(Session.get(profileSidebarContext.get().params._id+'_uObj')))
			return true;
		else
			return false;
	}
});

Template.profileSidebar.onCreated(function() {
	var self = this;
	self.autorun(function() {
		FlowRouter.watchPathChange();
	    var context = FlowRouter.current();
	    profileSidebarContext.set(context);
	});
});