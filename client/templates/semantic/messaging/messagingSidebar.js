var messagingSidebarContext = new ReactiveVar(null);
var knownUsersLoaded = new ReactiveVar(false);
var unknownUsersLoaded = new ReactiveVar(false);
Session.setDefault('selectedUserInMessagingList', null)
Session.setDefault('skuser', false); //selected known user
Session.setDefault('sukuser', false); //selected unknown user

Template.messagingSidebar.onRendered(function () {
  getAllPossibleUsersForMessaging();
  $('.tabular.menu .item').tab();
});

Template.messagingSidebar.helpers({
	uObjLoadedAndExists: function() {
		if(Session.get(messagingSidebarContext.get().params._id+'_uObjLoaded') && !_.isUndefined(Session.get(messagingSidebarContext.get().params._id+'_uObj')))
			return true;
		else
			return false;
	},
	hasUsersForMessaging: function() {
		if(!_.isUndefined(Meteor.user()) && !_.isNull(Meteor.user()) && !_.isUndefined(Session.get(Meteor.user()._id + '_allMessagingUsers')))
		{
			return Session.get(Meteor.user()._id + '_allMessagingUsers').length > 0;
		}
		else
			return false;
	},
	hasUnknownUsersForMessaging: function() {
		if(!_.isUndefined(Meteor.user()) && !_.isNull(Meteor.user()) && !_.isUndefined(Session.get(Meteor.user()._id + '_allUnknownMessagingUsers')))
		{
			return Session.get(Meteor.user()._id + '_allUnknownMessagingUsers').length > 0;
		}
		else
			return false;
	},
	usersForMessaging: function() {
		if(!_.isUndefined(Meteor.user()))
		{
			return Session.get(Meteor.user()._id + '_allMessagingUsers');
		}
		else
			return [];
	},
	unknownUsersForMessaging: function() {
		if(!_.isUndefined(Meteor.user()))
		{
			return Session.get(Meteor.user()._id + '_allUnknownMessagingUsers');
		}
		else
			return [];
	},
	unknownMessagableUserCount: function() {
		if(!_.isUndefined(Meteor.user()) && !_.isNull(Meteor.user()) && !_.isUndefined(Session.get(Meteor.user()._id + '_allUnknownMessagingUsers')))
			return Session.get(Meteor.user()._id + '_allUnknownMessagingUsers').length;
		else
			return 0; 
	},
	messagableUserCount: function() {
		if(!_.isUndefined(Meteor.user()) && !_.isNull(Meteor.user()) && !_.isUndefined(Session.get(Meteor.user()._id + '_allMessagingUsers')))
			return Session.get(Meteor.user()._id + '_allMessagingUsers').length;
		else
			return 0;
	},
	thisUserHasUnreadMsgs: function() {
		if(!_.isUndefined(this) && !_.isNull(this) && !_.isUndefined(this.services))
		{
			if(Messages.find({'from': this.services.facebook.id, 'read': false}).count() > 0)
				return true;
			else
				return false;
		}
		else
			return false;
	},
	unreadMsgsFromThisUser: function() {
		if(!_.isUndefined(this) && !_.isNull(this) && !_.isUndefined(this.services))
		{
			var x = Messages.find({'from': this.services.facebook.id, 'read': false}).fetch();
			return x.length;
		}		
	},
	hasOnlineStatus: function(){
		if(!_.isUndefined(this.status.online))
			return true;
		else
			return false;
	},
	knownUsersLoaded: function() {
		return knownUsersLoaded.get();
	},

	unknownUsersLoaded: function() {
		return unknownUsersLoaded.get();
	}
});

Template.messagingSidebar.onCreated(function() {
	var self = this;
	self.autorun(function() {
		FlowRouter.watchPathChange();
	    var context = FlowRouter.current();
	    messagingSidebarContext.set(context);	    
	    getAllPossibleUsersForMessaging();
	    if(!_.isNull(Meteor.user()) && !_.isUndefined(Meteor.user()) && !_.isUndefined(Meteor.user().services))
	    {
    		self.subscribe('messagesForSidebarExcludingGenreAndArtistGroupMessages', Meteor.user().services.facebook.id);
		}
		if(!_.isNull(Meteor.user()) && !_.isUndefined(Meteor.user()) && !_.isUndefined(Meteor.user().services) && !_.isUndefined(Session.get(Meteor.user()._id + '_allMessagingUsers')))
		{
			self.subscribe('messagesBetweenYouAndUnknownUsers', Meteor.user().services.facebook.id, Session.get(Meteor.user()._id + '_allMessagingUsers'), {onReady: getUnknownUsersForMessaging});
		}
	});
});

