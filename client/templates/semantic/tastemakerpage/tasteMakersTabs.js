Session.setDefault('mgdr', []);
Session.setDefault('drl', false);

Template.tasteMakersTabs.helpers({
  dateRangeLoaded: function() {
    return Session.get('drl');
  },
  getDateRange: function() {
  	if(!Session.get('drl'))
  		getYearRangeForMyGroovs();
  },
  currentlyOnTastemakersPath: function() {
    if(Session.get('cr') === '/tastemakers')
      return true;
    else
      return false;
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

Template.tasteMakersTabs.onRendered(function () {
	$('.ui.modal').modal();
	//$('.ui.dropdown.flylistSelector').dropdown();
});

Template.tasteMakersTabs.onCreated(function() {
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

function getYearRangeForMyGroovs() {
	//console.log("GOING TO GET date range for MY GROOVS!!!");
	if(!_.isUndefined(Meteor.user()) && !_.isUndefined(Meteor.user().services) && !_.isUndefined(Meteor.user().services.facebook))
	{
		Meteor.call('getDateRangeForMyGroovs', Meteor.user().services.facebook.id, function(error, result) {
		  if(error)
		    console.log('Encountered error while trying to get date range for user songs!');
		  else
		  {
		    //console.log("GOT back this date range: ");
		    //console.log(result);
		    Session.set('mgdr', result);
		    Session.set('selyr', result[1]);
		    Session.set('drl', true);
		  }
		});
	}
}
function initiateSongTabs(){
	//console.log('################################## initiating song tabs!!!!');
	$('.tabular.menu .item').tab();
}

function activatePopups(){
  $('#tastemakersTabHeader').popup();
}