Template.semantictabs.onRendered(function () {
	$('.ui.modal').modal();
	
	//$('.ui.dropdown.flylistSelector').dropdown();
});

Template.semantictabs.helpers({
  initiateSongTabs: function() {
  	Meteor.setTimeout(initiateSongTabs, 800);
  }
});

Template.semantictabs.onCreated(function() {
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

function initiateSongTabs(){
	//console.log('################################## initiating song tabs!!!!');
	$('.tabular.menu .item').tab();
}