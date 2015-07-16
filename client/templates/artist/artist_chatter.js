Template.artistChatter.rendered = function() {
	Session.set(Meteor.user()._id + '_allMessagingUsers', null);
	Session.set(Meteor.user()._id + '_oneSidedFollowers', null);
	//getAllPossibleUsersForMessaging();
	//getOneSidedFollowers();
	//Session.set('convSelected', false);
	//Session.set('cr', Router.current().params._name+"_page_group"); //current recipient
	Meteor.subscribe('messages', Router.current().params._name+"_artist_group"); //subscribe to messages for this artist page
};

Template.artistChatter.helpers({
	userList: function() 
	{
		return Session.get(Meteor.user()._id + '_allMessagingUsers');
	},

	oneSidedFollowerList: function() 
	{
		return Session.get(Meteor.user()._id + '_oneSidedFollowers');
	},

	userHasOneSidedFollowers: function()
	{
		if(!_.isUndefined(Meteor.user()))
		{
			//console.log('THIS IS THE one sided follower list: ');
			//console.log(Session.get(Meteor.user()._id + '_oneSidedFollowers'));
			return !_.isEmpty(Session.get(Meteor.user()._id + '_oneSidedFollowers'))
		}
	},

	messages: function()
	{
		//console.log('IN MESSAGES STUFF!');
		var artistPage = Router.current().params._name+"_artist_group";
		if(!_.isNull(artistPage))
		{
			var currentMsgs = Messages.find({'to': String(artistPage)}, {sort: { 'timestamp': 1 }});
			//console.log('THIS IS THE RESULT OF MESSAGES:');
			//console.log(currentMsgs.fetch());
			return currentMsgs;
		}
		else
		{
			//console.log('NO RECIPIENT SELECTED SO FAR!');
			return [];
		}
	},

	formattedTimestamp: function() {
		if(this.to === Router.current().params._name+"_artist_group")
		{
			Meteor.call('markMessageAsRead', this._id);
		}
		return new moment(this.timestamp * 1000).calendar();
	},

	messageIsFromCurrentLoggedInUser: function() {
		if(this.from === Meteor.user().services.facebook.id)
			return true;
		else
			return false;
	},

	userImageForThisMessage: function() {
		return 'http://graph.facebook.com/'+this.from+'/picture?type=square';
	},
	messageCountPerUser: function(isFriend) {
		if(isFriend) //for friends and tastemakers
		{
			if(!_.isNull(Session.get(Meteor.user()._id + '_allMessagingUsers')))
			{
				//console.log('INSIDE FIRST if condition');
				//var y = _.findWhere(Session.get(Meteor.user()._id + '_allMessagingUsers'), {'_id': String(this._id)});
				//console.log('THIS IS THE RESULT OF THE FIND WHERE: ');
				//console.log(y);
				if(!_.isUndefined(_.findWhere(Session.get(Meteor.user()._id + '_allMessagingUsers'), {'_id': String(this._id)})))
				{
					//console.log('INSIDE SECOND if condition');
					var x = Messages.find({'from': String(this.services.facebook.id), 'read': false}).fetch();
					//console.log('THIS IS THE RESULT UNREAD:');
					//console.log(x);
					if(x.length > 0)
					{
						//var s = new buzz.sound('/sounds/laser.ogg');
						//s.play();
						return '<span class="badge badge-error" style="margin-right:50px">'+x.length+'</span>'
					}
					else
						return '';
				}
			}
		}
		else //for onesided followers
		{
			if(!_.isNull(Session.get(Meteor.user()._id + '_oneSidedFollowers')))
			{
				if(!_.isUndefined(_.findWhere(Session.get(Meteor.user()._id + '_oneSidedFollowers'), {'_id': String(this._id)})))
				{
					//console.log('INSIDE SECOND if condition');
					var x = Messages.find({'from': String(this.services.facebook.id), 'read': false}).fetch();
					//console.log('THIS IS THE RESULT UNREAD:');
					//console.log(x);
					if(x.length > 0)
					{
						//var s = new buzz.sound('/sounds/laser.ogg');
						//s.play();
						return '<span class="badge badge-error" style="margin-right:50px">'+x.length+'</span>'
					}
					else
						return '';
				}
			}
		}
	},
	artistName: function() {
		return Router.current().params._name;
	}
});

Template.artistChatter.events({
    "click #btn-sendMessage": function(event) {
    	//console.log('CLICKED SEND BUTTON!!!');
    	var artistChatterGroup = Router.current().params._name+"_artist_group";
    	var sender = Meteor.user().services.facebook.id;
    	var senderName = Meteor.user().profile.name;
    	var senderProfileID = Meteor.user()._id;
    	var timestamp = new moment().unix();
    	var content = $('#input-chatMessage').val().trim();
    	if(!_.isEmpty(content)) //sanity check to see that user selected is the user being sent to 
    	{
    		//console.log('NO GOLMAAAL; will send message!');
    		Meteor.call('insertNewArtistGroupMessage', sender, senderName, senderProfileID, artistChatterGroup, timestamp, content, function(error,result){
			    if(error){
			    	toastr.error(error.reason);
			    }
			    else{
			      // do something with result
			      //toastr.success('Message successfully sent!');
			      $('#input-chatMessage').val("");
			      //$('#chatbox').animate({scrollTop: $('#chatbox').get(0).scrollHeight}, 500); //auto scroll to bottom of chat window
			      Meteor.setTimeout(animateToBottomOfChat, 100);
			    }
			});
    	}
    	else if(_.isEmpty(content)) //if input box had blank spaces, reset it
    	{
    		$('#input-chatMessage').val("");
    	}
    },
    "keydown #input-chatMessage": function(event) {
    	//console.log('this is the KEYDOWN event');
    	//console.log(event);
    	if(event.keyCode === 13) //hit enter
    	{
    		$("#btn-sendMessage").click();
    	}
    },
    "focus #input-chatMessage": function(event){
    	Meteor.setTimeout(animateToBottomOfChat, 100);
    }
});

function animateToBottomOfChat() {
	//console.log('THIS IS THE chatbox last: ');
    //console.log($('#chatbox').find('.message').last()[0]);
	$("#chatbox").animate({ scrollTop: $("#chatbox")[0].scrollHeight}, 500);
}