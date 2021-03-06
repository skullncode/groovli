Session.setDefault('gldr', []);
Session.setDefault('gldrl', false);

Template.globalTabs.helpers({
  dateRangeLoaded: function() {
    return Session.get('gldrl');
  },
  getDateRange: function() {
  	if(!Session.get('gldrl'))
  		getGlobalYearRange();
  },
  initiateSongTabs: function() {
  	Meteor.setTimeout(initiateSongTabs, 800);
  },
  activatePopups: function() {
    Meteor.setTimeout(activatePopups, 800);
  },
  notifsEnabled: function() {
    if(!_.isUndefined(Meteor.user()) && !_.isUndefined(Meteor.user().notifsEnabled))
    {
      return Meteor.user().notifsEnabled;
    }
    else
    {
      return true;
    }
  }
});

Template.globalTabs.onRendered(function () {
	$('.ui.modal').modal();
	//$('.ui.dropdown.flylistSelector').dropdown();
});

Template.globalTabs.onCreated(function() {
	Session.set("mLen", 0);
	Session.set("fLen", 0);
	Session.set("gLen", 0);
	var self = this;
	self.autorun(function() {
		self.subscribe('artistsForSite', {onReady: getAllGenres});
	});
	initiateSongTabs();
	activatePopups();
});

function getAllGenres(){
	//console.log('artist SUB READY!!!');
  	var g = Artists.find({}, {fields: {"genres": 1}}).fetch();
  	var allGens = [];
  	//console.log("THIS IS THE LENGTH OF THE artist collection: ");
  	//console.log(g.length);
	_.each(g, function(z){
		//console.log('THIS IS A GENRE: ');
		_.each(z.genres, function(y){
			if(!_.isNull(y) && !_.isEmpty(y))
			{
				y = y.replace(/-/g, ' ');
				y = y.replace(/'n'/g, ' and ');
				allGens.push(y);
			}
		});
	});
	//console.log('this is the master gen list: ');
	//console.log(allGens.length);

	allGens = _.uniq(allGens);
	allGens = _.without(allGens, null, undefined, 'all'); 

	//console.log('this is the unique gen list:');
	//console.log(allGens.length);

	Session.set('agens', allGens);
}

function getGlobalYearRange() {
	//console.log("GOING TO GET date range for Global groovs!!");
	if(!_.isUndefined(Meteor.user()) && !_.isUndefined(Meteor.user().services) && !_.isUndefined(Meteor.user().services.facebook))
	{
		var excludedIDsForGlobalFilter = getIDsToExcludeForGlobalFilter();
		Meteor.call('getDateRangeForGlobal', excludedIDsForGlobalFilter, function(error, result) {
		  if(error)
		    console.log('Encountered error while trying to get date range for user songs!');
		  else
		  {
		    //console.log("###############################################GOT back this date range: ");
		    //console.log(result);
		    Session.set('gldr', result);
		    //console.log("this is the gldr:");
		    //console.log(Session.get('gldr'));
		    var lastGlYrIndex = Session.get('gldr').length-1;
		    //console.log("LAST INDEX GLL INDEX IS: ");
		    //console.log(lastGlYrIndex);
		    if(result.length == 2)
		    {
		    	//Session.set('selyr', result[1]);
		    	Session.set('glSelyr','all years'); //choose to begin my groovs with ALL groovs not the latest year
		    }
		    else if(result.length == 1)
		    	Session.set('glSelyr', result[lastGlYrIndex]); //set last year in global date range as selected year

		    Session.set('gldrl', true);

		  }
		});
	}
}


function initiateSongTabs() {
	$('.tabular.menu .item').tab();
}

function activatePopups(){
  $('#globalTabHeader').popup();
}