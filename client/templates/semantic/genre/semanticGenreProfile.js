var genreProfileContext = new ReactiveVar(null);
//var artistsSubLoaded = new ReactiveVar(false);
var genrePercentage = new ReactiveVar(0);
var genreSpecificSongCountLoaded = new ReactiveVar(false);
var genrePeopleCountLoaded = new ReactiveVar(false);
var genrePercentageCalculated = new ReactiveVar(false);
var genreArtistListLoaded = new ReactiveVar(false);
var pagedGenreSongsLoaded = new ReactiveVar(false);

Template.semanticGenreProfile.helpers({
	artistImage: function() {
		if(!_.isUndefined(this.mediumImage))
			return this.mediumImage['#text'];
	},
	gObjLoaded: function() {
		return Session.get(genreProfileContext.get().params._id+'_genObjLoaded');
	},

	/*artistSubLoaded: function(){
		//console.log('THI SI SHTHE artists sub loaded reactive var: ');
		//console.log(artistsSubLoaded.get());
		return artistsSubLoaded.get();
	},*/

	genreObjectForRoute: function() {
		/*getUserForRouting();
		var x = Session.get(Router.current().params._name+'_genObj')*/
		//console.log('THIS IS THE USER FOUND FOR: ');
		//console.log(x);
		//return x;
		return Session.get(genreProfileContext.get().params._id+'_genObj');
	},

	songsForGenre: function() {
		//return Session.get(genreProfileContext.get().params._id+'_gs');
		return Songs.find();
	},

    genreHasSongs: function() {
    	return Session.get(genreProfileContext.get().params._id+'_sc') > 0;
    },

    moreThan1Song: function() {
    	return (Session.get(genreProfileContext.get().params._id+'_sc') > 1 || Session.get(genreProfileContext.get().params._id+'_sc') == 0);
    },

    moreThan1Artist: function() {
    	return (Session.get(genreProfileContext.get().params._id+'_arts').length > 1 || Session.get(genreProfileContext.get().params._id+'_arts').length == 0);
    },

    lowercased:function(txtToLower){
    	return txtToLower.toLowerCase();
    },

    /*artistIDForName: function() {
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
	},*/

	genreHasArtists: function() {
		if(!_.isUndefined(Session.get(genreProfileContext.get().params._id+'_arts')) && !_.isEmpty(Session.get(genreProfileContext.get().params._id+'_arts')))
		  return true;
		else
		  return false;
	},

	artistsForThisGenre: function() {
		return Session.get(genreProfileContext.get().params._id+'_arts');
	},

	artistCountForThisGenre: function() {
		return Session.get(genreProfileContext.get().params._id+'_arts').length;
	},

	hasContent: function() {
		return !_.isUndefined(this.content) && !_.isEmpty(this.content);
	},

	cleanedContent: function() {
	  this.content = this.content.replace(/(\r\n|\n|\r)/gm,"");//remove extra line breaks
	  this.content = this.content.replace(/\s{2,}/g, ' '); //remove extra whitespace
	  /*var anchorTag = '<a href=';
	  var anchorTagToBeRemoved = this.content.substring(this.content.indexOf(anchorTag));
	  this.content = this.content.replace(anchorTagToBeRemoved, '');*/
	  var indexOfLastShortenedPeriod = this.content.substring(0,1300).lastIndexOf('.')+1; //approximately first 1300 characters of bio
	  return this.content.substring(0,indexOfLastShortenedPeriod).replace(/(<([^>]+)>)/ig,""); //also remove all HTMLtags from content
	},

	havePeopleToShow: function() {//there are people to list other than the current user
		return !_.isEmpty(Session.get(genreProfileContext.get().params._id+'_gusers'))
	},

	peopleForGenre: function() {
		return Session.get(genreProfileContext.get().params._id+'_gusers');
	},

	countOfPeopleForGenre: function() {
		if(!_.isUndefined(Session.get(genreProfileContext.get().params._id+'_gusers')) && !_.isUndefined(Meteor.user()) && !_.isUndefined(Meteor.user().services))
		{
			if(!_.isUndefined(Meteor.user().services) && !_.isUndefined(_.findWhere(Session.get(genreProfileContext.get().params._id+'_gusers'), {uid: Meteor.user().services.facebook.id})))
			{
				return Session.get(genreProfileContext.get().params._id+'_gusers').length - 1;
			}
			//you are not part of people list
			else
				return Session.get(genreProfileContext.get().params._id+'_gusers').length;
		}
		else
			return 0;
	},
	countOfPeopleForGenreLabel: function() {
		if(!_.isUndefined(Session.get(genreProfileContext.get().params._id+'_gusers')) && !_.isUndefined(Meteor.user()) && !_.isUndefined(Meteor.user().services))
		{
			//people for artist include you
			if(!_.isUndefined(_.findWhere(Session.get(genreProfileContext.get().params._id+'_gusers'), {uid: Meteor.user().services.facebook.id})))
			{
				if(Session.get(genreProfileContext.get().params._id+'_gusers').length - 1 > 1 || Session.get(genreProfileContext.get().params._id+'_gusers').length - 1 == 0)
					return 'people other than you';
				else if(Session.get(genreProfileContext.get().params._id+'_gusers').length - 1 == 1)
					return 'person other than you';
			}
			//people for artist do not include you
			else
			{
				if(Session.get(genreProfileContext.get().params._id+'_gusers').length > 1 || Session.get(genreProfileContext.get().params._id+'_gusers').length == 0)
					return 'people';
				else if(Session.get(genreProfileContext.get().params._id+'_gusers').length == 1)
					return 'person';
			}
		}
		else
			return "people";
	},

	genrePercentageValue: function() {
		return genrePercentage.get();
	},

	genreChatterMessageCount: function() {
		getUsersFromChatter();
		return Session.get(genreProfileContext.get().params._id+"_mc");
	},

	userIsKing: function() {
		return isUserKing();
	},

    songCount: function() {
      return Session.get(genreProfileContext.get().params._id+'_sc');
    },
    genreSongsDoNotNeedPaging: function(){
    	if(Session.get(genreProfileContext.get().params._id+'_sc') <= 5)
    		return true;
    	else
    		return false;
    },
    
    currentCursorPosition: function() {
    	var x = Number(Session.get(genreProfileContext.get().params._id+'_genCursor')) + 1;
    	var y = Number(Session.get(genreProfileContext.get().params._id+'_genCursor')) + 5;
    	if(y > Number(Session.get(this._id+'_sc')))
    		y = Number(Session.get(this._id+'_sc'));
    	return  x + '-' + y;
    },

    genreSpecificSongCountLoaded: function() {
    	return genreSpecificSongCountLoaded.get();
    },

    genrePeopleCountLoaded: function() {
    	return genrePeopleCountLoaded.get();
    },

    genrePercentageCalculated: function() {
    	return genrePercentageCalculated.get();
    },

    genreArtistListLoaded: function() {
    	return genreArtistListLoaded.get();
    },

    pagedGenreSongsLoaded: function() {
    	return pagedGenreSongsLoaded.get();
    }
});