Template.messagingSidebar.events({
	"click #userInMessagingList": function (event) {
	  // This function is called when the new task form is submitted
	  //console.log("CLIIIIICKED USER IN MESSAGING LIST!!!!");
	  //console.log(event);
	  //console.log('selected this user:');
	  //console.log(this);
	  mixpanel.track("clicked known user within messaging list");
	  Session.set('skuser', true);
	  Session.set('sukuser', false);
	  Session.set('selectedUserInMessagingList', this);
	  $('.selectedUserInMessagingList').removeClass('active selectedUserInMessagingList');
	  $(event.toElement).addClass('active selectedUserInMessagingList');
	  return true;
	},
	"click #unknownUserInMessagingList": function (event) {
	  // This function is called when the new task form is submitted
	  //console.log("CLIIIIICKED UNKNOOOOOOOOOOOWN USER IN MESSAGING LIST!!!!");
	  //console.log(event);
	  //console.log('selected this user:');
	  //console.log(this);
	  mixpanel.track("clicked unknown user within messaging list");
	  Session.set('sukuser', true);
	  Session.set('skuser', false);
	  Session.set('selectedUserInMessagingList', this);
	  $('.selectedUserInMessagingList').removeClass('active selectedUserInMessagingList');
	  $(event.toElement).addClass('active selectedUserInMessagingList');
	  return true;
	}	
});

function getAllPossibleUsersForMessaging() {
	var possibleMessagingRecipients = [];
	if(!_.isUndefined(Meteor.user()) && !_.isNull(Meteor.user()))
	{
		_.each(Meteor.user().fbFriends, function(x) {
			//var actualUserObj = 
			if(_.isUndefined(_.findWhere(possibleMessagingRecipients, x.fbid)))
				possibleMessagingRecipients.push(String(x.fbid));
		});

		_.each(Meteor.user().tastemakers, function(x) {
			if(_.isUndefined(_.findWhere(possibleMessagingRecipients, x.fbid)))
				possibleMessagingRecipients.push(String(x.fbid));
		});

		//console.log("############### this is the possibleMessagingRecipients");
		//console.log(possibleMessagingRecipients);

		Meteor.call('getFriendData', possibleMessagingRecipients, function(error, result) {
			if(error){
		        console.log(error.reason);
		    }
		    else{
		    	//console.log('REVIEW EXISTING SUCCESS: ');
		    	//console.log(result);
		    	Session.set(Meteor.user()._id + '_allMessagingUsers', result);
		    	knownUsersLoaded.set(true);
		    	//Session.set('friendCount', result.length);
		    }
		});
	}

	//Session.set(Meteor.user()._id + '_allMessagingUsers', possibleMessagingRecipients);
}

function getUnknownUsersForMessaging() {
	//console.log("GONNA TRY AND GET LIST OF UNOWN USERRRRRRS !!!!!!!!!!!!!!!");
	var unknownMessagingRecipients = [];
	if(!_.isUndefined(Meteor.user()) && !_.isNull(Meteor.user()) && !_.isNull(Session.get(Meteor.user()._id + '_allMessagingUsers')))
	{
		var friendIDsToIgnore = [];

	    _.each(Session.get(Meteor.user()._id + '_allMessagingUsers'), function(z){
	      friendIDsToIgnore.push(z.services.facebook.id);
	    });

		var unknownMessages = Messages.find({$or: [{$and: [{'from': String(Meteor.user().services.facebook.id), 'to': {$nin: friendIDsToIgnore}}]}, {$and: [{'from': {$nin: friendIDsToIgnore}, 'to': String(Meteor.user().services.facebook.id)}]}]}).fetch();
		//console.log("########################## this is the result of messages from unknown users: ");
		//console.log(unknownMessages.length);


		
		if(unknownMessages.length > 0)
		{
			unknownMessagingRecipients = [];
			_.each(unknownMessages, function(z){
				if(z.to !== String(Meteor.user().services.facebook.id) && _.isUndefined(_.findWhere(unknownMessagingRecipients, z.to)))
					unknownMessagingRecipients.push(z.to);
				else if(z.from !== String(Meteor.user().services.facebook.id) && _.isUndefined(_.findWhere(unknownMessagingRecipients, z.from)))
					unknownMessagingRecipients.push(z.from);
			});

			//console.log("####################### this is the list of UNKNOWN recipients:");
			//console.log(unknownMessagingRecipients);

			Meteor.call('getFriendData', unknownMessagingRecipients, function(error, result) {
				if(error){
			        console.log(error.reason);
			    }
			    else{
			    	//console.log('REVIEW EXISTING SUCCESS: ');
			    	//console.log(result);
			    	Session.set(Meteor.user()._id + '_allUnknownMessagingUsers', result);
			    	unknownUsersLoaded.set(true);
			    	//Session.set('friendCount', result.length);
			    }
			});
		}
	}

	//Session.set(Meteor.user()._id + '_allMessagingUsers', possibleMessagingRecipients);
}