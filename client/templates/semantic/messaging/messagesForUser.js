var messagingMasterContext = new ReactiveVar(null);
var currentlySelectedUser = new ReactiveVar(null);
var userMessagesLoaded = new ReactiveVar(false);

Template.messagesForUser.helpers({
	userSelected: function() {
		//if(!_.isNull(Session.get('selectedUserInMessagingList')))
		//console.log('############# currently user is selected or not: ');
		//console.log(currentlySelectedUser.get());
		if(!_.isNull(Meteor.user()) && !_.isUndefined(Meteor.user()))
		{
			if(!_.isNull(currentlySelectedUser.get()) && !_.isUndefined(currentlySelectedUser.get()))
			{
				//console.log('########### user is selected!!!!');
				return true;
			}
			else
			{
				//console.log('$$$$$$$$$$$$$$$ user is not selected!!!!');
				return false;
			}
		}
		else
		{
			//console.log('%%%%%%%%%%%% user IS Not selected; meteor user is not even ready yet!!!');
			return false;
		}
	},
	selectedUser: function() {
		//if(!_.isNull(Session.get('selectedUserInMessagingList')))
		if(!_.isNull(currentlySelectedUser.get()) && !_.isUndefined(currentlySelectedUser.get()))
		{
			//currentlySelectedUser.set(Session.get('selectedUserInMessagingList'));
			//return Session.get('selectedUserInMessagingList');
			return currentlySelectedUser.get();
		}
	},
	navigateToMessageRootIfDirectlyNavigatedToThread: function() {
		//console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ going to select user from list!!!");
		navigateToMessagesRootIfDirectlyNavigatedToMessageThread(false);
	},
	messagesWithCurrentlySelectedUser: function() {
		if(!_.isNull(Meteor.user()) && !_.isUndefined(Meteor.user()))
		{
			if(!_.isNull(currentlySelectedUser.get()) && !_.isUndefined(currentlySelectedUser.get()))
			{
				return Messages.find({$or: [{$and: [{'from': Meteor.user().services.facebook.id, 'to': currentlySelectedUser.get().services.facebook.id}]}, {$and: [{'from': currentlySelectedUser.get().services.facebook.id, 'to': Meteor.user().services.facebook.id}]}]}, {sort: { 'timestamp': 1 }});
			}			
		}
    },
    messagesLoaded: function() {
    	return userMessagesLoaded.get();
    },
    hasMessages: function() {
        if(!_.isNull(Meteor.user()) && !_.isUndefined(Meteor.user()))
		{
			if(!_.isNull(currentlySelectedUser.get()) && !_.isUndefined(currentlySelectedUser.get()))
			{
				return Messages.find({$or: [{$and: [{'from': Meteor.user().services.facebook.id, 'to': currentlySelectedUser.get().services.facebook.id}]}, {$and: [{'from': currentlySelectedUser.get().services.facebook.id, 'to': Meteor.user().services.facebook.id}]}]}, {sort: { 'timestamp': 1 }}).count() > 0;
			}
			else
				return false;			
		}
		else
			return false;
    },
    messageIsFromCurrentLoggedInUser: function() {
    	if(!_.isNull(Meteor.user()) && !_.isUndefined(Meteor.user()))
		{
	        if(this.from === Meteor.user().services.facebook.id)
	            return true;
	        else
	            return false;
    	}
    	return false;
    },

    formattedTimestamp: function() {
        return new moment(this.timestamp * 1000).fromNow();
    },

    userImageForThisMessage: function() {
        return 'https://graph.facebook.com/'+this.from+'/picture?type=square';
    },
    firstNameFromName: function() {
      return this.fromName.split(' ')[0];
    }
});

Template.messagesForUser.onRendered(function () {
  if(Meteor.user() && !_.isUndefined(Meteor.user().services) && !_.isUndefined(Meteor.user().services.facebook))
  {
    amplitude.logEvent("loaded messages page");
	ga('send', {
	      hitType: 'event',
	      eventCategory: 'messages page',
	      eventAction: 'loaded messages page'
	  });
  }
});

