var localTopTenB;

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

	locationDetailsExist: function() {
		if(!_.isUndefined(Session.get(Router.current().params._id+'_uObj').baseLocation))
			return true;
		else
			return false;
	},

	locationCountry: function() {
		if(!_.isUndefined(Session.get(Router.current().params._id+'_uObj').baseLocation))
			return Session.get(Router.current().params._id+'_uObj').baseLocation.country;
		else
			return 'Unknown'
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
		var b = Songs.find({$and: [{'sharedBy.uid': uid}, {$or: [{'iTunesValid': 'VALID'},{'LFMValid': 'VALID'},{'manualApproval':'VALID'}]}]}, {fields: {'sa':1}}).fetch();
		//console.log('FOUND THESE SONGS:');
		//console.log(b);
		var t = _.chain(b).countBy("sa").pairs().sortBy(function(pair) {return -pair[1];}).first(10).pluck(0).value();
		var topTenb = [];
		_.chain(t).map(function(value){topTenb.push({'sa': value})});
		//console.log(topTen);
		Session.set(Router.current().params._id+'topBandsLength', topTenb.length);
		localTopTenB = topTenb;  
		return topTenb;
	},

	validatedTop10Band: function() {
		var cleaned = this.sa.replace(',', ' ');
		//cleaned = cleaned.replace(' . ', ' '); doesn't work with S. Carey
		cleaned = cleaned.replace(/\s{2,}/g, ' ');
		//replace ampersand with AND so that check works correctly
		if(cleaned.indexOf('&') >= 0)
		{
		  cleaned = cleaned.replace(/&/g, 'and');
		}
		doesArtistHavePage(cleaned);
		if(Session.get(cleaned+'_hasPage'))
		  return '<a href="/artist/'+cleaned+'"><span class="btn btn-info btn-xs" data-toggle="tooltip" data-placement="top" title="'+cleaned+' page""><b>'+cleaned+'</b></span></a>';
		else
		  return '<span class="btn btn-default btn-xs" data-toggle="tooltip" data-placement="top" title="No music of this artist has been brought into Groovli yet; be the first! Share some music of '+cleaned+'!">'+cleaned+'</span>';
	},

	topBandLength: function() {
		return Session.get(Router.current().params._id+'topBandsLength');
	},

	topTenGenres: function() {
		/*OLD VERSION OF GETTING TOP 10 GENRES
		var g = Songs.find({$and: [{'sharedBy.uid': uid}, {$or: [{'iTunesValid': 'VALID'},{'LFMValid': 'VALID'},{'manualApproval':'VALID'}]}]}, {fields: {'genre':1}}).fetch();
		var t = _.chain(g).countBy("genre").pairs().sortBy(function(pair) {return -pair[1];}).pluck(0).value();//.first(20).pluck(0).value();
		//console.log('these are the top ten bands');
		//console.log(localTopTenB);
		var topTeng = [];
		//console.log(t);
		var gCounter = 0;
		_.chain(t).map(function(value){if(value !== 'undefined' && gCounter < 10){gCounter++;topTeng.push({'genre': value})}});
		//console.log(topTeng);

		Session.set(Router.current().params._id+'topGenresLength', topTeng.length);
		return topTeng;*/

		var topTeng = [];
		var currentGenre = '';
		_.each(localTopTenB, function(z){
			var artName = z.sa;
			if(artName.indexOf('&') >= 0)
			{
				artName = artName.replace(/&/g, 'and');
			}

			var x = Artists.findOne({'name': {$regex: new RegExp('^' + artName + '$', 'i')}});
			
			if(!_.isUndefined(x) && !_.isUndefined(x.genres))
			{
				if(!_.isUndefined(x.genres[0]) && _.isUndefined(_.findWhere(topTeng, {'genre': x.genres[0]})) && x.genres[0]!== 'all' && x.genres[0] !== 'under 2000 listeners')
				{
					//console.log('FOUND THIS ARTIST GENRE and pushing this: ');
					//console.log(x.genres[0]);
					if(!_.isNull(x.genres[0]))
					{
						currentGenre = x.genres[0].replace(/-/g, ' ');
		        		currentGenre = currentGenre.replace(/'n'/g, ' and ');
						topTeng.push({'genre': currentGenre});
					}
				}
				else if(!_.isUndefined(x.genres[1]) && !_.contains(topTeng, x.genres[1]) && x.genres[1]!== 'all' && x.genres[1] !== 'under 2000 listeners')
				{
					//console.log('FOUND THIS ARTIST GENRE and pushing this: ');
					//console.log(x.genres[1]);
					if(!_.isNull(x.genres[1]))
					{
						currentGenre = x.genres[1].replace(/-/g, ' ');
		        		currentGenre = currentGenre.replace(/'n'/g, ' and ');
						topTeng.push({'genre': currentGenre});
					}
				}
				else if(!_.isUndefined(x.genres[2]) && !_.contains(topTeng, x.genres[2]) && x.genres[2]!== 'all' && x.genres[2] !== 'under 2000 listeners')
				{
					//console.log('FOUND THIS ARTIST GENRE and pushing this: ');
					//console.log(x.genres[2]);
					if(!_.isNull(x.genres[2]))
					{
						currentGenre = x.genres[2].replace(/-/g, ' ');
		        		currentGenre = currentGenre.replace(/'n'/g, ' and ');
						topTeng.push({'genre': currentGenre});
					}
				}
				else if(!_.isUndefined(x.genres[3]) && !_.contains(topTeng, x.genres[3]) && x.genres[3]!== 'all' && x.genres[3] !== 'under 2000 listeners')
				{
					//console.log('FOUND THIS ARTIST GENRE and pushing this: ');
					//console.log(x.genres[3]);
					if(!_.isNull(x.genres[3]))
					{
						currentGenre = x.genres[3].replace(/-/g, ' ');
		        		currentGenre = currentGenre.replace(/'n'/g, ' and ');
						topTeng.push({'genre': currentGenre});
					}
				}
			}
			else
			{
				//console.log('Didnt find anything for this artist: ');
				//console.log(x);
			}	
		});

		//console.log('THI SIS THE TOP TEN GENRES: ');
		//console.log(topTeng);

		return topTeng;		
	},
	getTotalListenCountForUser: function() {
		
		Meteor.call('getTotalListenHistoryCountForUser', Router.current().params._id, function(error,result){
		    if(error){
		        console.log(error.reason);
		    }
		    else{
		        // do something with result
			  	//console.log('SUCCESSFULLY got listen count user!');
			  	//console.log(result);
			  	Session.set(Router.current().params._id+'_lhCount', result);
		    };
		});
	},
	listenCount: function()
	{
		var x = Session.get(Router.current().params._id+'_lhCount');
		if(x > 0)
			return "<h2><strong>"+x+"</strong></h2><p><small>listens</small></p>";
		else if(x === 1)
			return "<h2><strong>1</strong></h2><p><small>listen</small></p>";
		else
			return "<h2><strong>0</strong></h2><p><small>listens</small></p>";
	},

	/*topGenreLength: function() {
		return Session.get(Router.current().params._id+'topGenresLength');
	},*/

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

function doesArtistHavePage(artName) {
  //console.log('CLIENT METHOD: SEARCHING TO SEE IF THIS SIMILAR ARTIST HAS A PAGE: ' + artName);
  Meteor.call('doesArtistHavePage', artName, function(error,result){
        if(error){
          console.log('Encountered error while trying to check if artist has page: ' + error)
        }
        else{
            // do something with result
          //console.log('received artist page result: ' + result);
          Session.set(artName+'_hasPage', result);
        };
    });
}