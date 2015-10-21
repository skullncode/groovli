Session.setDefault('mgdr', []);
Session.setDefault('drl', false);

Template.mygroovTabs.helpers({
  dateRangeLoaded: function() {
    return Session.get('drl');
  },
  getDateRange: function() {
  	if(!Session.get('drl'))
  		getYearRangeForMyGroovs();
  }
});

Template.mygroovTabs.onRendered(function () {
	$('.ui.modal').modal();
	$('.tabular.menu .item').tab();
	//$('.ui.dropdown.flylistSelector').dropdown();
});

Template.mygroovTabs.onCreated(function() {
	Session.set("mLen", 0);
	Session.set("fLen", 0);
	Session.set("gLen", 0);
	var self = this;
	self.autorun(function() {
		self.subscribe('artistsForSite', {onReady: getAllGenres});
	});
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
		//Meteor.call('getDateRangeForMyGroovs', Meteor.user().services.facebook.id, function(error, result) {
		Meteor.call('getSongDateRangeForSpecificUser', Meteor.user().services.facebook.id, function(error, result) {
		  if(error)
		    console.log('Encountered error while trying to get date range for user songs!');
		  else
		  {
		    //console.log("GOT back this date range: ");
		    //console.log(result);
		    Session.set('mgdr', result);
		    if(result.length == 2)
		    	Session.set('selyr', result[1]);
		    else if(result.length == 1)
		    	Session.set('selyr', result[0]);

		    Session.set('drl', true);
		  }
		});
	}
}