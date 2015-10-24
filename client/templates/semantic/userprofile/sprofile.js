var profileContext = new ReactiveVar(null);
var songTimeSpanLoaded = new ReactiveVar(false);
var listenCountLoaded = new ReactiveVar(false);
var ratingCountLoaded = new ReactiveVar(false);
var songCountLoaded = new ReactiveVar(false);
var pagedSongsLoaded = new ReactiveVar(false);

Template.sprofile.helpers({
	uObjLoaded: function() {
		return Session.get(profileContext.get().params._id+'_uObjLoaded');
	},
	userObjectForRoute: function() {
		/*getUserForRouting();
		var x = Session.get(Router.current().params._id+'_uObj')*/
		//console.log('THIS IS THE USER FOUND FOR: ');
		//console.log(x);
		//return x;
		return Session.get(profileContext.get().params._id+'_uObj');
	},

	isUserAFBFriend: function() {
		if(!_.isUndefined(Session.get(profileContext.get().params._id+'_uObj')))
		{
			var userObj = Session.get(profileContext.get().params._id+'_uObj')
			var userIsAFriend = !_.isUndefined(_.findWhere(Meteor.user().fbFriends, {fbid: userObj.services.facebook.id}));
			//console.log('USER IS A FRIEND!!!!!: ' + userIsAFriend);
	    	if(userIsAFriend)
	    		return '<i class="fa fa-facebook-official"></i> friend<br><br>';
    	}
	},

	userFirstName: function() {
		return Session.get(profileContext.get().params._id+'_uObj').services.facebook.first_name;
	},

	locationDetailsExist: function() {
		if(!_.isUndefined(Session.get(profileContext.get().params._id+'_uObj')) && !_.isUndefined(Session.get(Router.current().params._id+'_uObj').baseLocation))
			return true;
		else
			return false;
	},

	locationCountry: function() {
		if(!_.isUndefined(Session.get(profileContext.get().params._id+'_uObj')) && !_.isUndefined(Session.get(Router.current().params._id+'_uObj').baseLocation))
			return Session.get(profileContext.get().params._id+'_uObj').baseLocation.country;
		else
			return 'Unknown'
	},

	fbFriendCount: function() {
		if(!_.isUndefined(Meteor.user()) && !_.isUndefined(Meteor.user().fbFriends))
		{
			if(Meteor.user().fbFriends.length > 1 || Meteor.user().fbFriends.length === 0)
				return Meteor.user().fbFriends.length + ' <i class="fa fa-facebook-official"></i> friends';
			else
				return Meteor.user().fbFriends.length + ' <i class="fa fa-facebook-official"></i> friend';
		}
		else
			return 'None of your <i class="fa fa-facebook-official"></i> friends have joined yet!<br><br>';
	},

	alreadyFollowed: function() {
		if(!_.isUndefined(Session.get(profileContext.get().params._id+'_uObj')) && !_.isUndefined(Meteor.user()))
		{
			var x = Session.get(profileContext.get().params._id+'_uObj');
			if(_.isUndefined(_.findWhere(Meteor.user().tastemakers, {'fbid': x.services.facebook.id})))
				return false;
			else
				return true;
		}
	},

	favoriteCount: function() {
		//return Favorites.find({}).count();
		return Session.get(profileContext.get().params._id+'_faveCount');
	},

	hasFavorites: function() {
		if(Session.get(profileContext.get().params._id+'_faveCount') > 0)
		{
			return true;
		}
		else
			return false;
	},

	memberSince: function(createdDate) {
		//console.log('THIS IS THE MEMBER SINCE DATE: ');
		//console.log(createdDate);
		return new moment(createdDate).format('LL');
	},

	lastActivityExists: function(){
		if(!_.isEmpty(Session.get(profileContext.get().params._id+'_lh')))
		{
			return true;
		}
		else
		{
			return false;
		}
	},

	lastActivity: function() {
		var userLh = Session.get(profileContext.get().params._id+'_lh');
		if(!_.isUndefined(userLh) && !_.isUndefined(userLh[0]))
			return new moment(userLh[0].timestamp).calendar();
	},

	ratingCount: function(uid) {
		if(!_.isUndefined(Session.get(profileContext.get().params._id+'personalRC')))
			return Session.get(profileContext.get().params._id+'personalRC');
		else
			return 0;
	},

	getRatingCountForUser: function(){
		//ratingCountLoaded.set(false);
		Meteor.call('getRatingCountForUser', this.services.facebook.id, function(error,result){
		    if(error){
		        console.log(error.reason);
		    }
		    else{
		        // do something with result
			  	Session.set(profileContext.get().params._id+'personalRC',result);
			  	ratingCountLoaded.set(true);
		    };
		});
	},

	lowerCasedText: function(txtToLowerCase){
		return txtToLowerCase.toLowerCase();
	},

	topTenGenres: function() {
		return Session.get('ttg');
	},
	hasTopTenGenres: function() {
		if(_.isEmpty(Session.get('ttg')))
			return false;
		else
			return true;
	},
	getTotalListenCountForUser: function() {
		//listenCountLoaded.set(false);
		Meteor.call('getTotalListenHistoryCountForUser', profileContext.get().params._id, function(error,result){
		    if(error){
		        console.log(error.reason);
		    }
		    else{
		        // do something with result
			  	//console.log('SUCCESSFULLY got listen count user!');
			  	//console.log(result);
			  	Session.set(profileContext.get().params._id+'_lhCount', result);
			  	listenCountLoaded.set(true);
		    };
		});
	},
	listenCount: function()
	{
		var x = Session.get(profileContext.get().params._id+'_lhCount');
		if(x === 0 || x > 1)
			return '<div class="statistic"><div class="value">'+x+'</div><div class="label">listens</div></div>';
		else if(x === 1)
			return '<div class="statistic"><div class="value">1</div><div class="label">listen</div></div>';
	},

	/*topGenreLength: function() {
		return Session.get(Router.current().params._id+'topGenresLength');
	},*/

	userProfileIsNotYou: function() {
		if(!_.isUndefined(profileContext.get().params._id) && !_.isUndefined(Meteor.user()))
			return profileContext.get().params._id !== Meteor.user()._id;
	},
	userIsKing: function() {
		return isUserKing();
	},

    songCount: function() {
      return Session.get(this._id+'_sc');
    },
    locationFlagCode: function() {
    	if(!_.isUndefined(Session.get(profileContext.get().params._id+'_uObj').baseLocation))
    	{
    		//return Session.get(profileContext.get().params._id+'_uObj').baseLocation.countryInternetCode.toLowerCase() + ' flag';
    		return Session.get(profileContext.get().params._id+'_uObj').baseLocation.country.toLowerCase() + ' flag';
    	}
    },
    recentSharedSongs: function() {
    	//return Songs.find();
    	return Songs.find({'sharedBy.uid': String(Session.get(profileContext.get().params._id+'_uObj').services.facebook.id)},{sort: {'sharedBy.uid': 1, 'sharedBy.systemDate': -1 }});
    },
    currentCursorPosition: function() {
    	var x = Number(Session.get(profileContext.get().params._id+'_sCursor')) + 1;
    	var y = Number(Session.get(profileContext.get().params._id+'_sCursor')) + 5;
    	if(y > Number(Session.get(this._id+'_sc')))
    		y = Number(Session.get(this._id+'_sc'));
    	return  x + '-' + y;
    },
    songsShared: function() {
    	return Session.get(this._id+'_sc') > 0;
    },
    songsTimeSpan: function() {
    	if(!_.isEmpty(Session.get(profileContext.get().params._id+'_sdr')))
    	{
    		if(Session.get(profileContext.get().params._id+'_sdr').length == 2)
    		{
		    	if(!_.isUndefined(Session.get(profileContext.get().params._id+'_sdr')[0])  && !_.isUndefined(Session.get(profileContext.get().params._id+'_sdr')[1]))
		    	{
		    		if(Session.get(profileContext.get().params._id+'_sdr')[0] !== Session.get(profileContext.get().params._id+'_sdr')[1])
		    		{
		    			var diff = Session.get(profileContext.get().params._id+'_sdr')[1] - Session.get(profileContext.get().params._id+'_sdr')[0];
		    			if(diff == 1)
		    			{
		    				return '1 year';
		    			}
		    			else if(diff > 1)
		    			{
		    				return String(diff) + ' years';
		    			}
		    		}
					else
						return '1 year';
		    	}
	    	}
	    	else if(Session.get(profileContext.get().params._id+'_sdr').length == 1)
	    	{
	    		return '1 year';
	    	}
    	}
    },
    songTimeSpanLoaded: function() {
    	return songTimeSpanLoaded.get();
    },
    listenCountLoaded: function() {
    	return listenCountLoaded.get();
    },
    ratingCountLoaded: function() {
    	return ratingCountLoaded.get();
    },
    songCountLoaded: function() {
    	return songCountLoaded.get();
    },
    pagedSongsLoaded: function() {
    	return pagedSongsLoaded.get();
    },
    topTenGenresLoaded: function() {
    	return Session.get('ttgldd');
    }
});

