Listens = new Mongo.Collection('listens');

Listens.allow({
  insert: function() {
    return false;
  },
  update: function() {
    return false;
  },
  remove: function() {
    return false;
  }
});

Meteor.methods({
	insertSongListen: function(sid, type){
		//console.log('INSIDE THE UPDATE LISTEN couNT METHOD FOR SONG SERVER CONTROLLER');
		//console.log('going to update the listen count for: '+ sid);
		var userID = Meteor.user()._id;
		var searchString = '';
		if (type == 'yt')
		{
			searchString = 'https://www.youtube.com/watch?v=' + sid;
		}

		Listens.insert({ 'sl': searchString, 'uid': userID, 'timestamp': new Date()}, function(error) {
	      if (error) {
	        // display the error to the user
	        console.log(error.reason);
	      }
	      else{
	      	console.log('################ song listen succesfully INSERTED for: ' + searchString);
	      }
		});
	},
	getTotalListenCountForSong: function(linkSID, linktype){
		///var userID = Meteor.user().services.facebook.id;
		var searchString = '';
		if (linktype == 'yt')
		{
			searchString = 'https://www.youtube.com/watch?v=' + linkSID;
		}
		//get personal rating for song

		var totalListenCount = Listens.find({'sl': searchString}).count();
		//console.log('THIS IS THE TOTAL LISTEN COUNT FOR THIS SONG: ' + totalListenCount);
		return totalListenCount;
	},
	getListenHistoryForUser: function(uid){
		var lh = Listens.find({'uid': uid}, {sort: {timestamp: -1}, limit:200}).fetch();
		//console.log('THIS IS THE LISTEN HISTORY FOR THIS USR: ');
		//console.log(lh);
		return lh;
		//var x = Songs.findOne({'sl': lh[0].sl});
		//console.log('THIS IS THE SONG OBJECT FOR THE FIRST LINK: ');
		//console.log(x);
	},

	getMutualListenHistory: function(lh, uid){
		//console.log('this is the listen history got: ');
		//console.log(lh);
		//console.log('Mutual Listen History: and this is the UID: ');
		//console.log(uid);
		var mlh = [];
		_.each(lh, function(x) {
			//console.log(x.sl);
			var results = Listens.find({'sl': x.sl, 'uid': {'$ne': uid}}, {sort: {timestamp: -1}}).fetch();
			if(!_.isEmpty(results))
				mlh.push(results);
		});
		//console.log('Finished EACH METHOD: ');
		//console.log(mlh);
		var socialLinks = [];

		_.each(mlh, function(y) {
			_.each(y, function(z){
				var a = Meteor.users.findOne(z.uid);
				if(!_.isUndefined(a))
					socialLinks.push({timestamp: z.timestamp, sl: z.sl, _id: z.uid, soc_id: a.services.facebook.id, soc_name: a.profile.name});
			});
		});

		//console.log('FINISHED MAP FUNCTION: ');
		//console.log(socialLinks);
		return socialLinks;
	}
});