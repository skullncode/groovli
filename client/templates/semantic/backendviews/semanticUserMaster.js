Template.semanticUserMaster.helpers({
	getUD: function()
	{
		getAllUsers();
	},

	userData: function() 
	{
		return Session.get('masterud');
	},

	userCount: function()
	{
		return Session.get('masterudCount');
	},
	memberSince: function() {
		return new moment(this.createdAt).format('llll');
	},
	lastLogin: function() {
		if(!_.isUndefined(this.status.lastLogin))
			return new moment(this.status.lastLogin.date).calendar();
	},
	locationCountry: function() {
		//console.log('THIS IS THE LOCATION deets');
		//console.log(this.baseLocation);
		if(!_.isUndefined(this.baseLocation))
			return this.baseLocation.country;
		else
			return 'Unknown'
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
	storyCount: function(){
		return Session.get(services.facebook.id+'_storyCount');
	},
	songCount: function() {
		var x = Songs.find({'sharedBy.uid': String(this.services.facebook.id)}).fetch();
		//console.log('SONG LENGTH : ' + x.length);
		return x.length;
	}
});



function getAllUsers()
{
	Meteor.call('getMasterUserData', function(error, result) {
		if(error){
	        console.log(error.reason);
	    }
	    else{
	    	//console.log('REVIEW EXISTING SUCCESS: ');
	    	//console.log(result);
	    	Session.set('masterud', result);
	    	Session.set('masterudCount', result.length);
	    }
	});
}