Template.sprofile.onRendered(function () {
	fixSemanticGrids();
	/*$('.special.cards .image').dimmer({
	  on: 'hover'
	});*/
	Session.setDefault(profileContext.get().params._id+'_uObjLoaded', false);
});

Template.sprofile.events({
    "click #previousMGS": function (event) {
      //console.log('CLICKED PREVIOUS button');
      if(Number(Session.get(profileContext.get().params._id+'_sCursor')) > 4)
      {
        //console.log('INSIDE if condition!!');
        pagedSongsLoaded.set(false);
        Session.set(profileContext.get().params._id+'_sCursor', Number(Session.get(profileContext.get().params._id+'_sCursor')) - 5);
        //iHist(true);
        //resetPlayedLengthSpecificToTab('me');
      }
      else
      {
        toastr.info("Reached the beginning of "+Session.get(profileContext.get().params._id+'_uObj').services.facebook.first_name+"'s shared songs; <br><br><b><i>try moving forward (->) to see what they shared in the past!</i></b><br><br>");
        //console.log('INSIDE else condition!!');
      }
    },

    "click #nextMGS": function (event) {
      //console.log('CLICKED next button');
      if(Number(Session.get(profileContext.get().params._id+'_sCursor')) < Number(Session.get(profileContext.get().params._id+'_sc') - 5))
      {
        //console.log('INSIDE if condition!!');
        pagedSongsLoaded.set(false);
        Session.set(profileContext.get().params._id+'_sCursor', Number(Session.get(profileContext.get().params._id+'_sCursor')) + 5);
        //iHist(true);
        //resetPlayedLengthSpecificToTab('me');
      }
      else
      {
        //console.log('INSIDE else condition!!');
        toastr.info("Reached the end of "+Session.get(profileContext.get().params._id+'_uObj').services.facebook.first_name+"'s shared songs; <br><br><b><i>try moving backward (<-) to see what they shared more recently!</i></b><br><br>");
      }
    },
    "click #unfollowUser": function (event) {
      var userObj = Session.get(profileContext.get().params._id+'_uObj')
      var isUserAFriend = !_.isUndefined(_.findWhere(Meteor.user().fbFriends, {fbid: userObj.services.facebook.id}));

      console.log('UNFOLLOW user button clicked!');
      console.log('and this user is a friend: ' + isUserAFriend);

      Meteor.call('unfollowUser', userObj, isUserAFriend, function(error,result){
		    if(error){
		        console.log(error.reason);
		    }
		    else{
		        // do something with result
			  	//console.log('SUCCESSFULLY unfollowed user!');
			  	mixpanel.track('followed user');
		    };
		});
      return true;
    },
    "click #followUser": function (event) {
      var userObj = Session.get(profileContext.get().params._id+'_uObj')
      var isUserAFriend = !_.isUndefined(_.findWhere(Meteor.user().fbFriends, {fbid: userObj.services.facebook.id}));

      console.log('Follow user button clicked!');
      console.log('and this user is a friend: ' + isUserAFriend);

      Meteor.call('followUser', userObj, isUserAFriend, function(error,result){
		    if(error){
		        console.log(error.reason);
		    }
		    else{
		        // do something with result
			  	//console.log('SUCCESSFULLY followed user!');
			  	mixpanel.track('unfollowed user');
		    };
		});
      return true;
    }
});