Template.semanticGenreProfile.onRendered(function () {
	fixSemanticGrids();
	/*$('.special.cards .image').dimmer({
	  on: 'hover'
	});*/
	amplitude.logEvent('loaded genre page', {
        genreID: genreProfileContext.get().params._id
      });
	ga('send', {
        hitType: 'event',
        eventCategory: 'genre page',
        eventAction: 'loaded genre page'
    });
	Session.setDefault(genreProfileContext.get().params._id+'_genObjLoaded', false);
});

Template.semanticGenreProfile.events({
    "click #previousGS": function (event) {
      //console.log('CLICKED PREVIOUS button');
      if(Number(Session.get(genreProfileContext.get().params._id+'_genCursor')) > 4)
      {
        //console.log('INSIDE if condition!!');
        pagedGenreSongsLoaded.set(false);
        Session.set(genreProfileContext.get().params._id+'_genCursor', Number(Session.get(genreProfileContext.get().params._id+'_genCursor')) - 5);
        //iHist(true);
        //resetPlayedLengthSpecificToTab('me');
      }
      else
      {
        toastr.info("Reached the beginning of "+Session.get(genreProfileContext.get().params._id+'_genObj').name+"'s songs on Groovli; <br><br><b><i>try moving forward (->) to see more songs from the past!</i></b><br><br>");
        //console.log('INSIDE else condition!!');
      }
    },

    "click #nextGS": function (event) {
      //console.log('CLICKED next button');
      if(Number(Session.get(genreProfileContext.get().params._id+'_genCursor')) < Number(Session.get(genreProfileContext.get().params._id+'_sc') - 5))
      {
        //console.log('INSIDE if condition!!');
        pagedGenreSongsLoaded.set(false);
        Session.set(genreProfileContext.get().params._id+'_genCursor', Number(Session.get(genreProfileContext.get().params._id+'_genCursor')) + 5);
        //iHist(true);
        //resetPlayedLengthSpecificToTab('me');
      }
      else
      {
        //console.log('INSIDE else condition!!');
        toastr.info("Reached the end of "+Session.get(genreProfileContext.get().params._id+'_genObj').name+"'s songs on Groovli; <br><br><b><i>try moving backward (<-) to see more recent songs!</i></b><br><br>");
      }
    }
});

