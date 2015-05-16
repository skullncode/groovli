Template.profile.helpers({

	userObjectForRoute: function() {
		getUserForRouting();
		var x = Session.get(Router.current().params._id+'_uObj')
		//console.log('THIS IS THE USER FOUND FOR: ');
		//console.log(x);
		return x;
	},

	alreadyFollowed: function() {
		var x = Session.get(Router.current().params._id+'_uObj')
		if(_.isUndefined(_.findWhere(Meteor.user().tastemakers, {'fbid': x.services.facebook.id})))
			return false;
		else
			return true;
	},

	memberSince: function(createdDate) {
		return new moment(createdDate).format('llll');
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
		var b = Songs.find({$and: [{'sharedBy.uid': uid}, {$or: [{'iTunesValid': 'VALID'},{'LFMValid': 'VALID'}]}]}, {fields: {'sa':1}}).fetch();
		var t = _.chain(b).countBy("sa").pairs().sortBy(function(pair) {return -pair[1];}).first(10).pluck(0).value();
		var topTenb = [];
		_.chain(t).map(function(value){topTenb.push({'sa': value})});
		//console.log(topTen);
		Session.set(Router.current().params._id+'topBandsLength', topTenb.length);
		return topTenb;
	},

	topBandLength: function() {
		return Session.get(Router.current().params._id+'topBandsLength');
	},

	topTenGenres: function(uid) {
		var g = Songs.find({$and: [{'sharedBy.uid': uid}, {$or: [{'iTunesValid': 'VALID'},{'LFMValid': 'VALID'}]}]}, {fields: {'genre':1}}).fetch();
		var t = _.chain(g).countBy("genre").pairs().sortBy(function(pair) {return -pair[1];}).pluck(0).value();//.first(20).pluck(0).value();
		var topTeng = [];
		//console.log(t);
		var gCounter = 0;
		_.chain(t).map(function(value){if(value !== 'undefined' && gCounter < 10){gCounter++;topTeng.push({'genre': value})}});
		//console.log(topTeng);
		Session.set(Router.current().params._id+'topGenresLength', topTeng.length);
		return topTeng;
	},

	topGenreLength: function() {
		return Session.get(Router.current().params._id+'topGenresLength');
	},

	userProfileIsNotYou: function() {
		return Router.current().params._id !== Meteor.user()._id;
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