//NOT USING TEMPLATE LEVEL SUBSCRIPTIONS
Template.sprofile.onCreated(function() {
	var self = this;
	self.autorun(function() {
		FlowRouter.watchPathChange();
	    var context = FlowRouter.current();
	    // use context to access the URL state
	    //console.log('%%%%%%%%%%%%%%%%%%%% ROUTE HAS CHANGED!!!!');
	    //console.log(context);
	    profileContext.set(context);
	    //console.log("THIS IS THE PROFILE CONTEXT REACTIVE VAAAAAAAAAAAAAAAAAR: ");
	    //console.log(profileContext.get());
	    Session.setDefault(context.params._id+'_sCursor', 0);

	    self.subscribe('userObjectForProfilePage', profileContext.get().params._id, {onReady: userObjExists});
		//self.subscribe('userObjectForProfilePage', profileContext.get().params._id, {onReady: userObjExists});
		self.subscribe('allSongsForSpecificUser', profileContext.get().params._id, Session.get(profileContext.get().params._id+'_sCursor'), {onReady: songSubscriptionReady});
		//self.subscribe('favoritesForSpecificUser', profileContext.get().params._id);
		self.subscribe("favoriteCountForSpecificUser", profileContext.get().params._id);
		Session.set(profileContext.get().params._id+'_faveCount', Counts.get('faveCounterForUser'));
		//console.log("FINISHED TRYING TO GET all subscriptions")
		if(!_.isUndefined(Session.get(profileContext.get().params._id+'_uObj')))
		{
			self.subscribe("counterForMyGroovs", Session.get(profileContext.get().params._id+'_uObj').services.facebook.id);
        	Session.set(profileContext.get().params._id+'_sc', Counts.get('songCountForMyGroovs'));
        	songCountLoaded.set(true);
        }
	});
});