//NOT USING TEMPLATE LEVEL SUBSCRIPTIONS
Template.semanticGenreProfile.onCreated(function() {
	var self = this;
	self.autorun(function() {
		FlowRouter.watchPathChange();
	    var context = FlowRouter.current();
	    // use context to access the URL state
	    //console.log('%%%%%%%%%%%%%%%%%%%% ROUTE HAS CHANGED!!!!');
	    //console.log(context);
	    genreProfileContext.set(context);
	    //artistsSubLoaded.set(false);
	    //console.log("THIS IS THE PROFILE CONTEXT REACTIVE VAAAAAAAAAAAAAAAAAR: ");
	    //console.log(genreProfileContext.get());
	    Session.setDefault(context.params._id+'_genCursor', 0);
	    self.subscribe('genreObjectForProfilePage', genreProfileContext.get().params._id, {onReady: genreExists});

	    if(!_.isUndefined(Session.get(genreProfileContext.get().params._id+'_genObj')) && !_.isUndefined(Session.get(genreProfileContext.get().params._id+'_arts')))
	    {
	    	self.subscribe('allSongsForSpecificGenre', Session.get(genreProfileContext.get().params._id+'_arts'), Session.get(genreProfileContext.get().params._id+'_genCursor'), {onReady: songSubscriptionReady});	    	
	    	self.subscribe("counterForGenreSpecificSongs", Session.get(genreProfileContext.get().params._id+'_arts'));
        	Session.set(genreProfileContext.get().params._id+'_sc', Counts.get('songCountForGenreSpecificSongs'));
        	genreSpecificSongCountLoaded.set(true);
			getUserListForSpecificGenre();


        	if(!_.isUndefined(Meteor.user()))
				self.subscribe("counterForAllSongs", Meteor.user()._id, {onReady: totalSongCountReady});

        	calculateGenrePercentage();
	    }

		/*self.subscribe('allSongsForSpecificArtist', genreProfileContext.get().params._id, Session.get(genreProfileContext.get().params._id+'_aCursor'));
		self.subscribe('artistsForSite', {onReady: artistSubLoaded});

			

		if(!_.isUndefined(Session.get(genreProfileContext.get().params._id+'_genObj')))
		{
			self.subscribe("counterForArtistSpecificSongs", genreProfileContext.get().params._id);
        	Session.set(genreProfileContext.get().params._id+'_sc', Counts.get('songCountForArtistSpecificSongs'));
        	
        }*/
	});
});

function songSubscriptionReady() {
	pagedGenreSongsLoaded.set(true);
}

function totalSongCountReady(){
	Session.set('_asc', Counts.get('songCountForAllSongs'));
}

function calculateGenrePercentage() {
	var x = (Session.get(genreProfileContext.get().params._id+'_sc') / Session.get('_asc')) * 100;
	//console.log('##############################THIS IS THE artist percentage: ');
	//console.log(x);
	genrePercentage.set(x.toFixed(1));
	genrePercentageCalculated.set(true);
}