Template.messagesForUser.onCreated(function() {
	var self = this;
	self.autorun(function() {
		FlowRouter.watchPathChange();
	    var context = FlowRouter.current();
	    messagingMasterContext.set(context);
	    if(!_.isNull(Meteor.user()) && !_.isUndefined(Meteor.user()))
	    {

	    	if(!_.isUndefined(messagingMasterContext.get().params._id))
	    	{
	    		//console.log('gonna check validity of user now!!!!!!!!!!');
		    	var partOfKnownMessagingUsers = _.findWhere(Session.get(Meteor.user()._id + '_allMessagingUsers'), {_id:String(messagingMasterContext.get().params._id)})
		    	//console.log(partOfKnownMessagingUsers);
		    	if(!_.isUndefined(partOfKnownMessagingUsers))
		    	{
		    		//console.log("PAAAAAAAAAART OF known messaging users!!!!");
		    		Session.set('skuser', true);
		    	}

		    	var partOfUnknownMessagingUsers = _.findWhere(Session.get(Meteor.user()._id + '_allUnknownMessagingUsers'), {_id:String(messagingMasterContext.get().params._id)})
		    	//console.log(partOfUnknownMessagingUsers);
		    	if(!_.isUndefined(partOfUnknownMessagingUsers))
		    	{
		    		//console.log("PAAAAAAAAAART OF Unknowwwwwwwwwwwn messaging users!!!!");
		    		Session.set('sukuser', true);
		    	}

		    	if(!Session.get('skuser') && !Session.get('sukuser'))
		    	{
		    		//console.log('NOOOOOOOOOOOOOOOOT A VALID USERRRRR NAVIGATE TO MESSAGES ROOOOOOOOOOOT!!!!!');
		    		navigateToMessagesRootIfDirectlyNavigatedToMessageThread(true);
		    	}
	    	}
	    	/*else
	    		console.log('no message thread requested!!!');*/
	    	


	    	if(Session.get('skuser'))//selected known user
	    	{ 
	    		//console.log('#################### known user is selecteddddd');
		    	var x = _.findWhere(Session.get(Meteor.user()._id + '_allMessagingUsers'), {_id:String(messagingMasterContext.get().params._id)})
		    	currentlySelectedUser.set(x);
			    if(!_.isNull(currentlySelectedUser.get()) && !_.isUndefined(currentlySelectedUser.get()) && !_.isUndefined(Meteor.user().services) && !_.isUndefined(Meteor.user().services.facebook))
			    {
			    	self.subscribe('messagesBetweenYouAndOtherUser', Meteor.user().services.facebook.id, currentlySelectedUser.get().services.facebook.id, {onReady: userMsgsLoaded});
			    }
			}
			else if(Session.get('sukuser'))
			{
				//console.log('#################### UNKNOWWWWWWWN user is selecteddddd');
				var x = _.findWhere(Session.get(Meteor.user()._id + '_allUnknownMessagingUsers'), {_id:String(messagingMasterContext.get().params._id)})
		    	currentlySelectedUser.set(x);
			    if(!_.isNull(currentlySelectedUser.get()) && !_.isUndefined(currentlySelectedUser.get()) && !_.isUndefined(Meteor.user().services) && !_.isUndefined(Meteor.user().services.facebook))
			    {
			    	self.subscribe('messagesBetweenYouAndOtherUser', Meteor.user().services.facebook.id, currentlySelectedUser.get().services.facebook.id, {onReady: userMsgsLoaded});
			    }
			}
		}
		//selectUserInListIfDirectlyNavigatedToMessageThread();
	});
});

function userMsgsLoaded(){
	userMessagesLoaded.set(true);
	//console.log('################### this is the selected USER fb ID: ');
	//console.log(currentlySelectedUser.get().services.facebook.id);
	//console.log('MSGS are loaded now!!!!');
	//console.log('MSSSSSSSSSSSSG COUNT IS: ');
	//console.log(Messages.find({$or: [{$and: [{'from': Meteor.user().services.facebook.id, 'to': currentlySelectedUser.get().services.facebook.id}]}, {$and: [{'from': currentlySelectedUser.get().services.facebook.id, 'to': Meteor.user().services.facebook.id}]}]}, {sort: { 'timestamp': 1 }}).count());
	animateToBottomOfChat();
	markUnreadMsgsAsReadAfterMessageThreadIsActive();
}

