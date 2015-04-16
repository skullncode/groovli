Listens = new Mongo.Collection('listens');

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
	      	//console.log('################ song listen succesfully ISNERTED for: ' + searchString);
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
		var lh = Listens.find({'uid': uid}, {sort: {timestamp: -1}}).fetch();
		//console.log('THIS IS THE LISTEN HISTORY FOR THIS USR: ');
		//console.log(lh);
		return lh;
		//var x = Songs.findOne({'sl': lh[0].sl});
		//console.log('THIS IS THE SONG OBJECT FOR THE FIRST LINK: ');
		//console.log(x);
	}
});