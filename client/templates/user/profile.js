Template.profile.helpers({

	userObjectForRoute: function() {
		getUserForRouting();
		var x = Session.get(Router.current().params._id+'_uObj')
		//console.log('THIS IS THE USER FOUND FOR: ');
		//console.log(x);
		return x;
	},

	isUserAFBFriend: function() {
		var userObj = Session.get(Router.current().params._id+'_uObj')
		var userIsAFriend = !_.isUndefined(_.findWhere(Meteor.user().fbFriends, {fbid: userObj.services.facebook.id}));
		//console.log('USER IS A FRIEND!!!!!: ' + userIsAFriend);
    	if(userIsAFriend)
    		return '<i class="fa fa-facebook-official"></i> friend<br><br>';
	},

	fbFriendCount: function() {
		if(!_.isUndefined(Meteor.user().fbFriends))
		{
			if(Meteor.user().fbFriends.length > 1 || Meteor.user().fbFriends.length === 0)
				return Meteor.user().fbFriends.length + ' <a href="/friends"><i class="fa fa-facebook-official"></i> friends</a><br><br>';
			else
				return Meteor.user().fbFriends.length + ' <a href="/friends"><i class="fa fa-facebook-official"></i> friend</a><br><br>';
		}
		else
			return 'None of your <i class="fa fa-facebook-official"></i> friends have joined yet!<br><br>';
	},

	alreadyFollowed: function() {
		var x = Session.get(Router.current().params._id+'_uObj')
		if(_.isUndefined(_.findWhere(Meteor.user().tastemakers, {'fbid': x.services.facebook.id})))
			return false;
		else
			return true;
	},

	followerCount: function() {
		var x = Session.get(Router.current().params._id+'_followerCount');
		if(x === 0)
			return "<h2><strong>"+x+"</strong></h2><p><small>Followers</small></p>"
		else if(x === 1)
			return "<h2><strong>"+x+"</strong></h2><p><small>Follower</small></p>"
		else if(x > 1)
			return "<h2><strong>"+x+"</strong></h2><p><small>Followers</small></p>"
	},

	getFollowerCount: function() {
		var x = Session.get(Router.current().params._id+'_uObj');
		Meteor.call('getFollowerCount', x, function(error,result){
		    if(error){
		        console.log(error.reason);
		    }
		    else{
		        // do something with result
			  	Session.set(Router.current().params._id+'_followerCount',result);
		    };
		});
	},

	followingCount: function() {
		var x = Session.get(Router.current().params._id+'_uObj')
		if(!_.isUndefined(x.tastemakers))
			return "<h2><strong>"+x.tastemakers.length+"</strong></h2><p><small>Following</small></p>";
		else
			return "<h2><strong>0</strong></h2><p><small>Following</small></p>";
	},

	memberSince: function(createdDate) {
		return new moment(createdDate).format('llll');
	},

	lastActivity: function() {
		var userLh = Session.get(Router.current().params._id+'_lh');
		if(!_.isUndefined(userLh) && !_.isUndefined(userLh[0]))
			return new moment(userLh[0].timestamp).calendar();
	},

	personalSongCount: function(uid) {
		var c = Songs.find({$and: [{'sharedBy.uid': uid}, {$or: [{'iTunesValid': 'VALID'},{'LFMValid': 'VALID'},{manualApproval:'VALID'}]}]}).fetch();
		if(!_.isUndefined(c))
			return c.length;
		else
			return 0;	
	},

	ratingCount: function(uid) {
		var r = Session.get(Router.current().params._id+'personalRC');
	  	Meteor.call('getRatingCountForUser', uid, function(error,result){
		    if(error){
		        console.log(error.reason);
		    }
		    else{
		        // do something with result
			  	Session.set(Router.current().params._id+'personalRC',result);
		    };
		});
		if(!_.isUndefined(r))
			return r;
		else
			return 0;
	},

	topTenBands: function(uid) {
		var b = Songs.find({$and: [{'sharedBy.uid': uid}, {$or: [{'iTunesValid': 'VALID'},{'LFMValid': 'VALID'}]}]}, {fields: {'sa':1}}).fetch();
		var t = _.chain(b).countBy("sa").pairs().sortBy(function(pair) {return -pair[1];}).first(10).pluck(0).value();
		var topTenb = [];
		_.chain(t).map(function(value){topTenb.push({'sa': value})});
		//console.log(topTen);
		Session.set(Router.current().params._id+'topBandsLength', topTenb.length);
		return topTenb;
	},

	topBandLength: function() {
		return Session.get(Router.current().params._id+'topBandsLength');
	},

	topTenGenres: function(uid) {
		var g = Songs.find({$and: [{'sharedBy.uid': uid}, {$or: [{'iTunesValid': 'VALID'},{'LFMValid': 'VALID'}]}]}, {fields: {'genre':1}}).fetch();
		var t = _.chain(g).countBy("genre").pairs().sortBy(function(pair) {return -pair[1];}).pluck(0).value();//.first(20).pluck(0).value();
		var topTeng = [];
		//console.log(t);
		var gCounter = 0;
		_.chain(t).map(function(value){if(value !== 'undefined' && gCounter < 10){gCounter++;topTeng.push({'genre': value})}});
		//console.log(topTeng);
		Session.set(Router.current().params._id+'topGenresLength', topTeng.length);
		return topTeng;
	},

	topGenreLength: function() {
		return Session.get(Router.current().params._id+'topGenresLength');
	},

	userProfileIsNotYou: function() {
		return Router.current().params._id !== Meteor.user()._id;
	},
	userIsKing: function() {
		return isUserKing();
	}
});