function markUnreadMsgsAsReadAfterMessageThreadIsActive() {
	if(!_.isNull(Meteor.user()) && !_.isUndefined(Meteor.user()))
	{
		if(!_.isNull(currentlySelectedUser.get()) && !_.isUndefined(currentlySelectedUser.get()))
		{
			var unreadMSGS = Messages.find({'from': currentlySelectedUser.get().services.facebook.id, 'to': Meteor.user().services.facebook.id, 'read': false}, {fields: {_id: 1}, sort: { 'timestamp': 1 }}).fetch();
			//console.log("############ this is the unreadmsg count!!!!");
			//console.log(unreadMSGS);
			if(unreadMSGS.length > 0)
			{
				_.each(unreadMSGS, function(z){
					Meteor.call('markMessageAsRead', z._id);
				})
			}
		}			
	}
}

function navigateToMessagesRootIfDirectlyNavigatedToMessageThread(bypass){
	
	if((!_.isNull(currentlySelectedUser.get()) && !_.isUndefined(currentlySelectedUser.get()) && _.isNull(Session.get('selectedUserInMessagingList'))) || bypass)
	{
		//console.log('user has been loaded via router but not been selected in list;');
		//console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&7 going to navigate back to mesages rooooot!!!');
		FlowRouter.go('/messages');
		//console.log(String(currentlySelectedUser.get()._id));
		/*console.log("################## this is the user list item: ");
		var slctor = "."+String(currentlySelectedUser.get()._id);
		console.log($(slctor));
		$(slctor)[0].click();*/
		//$("a[data="+String(currentlySelectedUser.get()._id)+"]").addClass('active selectedUserInMessagingList');
	}
}

Template.messagesForUser.events({
    "click #master-btn-sendMessage": function(event) {
    	//console.log('CLICKED SEND BUTTON!!!');
    	var messageRecipient = currentlySelectedUser.get().services.facebook.id;
    	var messageRecipientID = currentlySelectedUser.get()._id;
    	var sender = Meteor.user().services.facebook.id;
    	var senderName = Meteor.user().profile.name;
    	var senderProfileID = Meteor.user()._id;
    	var timestamp = new moment().unix();
    	var content = $('#master-input-chatMessage').val().trim();
    	if(!_.isEmpty(content)) //sanity check to see that user selected is the user being sent to 
    	{
    		//console.log('NO GOLMAAAL; will send message!');
    		Meteor.call('insertNewArtistGenreGroupMessage', sender, senderName, senderProfileID, messageRecipient, timestamp, content, function(error,result){
			    if(error){
			    	toastr.error(error.reason);
			    }
			    else{
                    // do something with result
                    //toastr.success('Message successfully sent!');
                    $('#master-input-chatMessage').val("");
                    amplitude.logEvent('sent message from messaging page', {
                    	from: Meteor.user().services.facebook.id,
				        to: currentlySelectedUser.get().services.facebook.id
				      });
                    ga('send', {
					      hitType: 'event',
					      eventCategory: 'messages page',
					      eventAction: 'sent message from messaging page'
					  });
                    //$('#chatbox').animate({scrollTop: $('#chatbox').get(0).scrollHeight}, 500); //auto scroll to bottom of chat window
                    /*if(messageRecipientID === messagingMasterContext.get().context.params._id)
                    {
                        Meteor.call('markMessageAsRead', result);
                    }*/
                    Meteor.setTimeout(animateToBottomOfChat, 100);
			    }
			});
    	}
    	else if(_.isEmpty(content)) //if input box had blank spaces, reset it
    	{
    		$('#master-input-chatMessage').val("");
    	}
    },
    "keydown #master-input-chatMessage": function(event) {
    	//console.log('this is the KEYDOWN event');
    	//console.log(event);
    	if(event.keyCode === 13) //hit enter
    	{
            //console.log("GOING TO send messsagge!! CLICKING button!!!!");
    		$("#master-btn-sendMessage").click();
    	}
    },
    "focus #master-input-chatMessage": function(event){
    	Meteor.setTimeout(animateToBottomOfChat, 100);
    	markUnreadMsgsAsReadAfterMessageThreadIsActive();
    }
});

function animateToBottomOfChat() {
    $('.masterMessages').animate({ scrollTop: $('.masterMessages')[0].scrollHeight}, 500);
}