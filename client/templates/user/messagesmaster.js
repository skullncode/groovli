Template.messagesMaster.rendered = function() {
	Session.set(Meteor.user()._id + '_allMessagingUsers', null);
	Session.set(Meteor.user()._id + '_oneSidedFollowers', null);
	getAllPossibleUsersForMessaging();
	getOneSidedFollowers();
	Session.set('convSelected', false);
	Session.set('cr', null); //current recipient
};

Template.messagesMaster.helpers({
	userList: function() 
	{
		return Session.get(Meteor.user()._id + '_allMessagingUsers');
	},

	oneSidedFollowerList: function() 
	{
		return Session.get(Meteor.user()._id + '_oneSidedFollowers');
	},

	conversationSelected: function()
	{
		return Session.get('convSelected');
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
		var currentUser = Session.get('ud');
		var otherUser = Session.get('cr');
		if(!_.isNull(Session.get('cr')))
		{
			var currentMsgs = Messages.find({$or: [{$and: [{'from': String(currentUser)},{'to': String(otherUser)}]},{$and: [{'from': String(otherUser)},{'to': String(currentUser)}]}]}, {sort: { 'timestamp': 1 }});
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

		if(this.from === Session.get('cr'))
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
	currentStatus: function() {
	    var userStatus = Meteor.users.find({'_id': this._id}).fetch();
	    //console.log(userStatus);
	    var lastLogin = '';
	    if(!_.isUndefined(this.status) && !_.isUndefined(this.status.lastLogin))
			lastLogin =  new moment(this.status.lastLogin.date).calendar();
        if(userStatus.length > 0)
        {
        	if(userStatus[0].status.online)
        		return '<div class="online_status"></div>'
        	else
        		return '<i><p style="float:right" class="small">'+lastLogin+'</p></i>';
        }
        else
        	return '<i><p style="float:right" class="small">'+lastLogin+'</p></i>';
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
	}
});

function getOneSidedFollowers() {
	Meteor.call('getOneSidedFollowers', Meteor.user().services.facebook.id, function(error, result) {
		if(error){
	        console.log(error.reason);
	    }
	    else{
	    	//console.log('result of getOneSidedFollowers: ');
	    	//console.log(result);
	    	Session.set(Meteor.user()._id + '_oneSidedFollowers', result);
	    }
	});
}


function getAllPossibleUsersForMessaging() {
	var possibleMessagingRecipients = [];
	_.each(Meteor.user().fbFriends, function(x) {
		//var actualUserObj = 
		if(_.isUndefined(_.findWhere(possibleMessagingRecipients, {fbid: x.fbid})))
			possibleMessagingRecipients.push(String(x.fbid));
	});

	_.each(Meteor.user().tastemakers, function(x) {
		if(_.isUndefined(_.findWhere(possibleMessagingRecipients, {fbid: x.fbid})))
			possibleMessagingRecipients.push(String(x.fbid));
	});

	Meteor.call('getFriendData', possibleMessagingRecipients, function(error, result) {
		if(error){
	        console.log(error.reason);
	    }
	    else{
	    	//console.log('REVIEW EXISTING SUCCESS: ');
	    	//console.log(result);
	    	Session.set(Meteor.user()._id + '_allMessagingUsers', result);
	    	//Session.set('friendCount', result.length);
	    }
	});

	//Session.set(Meteor.user()._id + '_allMessagingUsers', possibleMessagingRecipients);
}

Template.messagesMaster.events({
    "click .list-group-item": function (event) {
      //console.log(event);
      $(event.currentTarget.parentElement).find('.active').removeClass('active');
      $(event.currentTarget).addClass('active');
      Session.set('convSelected', true);
      Session.set('cr', event.currentTarget.id);
      Meteor.setTimeout(animateToBottomOfChat, 100);		      
      return true;
    },

    "click #btn-sendMessage": function(event) {
    	//console.log('CLICKED SEND BUTTON!!!');
    	var currentSelectedRecipientFromUI =$('.list-group-item.active')[0].id;
    	var sender = Meteor.user().services.facebook.id;
    	var timestamp = new moment().unix();
    	var content = $('#input-chatMessage').val().trim();
    	if(currentSelectedRecipientFromUI === Session.get('cr') && !_.isEmpty(content)) //sanity check to see that user selected is the user being sent to 
    	{
    		//console.log('NO GOLMAAAL; will send message!');
    		Meteor.call('insertNewMessage', sender, currentSelectedRecipientFromUI, timestamp, content, function(error,result){
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