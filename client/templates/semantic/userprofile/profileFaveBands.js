Session.setDefault('f6Faves', true); //first 6 faves
Session.setDefault('l6Faves', false); //last 6 faves
Session.setDefault('ttgldd', false); //top ten genres loaded - need to set as session variable as needs to be accessed in sprofile instead of this template
var faveBandsContext = new ReactiveVar(null);
var faveBandsLoaded = new ReactiveVar(false);

Template.profileFaveBands.helpers({
    topTenBands: function() {
    	if(Session.get('f6Faves'))
			return _.first(Session.get('ttb'), 6);
		else if(Session.get('l6Faves'))
			return _.last(Session.get('ttb'), 6);
		else
			return _.first(Session.get('ttb'), 6);
	},

	hasTopTenBands: function() {
		if(!_.isEmpty(Session.get('ttb')))
			return true;
		else
			return false;
	},

	cleanedArtName: function(artName) {
		return cleanedArtistName(artName)
	},

	artistIDForName: function(artName) {
		if(artName.indexOf(' & ') >= 0)
		{
			//console.log('IN FIRST IF CONDITION');
			//console.log(artistName);
			var x = Artists.findOne({'name': {$regex: new RegExp('^' + artName + '$', 'i')}});
			if(!_.isEmpty(x))
			{
				//console.log('THIS IS THE artist specific song LENGTH : ' + x.length);
				//return x;
				return x._id;
			}
			else
			{
				artName = artName.replace(/ & /g, ' and ');
				//console.log('DID not find anything with just &; replaced with AND and now searching again!');
				//console.log(artistName);
				x = Artists.findOne({'name': {$regex: new RegExp('^' + artName + '$', 'i')}});
				if(!_.isEmpty(x))
				{
					return x._id;	
				}
			}
		}
		else
		{
			var x = Artists.findOne({'name': {$regex: new RegExp('^' + artName + '$', 'i')}});
			if(!_.isEmpty(x))
			{
				return x._id;
			}
		}
	},
	artistHasPage: function(artName) {
		//console.log("CHECKING if this artist has a page or not!!!!!!: " + artName);
		return doesArtistHavePage(cleanedArtistName(artName));
	},

	bandImage: function(y) {
		var artName = cleanedArtistName(y);
		var x = Artists.findOne({'name': {$regex: new RegExp('^' + artName + '$', 'i')}});
		if(_.isEmpty(x))
		{
			console.log(artName + "IS EMPTY!!!");
		}
		else
		{
			return x.mediumImage['#text'];
		}
	},

	topBandLength: function() {
		return Session.get(faveBandsContext.get().params._id+'topBandsLength');
	},

	viewingFirst6Faves: function() {
		if(Session.get(faveBandsContext.get().params._id+'topBandsLength') < 6)
			return true;
		else
			return Session.get('f6Faves');
	},

	viewingLast6Faves: function() {
		if(Session.get(faveBandsContext.get().params._id+'topBandsLength') < 6)
			return true;
		else
			return Session.get('l6Faves');
	},
	faveBandsLoaded: function() {
		return faveBandsLoaded.get()
	},

	userFirstName: function() {
		return Session.get(faveBandsContext.get().params._id+'_uObj').services.facebook.first_name;
	}
});



Template.profileFaveBands.onCreated(function() {
	var self = this;
	self.autorun(function() {
		FlowRouter.watchPathChange();
	    var context = FlowRouter.current();
	    // use context to access the URL state
	    //console.log('%%%%%%%%%%%%%%%%%%%% FAVE BANDS ROUTE HAS CHANGED!!!!');
	    //console.log(context);
	    faveBandsContext.set(context);
		self.subscribe('artistsForSite');
		getTopBandDetails();
	});
});

function getTopBandDetails(){
	//faveBandsLoaded.set(false);
	if(!_.isUndefined(Session.get(faveBandsContext.get().params._id+'_uObj')))
	{
		var uid = Session.get(faveBandsContext.get().params._id+'_uObj').services.facebook.id;
		
		Meteor.call('getFaveBandList', uid, function(error,result){
		    if(error){
		        console.log(error.reason);
		    }
		    else{
		        // do something with result
			  	Session.set('ttb', result[0]);
			  	Session.set(faveBandsContext.get().params._id+'topBandsLength', result[0].length);
			  	Session.set('ttg', result[1]);
			  	faveBandsLoaded.set(true);
			  	Session.set('ttgldd', true);
		    };
		});
		
	}
}

function cleanedArtistName(artName){
	var cleaned = artName.replace(',', ' ');
	cleaned = cleaned.replace(/\s{2,}/g, ' ');
	if(cleaned.indexOf('&') >= 0)
	{
	  cleaned = cleaned.replace(/&/g, 'and');
	} 

	return cleaned;
}

function doesArtistHavePage(artName) {
  //console.log('CLIENT METHOD: SEARCHING TO SEE IF THIS SIMILAR ARTIST HAS A PAGE: ' + artName);
	var x = Artists.findOne({'name': {$regex: new RegExp('^' + artName + '$', 'i')}});
	//console.log("GOT THIS: ");
	//console.log(x);
	if(_.isEmpty(x))
	{
		//return false;
		Session.set(artName+'_hasPage', false);
		return false;
	}
	else
	{
		//return true;
		Session.set(artName+'_hasPage', true);
		return true;
	}
}

Template.profileFaveBands.events({
    "click #firstSixFaves": function (event) {
    	if(Session.get(faveBandsContext.get().params._id+'topBandsLength') > 6)
    	{
			//console.log('clicked first 6 faves');
			Session.set('f6Faves', true);
			Session.set('l6Faves', false);
		}
    },

    "click #lastSixFaves": function (event) {
    	if(Session.get(faveBandsContext.get().params._id+'topBandsLength') > 6)
    	{
			//console.log('clicked last 6 faves');
			Session.set('f6Faves', false);
			Session.set('l6Faves', true);
		}
    }
});



function getProperArtistName(artistName){
	if(artistName.indexOf(' & ') >= 0)
	{
		//console.log('IN FIRST IF CONDITION');
		//console.log(artistName);
		var x = Songs.find({sa: {$regex: new RegExp('^' + artistName + '$', 'i')}, cover: {'$ne': true}}).fetch();
		if(!_.isEmpty(x))
		{
			//console.log('THIS IS THE artist specific song LENGTH : ' + x.length);
			return artistName;
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
		var x = Songs.find({sa: {$regex: new RegExp('^' + artistName + '$', 'i')}, cover: {'$ne': true}}).fetch();
		if(!_.isEmpty(x))
		{
			//console.log('THIS IS THE artist specific song LENGTH : ' + x.length);
			return artistName;
		}
		else
		{
			artistName = artistName.replace(/ and /g, ' & ');
			//console.log('DID not find anything with just AND; replaced with & and now searching again!');
			//console.log(artistName);
			//x = Songs.find({sa: {$regex: new RegExp('^' + artistName + '$', 'i')}, cover: {'$ne': true}}).fetch();
			return artistName;
		}
	}
	else
	{
		//console.log('IN ELSE CONDITION');
		//var x = Songs.find({sa: {$regex: new RegExp('^' + artistName + '$', 'i')}, cover: {'$ne': true}}).fetch();
		return artistName;
	}
}