/*
function artistSubLoaded(){
	artistsSubLoaded.set(true);
}*/

function genreExists(){
	//console.log("artist SUBSCRIPTION is readyyyyyyy!!");
	//console.log("THIS IS HTE SUB obj:");
	//console.log(this);
	if(Genres.find(String(genreProfileContext.get().params._id)).count() > 0)
	{
		Session.set(genreProfileContext.get().params._id+'_genObj', Genres.findOne(String(genreProfileContext.get().params._id)));
		Session.set(genreProfileContext.get().params._id+'_genObjLoaded', true);
		Meteor.call('getArtistsForSpecificGenre', Session.get(genreProfileContext.get().params._id+'_genObj').name, function(error,result){
		    if(error){
		        console.log(error.reason);
		    }
		    else{
		        // do something with result
			  	Session.set(genreProfileContext.get().params._id+'_arts', result);
			  	genreArtistListLoaded.set(true);
			  	//getSongsForSpecificGenre(result);
		    };
		});
		//console.log("ARTIST ACTUALLY EXISTS!!!!!!");
		//getYearRangeForMyGroovs();
	}
	else
	{
		//console.log("NO user object found!!!!");
		Session.set(genreProfileContext.get().params._id+'_genObj', undefined);
		Session.set(genreProfileContext.get().params._id+'_genObjLoaded', true);
		//console.log("ARTIST does not EXIST!!!!!!");
		FlowRouter.go('/404');
	}
	//getListenHistoryForUser(genreProfileContext.get().params._id);
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
	return genreProfileContext.get().params._id === Meteor.user()._id;
}

function isUserKing()
{
	//return ((Meteor.user().services.facebook.id === '721431527969807') && isUserProfileYou()) ; // only check with Sandeep's FB ID
	return ((Meteor.user().services.facebook.email === 'reverieandreflection@gmail.com') && isUserProfileYou()) ; // only check with Sandeep's FB email id
}

function getUserListForSpecificGenre()
{
	if(!_.isUndefined(Meteor.user()) && !_.isUndefined(Meteor.user().services) && !_.isUndefined(Session.get(genreProfileContext.get().params._id+'_arts')))
	{
		Meteor.call('getListOfUsersWhoSharedGenreSpecficSongs', Session.get(genreProfileContext.get().params._id+'_arts'), function(error, result) {
		  if(error)
		    console.log('Encountered error while trying to get date range for user songs!');
		  else
		  {
		    //console.log("GOT back this user list!!!!!!!!!!!: ");
		    //console.log(result);
		    Session.set(genreProfileContext.get().params._id+'_gusers', result);
		    getUsersFromChatter();
		    Meteor.setTimeout(initiateSongTabsForGenreProfile, 800);
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
	var userListForGenre = Session.get(genreProfileContext.get().params._id+'_gusers');
	var genrePage = genreProfileContext.get().params._id+"_genre_group";
	if(_.isUndefined(userListForGenre))
		userListForGenre = [];

	var genreMsgs = Messages.find({'to': String(genrePage)}, {sort: { 'timestamp': 1 }}).fetch();

	//console.log('THIS IS THE ARTIST MSGS: ');
	//console.log(genreMsgs);

	_.each(genreMsgs, function(x){
		//console.log('analyzing this message ') ;
		//console.log(x);
		//if(x.from !== Meteor.user().services.facebook.id && _.isUndefined(_.findWhere(userListForArtist, {uid: x.from})))
		if(_.isUndefined(_.findWhere(userListForGenre, {uid: x.from})))
		{
			//console.log('FOUND THIS USER TO ADD TO the list: ') ;
			//console.log(x);
			var chatterUser = {
				_id: x.fromProfileID,
				uid: x.from,
				uname: x.fromName
			};
			userListForGenre.push(chatterUser)
		}
	});

	Session.set(genreProfileContext.get().params._id+'_gusers', userListForGenre);
	genrePeopleCountLoaded.set(true);
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

function initiateSongTabsForGenreProfile(){
	//console.log('initiating tabs!!!!');
	$('.userProfileSongTabs .item').tab();
}