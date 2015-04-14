Template.profile.helpers({
	memberSince: function() {
		return new moment(Meteor.user().createdAt).format('llll');
	},

	personalSongCount: function() {
		var c = Songs.find({$and: [{'sharedBy.uid': Meteor.user().services.facebook.id}, {$or: [{'iTunesValid': 'VALID'},{'LFMValid': 'VALID'}]}]}).fetch();
		if(!_.isUndefined(c))
			return c.length;
		else
			return 0;	
	},

	ratingCount: function() {
		var r = Session.get('personalRC');
	  	Meteor.call('getRatingCountForUser', Meteor.user().services.facebook.id, function(error,result){
		    if(error){
		        console.log(error.reason);
		    }
		    else{
		        // do something with result
			  	Session.set('personalRC',result);
		    };
		});
		if(!_.isUndefined(r))
			return r;
		else
			return 0;
	},

	topTenBands: function() {
		var b = Songs.find({$and: [{'sharedBy.uid': Meteor.user().services.facebook.id}, {$or: [{'iTunesValid': 'VALID'},{'LFMValid': 'VALID'}]}]}, {fields: {'sa':1}}).fetch();
		var t = _.chain(b).countBy("sa").pairs().sortBy(function(pair) {return -pair[1];}).first(10).pluck(0).value();
		var topTenb = [];
		_.chain(t).map(function(value){topTenb.push({'sa': value})});
		//console.log(topTen);
		Session.set('topBandsLength', topTenb.length);
		return topTenb;
	},

	topBandLength: function() {
		return Session.get('topBandsLength');
	},

	topTenGenres: function() {
		var g = Songs.find({$and: [{'sharedBy.uid': Meteor.user().services.facebook.id}, {$or: [{'iTunesValid': 'VALID'},{'LFMValid': 'VALID'}]}]}, {fields: {'genre':1}}).fetch();
		var t = _.chain(g).countBy("genre").pairs().sortBy(function(pair) {return -pair[1];}).pluck(0).value();//.first(20).pluck(0).value();
		var topTeng = [];
		//console.log(t);
		var gCounter = 0;
		_.chain(t).map(function(value){if(value !== 'undefined' && gCounter < 10){gCounter++;topTeng.push({'genre': value})}});
		//console.log(topTeng);
		Session.set('topGenresLength', topTeng.length);
		return topTeng;
	},

	topGenreLength: function() {
		return Session.get('topGenresLength');
	}
});