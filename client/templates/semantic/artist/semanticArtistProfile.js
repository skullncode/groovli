var artistProfileContext = new ReactiveVar(null);
var artistsSubLoaded = new ReactiveVar(false);
var artistPercentage = new ReactiveVar(0);
var genresForArtistPageLoaded = new ReactiveVar(false);
var pagedArtistSongsLoaded = new ReactiveVar(false);

Template.semanticArtistProfile.helpers({
	artistImage: function() {
		if(!_.isEmpty(this.largeImage['#text']))
			return this.largeImage['#text'];
		else
			return "http://semantic-ui.com/images/wireframe/square-image.png";
	},
	aObjLoaded: function() {
		return Session.get(artistProfileContext.get().params._id+'_artObjLoaded');
	},

	artistSubLoaded: function(){
		//console.log('THI SI SHTHE artists sub loaded reactive var: ');
		//console.log(artistsSubLoaded.get());
		return artistsSubLoaded.get();
	},

	genreSubForArtistPageLoaded: function() {
		return genresForArtistPageLoaded.get()
	},

	genresForThisArtist: function() {
		return Genres.find();
	},

	artistObjectForRoute: function() {
		/*getUserForRouting();
		var x = Session.get(Router.current().params._name+'_artObj')*/
		//console.log('THIS IS THE USER FOUND FOR: ');
		//console.log(x);
		//return x;
		return Session.get(artistProfileContext.get().params._id+'_artObj');
	},

	beganDateExists: function(){
		if(!_.isUndefined(Session.get(artistProfileContext.get().params._id+'_artObj').began))
		{
			return true;
		}
		else
		{
			return false;
		}
	},

	placeBeganExists: function(){
		if(!_.isUndefined(Session.get(artistProfileContext.get().params._id+'_artObj').placeBegan))
		{
			return true;
		}
		else
		{
			return false;
		}
	},

	songsForArtist: function() {
    	//return Songs.find();
    	//var x = Songs.find({'sa': String(cleanupArtistName(Session.get(artistProfileContext.get().params._id+'_artObj').name))},{sort: {'sharedBy.systemDate': -1 }});
    	var x = Songs.find({},{sort: {'sharedBy.systemDate': -1 }});
    	getUsersFromSongList(x.fetch());
    	return x;
    },

    artistHasSongs: function() {
    	return Session.get(artistProfileContext.get().params._id+'_sc') > 0;
    },

    moreThan1Song: function() {
    	return (Session.get(artistProfileContext.get().params._id+'_sc') > 1 || Session.get(artistProfileContext.get().params._id+'_sc') == 0);
    },

    lowercased:function(txtToLower){
    	return txtToLower.toLowerCase();
    },

    artistHasPage: function() {
    	var artName = this.toString();
		if(!_.isUndefined(artName))
		{
			if(artName.indexOf('&') >= 0)
			{
			  artName = artName.replace(/&/g, 'and');
			}

			while(artName.indexOf('*') >= 0)
			{
				artName = artName.replace('*', '');
			}			

			var x = Artists.findOne({'name': {$regex: new RegExp('^' + artName + '$', 'i')}});
			//console.log("GOT THIS: ");
			//console.log(x);
			if(_.isEmpty(x))
			{
			  return false;
			}
			else
			{
			  return true;
			}
		}
    },

    artistIDForName: function() {
    	if(artistsSubLoaded.get())
    	{
	    	//console.log("THIS IS THE similar artist name: ");
	    	//console.log(this.toString());
			//console.log("THIS IS THE ARTIST COUNT: ");
			//console.log(Artists.find().count());
			var foundArtist = Artists.findOne({'name': this.toString()});
			if(!_.isUndefined(foundArtist))
			{
				//console.log('$$$$$$$$$$$$$$$$$$$FOUND an artist for similar artists:');
				//console.log(foundArtist);
				//console.log(foundArtist._id);
				return foundArtist._id;
			}
		}
	},

	hasSimilar: function() {
		if(!_.isUndefined(this.similar) && !_.isEmpty(this.similar))
		  return true;
		else
		  return false;
	},
	hasGenres: function() {
		if(!_.isUndefined(this.genres) && !_.isEmpty(this.genres))
		  return true;
		else
		  return false;
	},

	hasBio: function() {
		return !_.isUndefined(this.bio) && !_.isEmpty(this.bio);
	},

	cleanedBio: function() {
		if(!_.isUndefined(this.bio))
		{
		  this.bio = this.bio.replace(/(\r\n|\n|\r)/gm,"");//remove extra line breaks
		  this.bio = this.bio.replace(/\s{2,}/g, ' '); //remove extra whitespace
		  var anchorTag = '<a href=';
		  var anchorTagToBeRemoved = this.bio.substring(this.bio.indexOf(anchorTag));
		  this.bio = this.bio.replace(anchorTagToBeRemoved, '');
		  var indexOfLastShortenedPeriod = this.bio.substring(0,1300).lastIndexOf('.')+1; //approximately first 1300 characters of bio
		  return this.bio.substring(0,indexOfLastShortenedPeriod);
		}
	},

	havePeopleToShow: function() {//there are people to list other than the current user
		return !_.isEmpty(Session.get(artistProfileContext.get().params._id+'_ausers'))
	},

	peopleForArtist: function() {
		return Session.get(artistProfileContext.get().params._id+'_ausers');
	},

	countOfPeopleForArtist: function() {
		if(!_.isUndefined(Session.get(artistProfileContext.get().params._id+'_ausers')))
		{
			if(!_.isUndefined(Meteor.user().services) && !_.isUndefined(_.findWhere(Session.get(artistProfileContext.get().params._id+'_ausers'), {uid: Meteor.user().services.facebook.id})))
			{
				return Session.get(artistProfileContext.get().params._id+'_ausers').length - 1;
			}
			//you are not part of people list
			else
				return Session.get(artistProfileContext.get().params._id+'_ausers').length;
		}
		else
			return 0;
	},
	countOfPeopleForArtistLabel: function() {
		if(!_.isUndefined(Session.get(artistProfileContext.get().params._id+'_ausers')))
		{
			//people for artist include you
			if(!_.isUndefined(_.findWhere(Session.get(artistProfileContext.get().params._id+'_ausers'), {uid: Meteor.user().services.facebook.id})))
			{
				if(Session.get(artistProfileContext.get().params._id+'_ausers').length - 1 > 1 || Session.get(artistProfileContext.get().params._id+'_ausers').length - 1 == 0)
					return 'people other than you';
				else if(Session.get(artistProfileContext.get().params._id+'_ausers').length - 1 == 1)
					return 'person other than you';
			}
			//people for artist do not include you
			else
			{
				if(Session.get(artistProfileContext.get().params._id+'_ausers').length > 1 || Session.get(artistProfileContext.get().params._id+'_ausers').length == 0)
					return 'people';
				else if(Session.get(artistProfileContext.get().params._id+'_ausers').length == 1)
					return 'person';
			}
		}
		else
			return "people";
	},

	artistPercentageValue: function() {
		return artistPercentage.get();
	},

	artistChatterMessageCount: function() {
		getUsersFromChatter();
		return Session.get(artistProfileContext.get().params._id+"_mc");
	},

	
	userProfileIsNotYou: function() {
		if(!_.isUndefined(artistProfileContext.get().params._id) && !_.isUndefined(Meteor.user()))
			return artistProfileContext.get().params._id !== Meteor.user()._id;
	},
	userIsKing: function() {
		return isUserKing();
	},

    songCount: function() {
      return Session.get(artistProfileContext.get().params._id+'_sc');
    },
   
    artistSongsDoNotNeedPaging: function(){
    	if(Session.get(artistProfileContext.get().params._id+'_sc') <= 5)
    		return true;
    	else
    		return false;
    },
    locationFlagCode: function() {
    	if(!_.isUndefined(Session.get(artistProfileContext.get().params._id+'_artObj').baseLocation))
    	{
    		//console.log('returning this FLAG CODE: ');
    		//var x = Session.get(artistProfileContext.get().params._id+'_artObj').baseLocation.countryInternetCode.toLowerCase() + ' flag'; 
    		//console.log(x);
    		return Session.get(artistProfileContext.get().params._id+'_artObj').baseLocation.countryInternetCode.toLowerCase() + ' flag';
    	}
    },
    
    currentCursorPosition: function() {
    	var x = Number(Session.get(artistProfileContext.get().params._id+'_aCursor')) + 1;
    	var y = Number(Session.get(artistProfileContext.get().params._id+'_aCursor')) + 5;
    	if(y > Number(Session.get(this._id+'_sc')))
    		y = Number(Session.get(this._id+'_sc'));
    	return  x + '-' + y;
    },

    songsTimeSpan: function() {
    	if(!_.isEmpty(Session.get(artistProfileContext.get().params._id+'_sdr')))
    	{
    		if(Session.get(artistProfileContext.get().params._id+'_sdr').length == 2)
    		{
		    	if(!_.isUndefined(Session.get(artistProfileContext.get().params._id+'_sdr')[0])  && !_.isUndefined(Session.get(artistProfileContext.get().params._id+'_sdr')[1]))
		    	{
		    		if(Session.get(artistProfileContext.get().params._id+'_sdr')[0] !== Session.get(artistProfileContext.get().params._id+'_sdr')[1])
		    		{
		    			var diff = Session.get(artistProfileContext.get().params._id+'_sdr')[1] - Session.get(artistProfileContext.get().params._id+'_sdr')[0];
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
	    	else if(Session.get(artistProfileContext.get().params._id+'_sdr').length == 1)
	    	{
	    		return '1 year';
	    	}
    	}
    },
    pagedArtistSongsLoaded: function() {
    	return pagedArtistSongsLoaded.get();
    }
});

Template.semanticArtistProfile.onRendered(function () {
	fixSemanticGrids();
	/*$('.special.cards .image').dimmer({
	  on: 'hover'
	});*/
	amplitude.logEvent('loaded artist page', {
        artistID: artistProfileContext.get().params._id
      });
	ga('send', {
      hitType: 'event',
      eventCategory: 'artist page',
      eventAction: 'loaded artist page'
    });
	Session.setDefault(artistProfileContext.get().params._id+'_artObjLoaded', false);
});

Template.semanticArtistProfile.events({
    "click #previousAS": function (event) {
      //console.log('CLICKED PREVIOUS button');
      if(Number(Session.get(artistProfileContext.get().params._id+'_aCursor')) > 4)
      {
        //console.log('INSIDE if condition!!');
        pagedArtistSongsLoaded.set(false);
        Session.set(artistProfileContext.get().params._id+'_aCursor', Number(Session.get(artistProfileContext.get().params._id+'_aCursor')) - 5);
        //iHist(true);
        //resetPlayedLengthSpecificToTab('me');
      }
      else
      {
        toastr.info("Reached the beginning of "+Session.get(artistProfileContext.get().params._id+'_artObj').name+"'s songs on Groovli; <br><br><b><i>try moving forward (->) to see more songs from the past!</i></b><br><br>");
        //console.log('INSIDE else condition!!');
      }
    },

    "click #nextAS": function (event) {
      //console.log('CLICKED next button');
      if(Number(Session.get(artistProfileContext.get().params._id+'_aCursor')) < Number(Session.get(artistProfileContext.get().params._id+'_sc') - 5))
      {
        //console.log('INSIDE if condition!!');
        pagedArtistSongsLoaded.set(false);
        Session.set(artistProfileContext.get().params._id+'_aCursor', Number(Session.get(artistProfileContext.get().params._id+'_aCursor')) + 5);
        //iHist(true);
        //resetPlayedLengthSpecificToTab('me');
      }
      else
      {
        //console.log('INSIDE else condition!!');
        toastr.info("Reached the end of "+Session.get(artistProfileContext.get().params._id+'_artObj').name+"'s songs on Groovli; <br><br><b><i>try moving backward (<-) to see more recent songs!</i></b><br><br>");
      }
    }
});

//NOT USING TEMPLATE LEVEL SUBSCRIPTIONS
Template.semanticArtistProfile.onCreated(function() {
	var self = this;
	self.autorun(function() {
		FlowRouter.watchPathChange();
	    var context = FlowRouter.current();
	    // use context to access the URL state
	    //console.log('%%%%%%%%%%%%%%%%%%%% ROUTE HAS CHANGED!!!!');
	    //console.log(context);
	    artistProfileContext.set(context);
	    //artistsSubLoaded.set(false);
	    //console.log("THIS IS THE PROFILE CONTEXT REACTIVE VAAAAAAAAAAAAAAAAAR: ");
	    //console.log(artistProfileContext.get());
	    Session.setDefault(context.params._id+'_aCursor', 0);
	    self.subscribe('artistObjectForProfilePage', artistProfileContext.get().params._id, {onReady: artistExists});
		self.subscribe('allSongsForSpecificArtist', artistProfileContext.get().params._id, Session.get(artistProfileContext.get().params._id+'_aCursor'), {onReady: songSubscriptionReady});
		self.subscribe('artistsForSite', {onReady: artistSubLoaded});

		if(!_.isUndefined(Meteor.user()))
			self.subscribe("counterForAllSongs", Meteor.user()._id, {onReady: totalSongCountReady});	
		//self.subscribe("favoriteCountForSpecificUser", artistProfileContext.get().params._id);
		//Session.set(artistProfileContext.get().params._id+'_faveCount', Counts.get('faveCounterForUser'));
		//console.log("FINISHED TRYING TO GET all subscriptions")
		if(!_.isUndefined(Session.get(artistProfileContext.get().params._id+'_artObj')))
		{
			self.subscribe('genresForArtistPage', Session.get(artistProfileContext.get().params._id+'_artObj').genres, {onReady: genreSubForArtistPageLoaded});
			self.subscribe("counterForArtistSpecificSongs", artistProfileContext.get().params._id);
        	Session.set(artistProfileContext.get().params._id+'_sc', Counts.get('songCountForArtistSpecificSongs'));
        	calculateArtistPercentage();
        }
	});
});

function songSubscriptionReady(){
	pagedArtistSongsLoaded.set(true);
}



function totalSongCountReady(){
	Session.set('_asc', Counts.get('songCountForAllSongs'));
}

function calculateArtistPercentage() {
	var x = (Session.get(artistProfileContext.get().params._id+'_sc') / Session.get('_asc')) * 100;
	//console.log('##############################THIS IS THE artist percentage: ');
	//console.log(x);
	artistPercentage.set(x.toFixed(1));
}

function artistSubLoaded(){
	artistsSubLoaded.set(true);
}

function genreSubForArtistPageLoaded(){
	genresForArtistPageLoaded.set(true);
}

function artistExists(){
	//console.log("artist SUBSCRIPTION is readyyyyyyy!!");
	//console.log("THIS IS HTE SUB obj:");
	//console.log(this);
	if(Artists.find(String(artistProfileContext.get().params._id)).count() > 0)
	{
		Session.set(artistProfileContext.get().params._id+'_artObj', Artists.findOne(String(artistProfileContext.get().params._id)));
		Session.set(artistProfileContext.get().params._id+'_artObjLoaded', true);
		//console.log("ARTIST ACTUALLY EXISTS!!!!!!");
		//getYearRangeForMyGroovs();
	}
	else
	{
		//console.log("NO user object found!!!!");
		Session.set(artistProfileContext.get().params._id+'_artObj', undefined);
		Session.set(artistProfileContext.get().params._id+'_artObjLoaded', true);
		//console.log("ARTIST does not EXIST!!!!!!");
		FlowRouter.go('/404');
	}
	//getListenHistoryForUser(artistProfileContext.get().params._id);
}

function cleanupArtistName(artistName){
	if(artistName.indexOf(' & ') >= 0)
	{
		//console.log('IN FIRST IF CONDITION');
		//console.log(artistName);
		var x = Songs.find({sa: {$regex: new RegExp('^' + artistName + '$', 'i')}}).fetch();
		if(!_.isEmpty(x))
		{
		  //console.log('THIS IS THE artist specific song LENGTH : ' + x.length);
		  //return x;
		  return artistName
		}
		else
		{
		  artistName = artistName.replace(/ & /g, ' and ');
		  //console.log('DID not find anything with just &; replaced with AND and now searching again!');
		  //console.log(artistName);
		  return artistName;
		}
	}
	else if(artistName.indexOf(' and ') >= 0)
	{
		//console.log('IN SECOND IF CONDITION');
		//console.log(artistName);
		var x = Songs.find({sa: {$regex: new RegExp('^' + artistName + '$', 'i')}}).fetch();
		if(!_.isEmpty(x))
		{
		  //console.log('THIS IS THE artist specific song LENGTH : ' + x.length);
		  //return x;
		  return artistName;
		}
		else
		{
		  artistName = artistName.replace(/ and /g, ' & ');
		  //console.log('DID not find anything with just AND; replaced with & and now searching again!');
		  //console.log(artistName);
		  return artistName;
		}
	}
	else
	{
		//console.log('IN ELSE CONDITION');
		return artistName;
	}
}


isUserProfileYou = function()
{
	return artistProfileContext.get().params._id === Meteor.user()._id;
}

function isUserKing()
{
	//return ((Meteor.user().services.facebook.id === '721431527969807') && isUserProfileYou()) ; // only check with Sandeep's FB ID
	return ((Meteor.user().services.facebook.email === 'reverieandreflection@gmail.com') && isUserProfileYou()) ; // only check with Sandeep's FB email id
}


function getYearRangeForMyGroovs() {
	//console.log("GOING TO GET date range for MY GROOVS!!!");
	if(!_.isUndefined(Session.get(artistProfileContext.get().params._id+'_artObj')))
	{
		Meteor.call('getDateRangeForMyGroovs', Session.get(FlowRouter.current().params._name+'_artObj').services.facebook.id, function(error, result) {
		  if(error)
		    console.log('Encountered error while trying to get date range for user songs!');
		  else
		  {
		    //console.log("GOT back this date range: ");
		    //console.log(result);
		    Session.set(artistProfileContext.get().params._id+'_sdr', result);
		    Meteor.setTimeout(initiateSongTabsForUserProfile, 800);
		    //Session.set('selyr', result[1]);
		    //Session.set('drl', true);
		  }
		});
	}
}

function getUsersFromSongList()
{
	if(!_.isUndefined(Meteor.user()) && !_.isUndefined(Meteor.user().services))
	{
		Meteor.call('getListOfUsersWhoSharedArtistSpecficSongs', Meteor.user().services.facebook.id, artistProfileContext.get().params._id, function(error, result) {
		  if(error)
		    console.log('Encountered error while trying to get date range for user songs!');
		  else
		  {
		    //console.log("GOT back this user list!!!!!!!!!!!: ");
		    //console.log(result);
		    Session.set(artistProfileContext.get().params._id+'_ausers', result);
		    getUsersFromChatter();
		    Meteor.setTimeout(initiateSongTabsForArtistProfile, 800);
		    //Session.set(artistProfileContext.get().params._id+'_sdr', result);
		    //Meteor.setTimeout(initiateSongTabsForUserProfile, 800);
		    //Session.set('selyr', result[1]);
		    //Session.set('drl', true);
		  }
		});
	}
}

function getUsersFromChatter()
{
	var userListForArtist = Session.get(artistProfileContext.get().params._id+'_ausers');
	var artistPage = artistProfileContext.get().params._id+"_artist_group";
	if(_.isUndefined(userListForArtist))
		userListForArtist = [];

	var artistMsgs = Messages.find({'to': String(artistPage)}, {sort: { 'timestamp': 1 }}).fetch();

	//console.log('THIS IS THE ARTIST MSGS: ');
	//console.log(artistMsgs);

	_.each(artistMsgs, function(x){
		//console.log('analyzing this message ') ;
		//console.log(x);
		//if(x.from !== Meteor.user().services.facebook.id && _.isUndefined(_.findWhere(userListForArtist, {uid: x.from})))
		if(_.isUndefined(_.findWhere(userListForArtist, {uid: x.from})))
		{
			//console.log('FOUND THIS USER TO ADD TO the list: ') ;
			//console.log(x);
			var chatterUser = {
				_id: x.fromProfileID,
				uid: x.from,
				uname: x.fromName
			};
			userListForArtist.push(chatterUser)
		}
	});

	Session.set(FlowRouter.current().context.params._id+'_ausers', userListForArtist);
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

function initiateSongTabsForArtistProfile(){
	//console.log('initiating tabs!!!!');
	$('.userProfileSongTabs .item').tab();
}