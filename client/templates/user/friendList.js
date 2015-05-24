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

