var userListLoaded = new ReactiveVar(false);

Template.semanticUserMaster.helpers({
	offlineUsers: function()
	{
		//return Meteor.users.find({},{sort: {'createdAt': -1}});
		return Meteor.users.find({ 'status.online': { $not: true } },{sort: {'createdAt': -1}});
	},

	onlineUsers: function()
	{
		//return Meteor.users.find({},{sort: {'createdAt': -1}});
		return Meteor.users.find({ 'status.online': true },{sort: {'createdAt': -1}});
	},

	userCount: function()
	{
		return Counts.get('counterForAllUsers');
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
	locationCity: function() {
		if(!_.isUndefined(this.baseLocation))
			return this.baseLocation.city;
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
        		return '<a class="ui green empty circular label"></a> Online';
        	else
        		return '<a class="ui grey empty circular label"></a> Offline';
        }
        else
        	return '<a class="ui grey empty circular label"></a> Offline';
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
	getSongCountForUser: function(fbid){
		
		Meteor.call('getSongCountWithFBID', fbid, function(error,result){
		    if(error){
		        console.log(error.reason);
		    }
		    else{
		        // do something with result
			  	//console.log('SUCCESSFULLY got listen count user!');
			  	//console.log(result);
			  	Session.set(fbid+'_sc', result);
		    };
		});
	},
	getStoryCountForUser: function(fbid){
		
		Meteor.call('getStoryCountForID', fbid, function(error,result){
		    if(error){
		        console.log(error.reason);
		    }
		    else{
		        // do something with result
			  	//console.log('SUCCESSFULLY got listen count user!');
			  	//console.log(result);
			  	Session.set(fbid+'_storyCount', result);
		    };
		});
	},
	currentCursorPosition: function() {
    	var x = Number(Session.get('_userCursor')) + 1;
    	var y = Number(Session.get('_userCursor')) + 10;
    	if(y > Counts.get('counterForAllUsers'))
    		y = Counts.get('counterForAllUsers');
    	return  x + '-' + y;
    },
	listenCount: function()
	{
		return Session.get(this._id+'_lhCount');
	},
	songCount: function() {
		//var x = Songs.find({'sharedBy.uid': String(this.services.facebook.id)}).fetch();
		//console.log('SONG LENGTH : ' + x.length);
		if(!_.isUndefined(this) && !_.isUndefined(this.services))
			return Session.get(this.services.facebook.id+'_sc');
		else
			return 0;
	},
	storyCount: function() {
		if(!_.isUndefined(this) && !_.isUndefined(this.services))
			return Session.get(this.services.facebook.id+'_storyCount');
		else
			return 0;
	},
	userListLoaded: function(){
		return userListLoaded.get();
	},
	userListDoesNotRequirePaging: function(){
		if(Counts.get('counterForAllUsers') <= 10)
			return true;
		else
			return false;
	},
	userIsAnAdmin: function() {
		if (!_.isNull(Meteor.user()) && !_.isUndefined(Meteor.user())) {
		    loggedInUser = Meteor.user();
		    isAdmin = Roles.userIsInRole(loggedInUser, ['admin']);
		    //console.log('IN admin check function!');
		    //console.log('THIS IS the user: ');
		    //console.log(loggedInUser);
		    if (!isAdmin && !_.isUndefined(loggedInUser.services) && !_.isUndefined(loggedInUser.services.facebook) && loggedInUser.services.facebook.email !== "reverieandreflection@gmail.com"){
		      //console.log('NOT AN ADMIN so routing back to root!!!!!');
		      FlowRouter.go('/');
		    }
		    else
		    {
		      //console.log('this person IS AN ADMIN so NOT DOING ANYTHING!!!!!');
		      return true;
		    }
		  }
		  else {
		      //console.log('user is null, so routing back to root!!!!!');
		      //console.log(Meteor.user());
		      FlowRouter.go('/');
		  }
	}
});


Template.semanticUserMaster.events({
    "click #previousUsers": function (event) {
      //console.log('CLICKED PREVIOUS button');
      if(Number(Session.get('_userCursor')) > 9)
      {
        //console.log('INSIDE if condition!!');
        userListLoaded.set(false);
        Session.set('_userCursor', Number(Session.get('_userCursor')) - 10);
        //iHist(true);
        //resetPlayedLengthSpecificToTab('me');
      }
      else
      {
        toastr.info("Reached the beginning of the user list; <br><br><b><i>try moving forward (->) to see more users!</i></b><br><br>");
        //console.log('INSIDE else condition!!');
      }
    },

    "click #nextUsers": function (event) {
      //console.log('CLICKED next button');
      if(Number(Session.get('_userCursor')) < Number(Session.get('ucount') - 10))
      {
        //console.log('INSIDE if condition!!');
        userListLoaded.set(false);
        Session.set('_userCursor', Number(Session.get('_userCursor')) + 10);
        //iHist(true);
        //resetPlayedLengthSpecificToTab('me');
      }
      else
      {
        //console.log('INSIDE else condition!!');
        toastr.info("Reached the end of the user list; <br><br><b><i>try moving backwards (<-) to see more users!</i></b><br><br>");
      }
    }
});

Template.semanticUserMaster.onCreated(function() {
	var self = this;
	self.autorun(function() {
		FlowRouter.watchPathChange();
	    var context = FlowRouter.current();
	    // use context to access the URL state
	    //console.log('%%%%%%%%%%%%%%%%%%%% ROUTE HAS CHANGED!!!!');
	    //console.log(context);
	    //console.log("THIS IS THE PROFILE CONTEXT REACTIVE VAAAAAAAAAAAAAAAAAR: ");
	    //console.log(profileContext.get());
	    Session.setDefault('_userCursor', 0);

	    self.subscribe('masterUserData', Session.get('_userCursor'), {onReady: userSubLoaded});
		
		self.subscribe("masterUserCount", Meteor.user());
		Session.set('ucount', Counts.get('counterForAllUsers'));
	});
});

function userSubLoaded(){
	userListLoaded.set(true);
}