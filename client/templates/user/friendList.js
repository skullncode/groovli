Template.friendList.helpers({
	getUD: function()
	{
		getAllFriends();
	},

	userData: function() 
	{
		return Session.get('friendData');
	},

	userCount: function()
	{
		return Session.get('friendCount');
	},
	memberSince: function() {
		return new moment(this.createdAt).format('llll');
	},
	lastLogin: function() {
		if(!_.isUndefined(this.status.lastLogin))
			return new moment(this.status.lastLogin.date).calendar();
	},
	statusClass: function() {
		var matchedUserObj = Meteor.users.find({'_id': this._id}).fetch();
		if(matchedUserObj.length > 0 && !_.isUndefined(matchedUserObj[0].status))
		{
			//console.log('in first condition');
			if (!_.isUndefined(matchedUserObj[0].status.idle) && matchedUserObj[0].status.idle)
				return "label-warning";
			else if (matchedUserObj[0].status.online)
				return "label-success";
			else
				return "label-default";
		}
		else
		{
			//console.log('in second condition');
			return "label-default";
		}
	},
	currentStatus: function() {
	    var userStatus = Meteor.users.find({'_id': this._id}).fetch();
	    //console.log(userStatus);
        if(userStatus.length > 0)
        {
        	if(userStatus[0].status.online)
        		return 'Online';
        	else
        		return 'Offline';
        }
        else
        	return 'Offline';
	},
	retrieveStoryCount: function() {

	},
	storyCount: function(){
		return Session.get(services.facebook.id+'_storyCount');
	},
	songCount: function() {
		var x = Songs.find({'sharedBy.uid': String(this.services.facebook.id)}).fetch();
		//console.log('SONG LENGTH : ' + x.length);
		return x.length;
	},
	getTotalListenCountForUser: function(uid) {
		
		Meteor.call('getTotalListenHistoryCountForUser', uid, function(error,result){
		    if(error){
		        console.log(error.reason);
		    }
		    else{
		        // do something with result
			  	//console.log('SUCCESSFULLY got listen count user!');
			  	//console.log(result);
			  	Session.set(uid+'_lhCount', result);
		    };
		});
	},
	listenCount: function()
	{
		return Session.get(this._id+'_lhCount');
	},
	alreadyFollowed: function() {
		Session.set(this._id+'_uObj', this);
		if(_.isUndefined(_.findWhere(Meteor.user().tastemakers, {'fbid': this.services.facebook.id})))
			return false;
		else
			return true;
	}
});

Template.friendList.events({
    "click #unfollowUser": function (event) {
		console.log('UNFOLLOW user button clicked!');
		//console.log(event);
		var x = $(event.currentTarget.parentElement.parentElement).find('#friendProfileLink').prop('href');
		var beginOfProfileID = x.indexOf('profile/') + 8; //length of 'profile/'
		var profileId = x.substring(beginOfProfileID);

		var userObj = Session.get(profileId+'_uObj');
		var isUserAFriend = !_.isUndefined(_.findWhere(Meteor.user().fbFriends, {fbid: this.services.facebook.id}));

		//console.log('UNFOLLOW user button clicked!');
		//console.log('and this user is a friend: ' + isUserAFriend);

		Meteor.call('unfollowUser', userObj, isUserAFriend, function(error,result){
		    if(error){
		        console.log(error.reason);
		    }
		    else{
		        // do something with result
			  	console.log('SUCCESSFULLY unfollowed user!');
		    };
		});
		return true;
    },
    "click #followUser": function (event) {
		console.log('Follow user button clicked!');
		var x = $(event.currentTarget.parentElement.parentElement).find('#friendProfileLink').prop('href');
		var beginOfProfileID = x.indexOf('profile/') + 8; //length of 'profile/'
		var profileId = x.substring(beginOfProfileID);

		var userObj = Session.get(profileId+'_uObj');
		var isUserAFriend = !_.isUndefined(_.findWhere(Meteor.user().fbFriends, {fbid: this.services.facebook.id}));

		//console.log('and this user is a friend: ' + isUserAFriend);

		Meteor.call('followUser', userObj, isUserAFriend, function(error,result){
		    if(error){
		        console.log(error.reason);
		    }
		    else{
		        // do something with result
			  	console.log('SUCCESSFULLY followed user!');
		    };
		});
		return true;
    }
});



function getAllFriends()
{
	var fList = [];
	_.each(Meteor.user().fbFriends, function(x) {
		fList.push(String(x.fbid));
	});
	Meteor.call('getFriendData', fList, function(error, result) {
		if(error){
	        console.log(error.reason);
	    }
	    else{
	    	//console.log('REVIEW EXISTING SUCCESS: ');
	    	//console.log(result);
	    	Session.set('friendData', result);
	    	Session.set('friendCount', result.length);
	    }
	});
}