function songSubscriptionReady() {
	pagedSongsLoaded.set(true);
}

function userObjExists(){
	//console.log("SUBSCRIPTION is readyyyyyyy!!");
	//console.log("THIS IS HTE SUB obj:");
	//console.log(this);
	if(Meteor.users.find(profileContext.get().params._id).count() > 0)
	{
		Session.set(profileContext.get().params._id+'_uObj', Meteor.users.findOne(profileContext.get().params._id));
		Session.set(profileContext.get().params._id+'_uObjLoaded', true);
		getYearRangeForMyGroovs();
		mixpanel.track('view user profile', {
	        userProfile: profileContext.get().params._id,
	       	viewee: Meteor.user()._id
	      });
	}
	else
	{
		//console.log("NO user object found!!!!");
		Session.set(profileContext.get().params._id+'_uObj', undefined);
		Session.set(profileContext.get().params._id+'_uObjLoaded', true);
		FlowRouter.go('/404');
	}
	//getListenHistoryForUser(profileContext.get().params._id);
}


isUserProfileYou = function()
{
	return profileContext.get().params._id === Meteor.user()._id;
}

function isUserKing()
{
	//return ((Meteor.user().services.facebook.id === '721431527969807') && isUserProfileYou()) ; // only check with Sandeep's FB ID
	if(!_.isUndefined(Meteor.user())  && !_.isUndefined(Meteor.user().services) && !_.isUndefined(Meteor.user().services.facebook))
		return ((Meteor.user().services.facebook.email === 'reverieandreflection@gmail.com') && isUserProfileYou()) ; // only check with Sandeep's FB email id
	else
		return false;
}


function getYearRangeForMyGroovs() {
	//console.log("GOING TO GET date range for MY GROOVS!!!");
	if(!_.isUndefined(Session.get(profileContext.get().params._id+'_uObj')))
	{
		//songTimeSpanLoaded.set(false);
		//Meteor.call('getDateRangeForMyGroovs', Session.get(FlowRouter.current().params._id+'_uObj').services.facebook.id, function(error, result) {
		Meteor.call('getSongDateRangeForSpecificUser', Session.get(FlowRouter.current().params._id+'_uObj').services.facebook.id, function(error, result) {
		  if(error)
		    console.log('Encountered error while trying to get date range for user songs!');
		  else
		  {
		    //console.log("GOT back this date range: ");
		    //console.log(result);
		    Session.set(profileContext.get().params._id+'_sdr', result);
		    Meteor.setTimeout(initiateSongTabsForUserProfile, 800);
		    songTimeSpanLoaded.set(true);
		    //Session.set('selyr', result[1]);
		    //Session.set('drl', true);
		  }
		});
	}
}



function fixSemanticGrids() {
  var deviceList = ['computer', 'tablet', 'mobile'];
  $('.wide.column').each(function (i, e) { 
    var classes = $(e).attr('class').split(/\s+/);
    var newClasses = new Array();
    $.each(classes, function (j, c) {
      if($.inArray(c, deviceList) >= 0 && j > 0 && 'wide' != classes[j-1]) {
        newClasses.push('wide');
      }
      newClasses.push(c);
    });
    $(e).attr('class', newClasses.join(' '));
  });
};

function initiateSongTabsForUserProfile(){
	//console.log('initiating tabs!!!!');
	$('.userProfileSongTabs .item').tab();
}