Template.profile.events({
    "click #unfollowUser": function (event) {
      var userObj = Session.get(Router.current().params._id+'_uObj')
      var isUserAFriend = !_.isUndefined(_.findWhere(Meteor.user().fbFriends, {fbid: userObj.services.facebook.id}));

      //console.log('UNFOLLOW user button clicked!');
      //console.log('and this user is a friend: ' + isUserAFriend);

      Meteor.call('unfollowUser', userObj, isUserAFriend, function(error,result){
		    if(error){
		        console.log(error.reason);
		    }
		    else{
		        // do something with result
			  	//console.log('SUCCESSFULLY unfollowed user!');
		    };
		});
      return true;
    },
    "click #followUser": function (event) {
      var userObj = Session.get(Router.current().params._id+'_uObj')
      var isUserAFriend = !_.isUndefined(_.findWhere(Meteor.user().fbFriends, {fbid: userObj.services.facebook.id}));

      //console.log('Follow user button clicked!');
      //console.log('and this user is a friend: ' + isUserAFriend);

      Meteor.call('followUser', userObj, isUserAFriend, function(error,result){
		    if(error){
		        console.log(error.reason);
		    }
		    else{
		        // do something with result
			  	//console.log('SUCCESSFULLY followed user!');
		    };
		});
      return true;
    }

  });

function getUserForRouting()
{
	Meteor.call('findUserForRouting', Router.current().params._id, function(error,result){
	    if(error){
	        console.log(error.reason);
	    }
	    else{
	        // do something with result
	      //console.log('GOT THIS BACK ' );
	      //console.log(result);
	      Session.set(Router.current().params._id+'_uObj', result);
	    }
	});
}

function isUserProfileYou()
{
	return Router.current().params._id === Meteor.user()._id;
}

function isUserKing()
{
	//return ((Meteor.user().services.facebook.id === '721431527969807') && isUserProfileYou()) ; // only check with Sandeep's FB ID
	return ((Meteor.user().services.facebook.email === 'reverieandreflection@gmail.com') && isUserProfileYou()) ; // only check with Sandeep's FB email id
}