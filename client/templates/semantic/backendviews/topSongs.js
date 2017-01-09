var songsListLoaded = new ReactiveVar(false);
var songCursor = new ReactiveVar(0);
var songCount = new ReactiveVar(0);
var calculatedPagingRange = new ReactiveVar(null);
var pagingCount = 10;
var topSongList = new ReactiveVar(null);
var masterSongList = new ReactiveVar(null);

Template.topSongs.helpers({
	listOfTopSongs: function() 
	{
		//return Session.get('esReview');
		//return Listens.find({},{sort: {'timestamp':-1}});
		return Session.get("topSongList");
	},

	songCount: function()
	{
		return songCount.get();
	},

	currentCursorPosition: function() {
		//console.log('THIIIIIIS IS THE EXISTING SONG CURSOR: ' + genreCursor.get());
    	var x = Number(songCursor.get()) + 1; 
    	var y = Number(songCursor.get()) + pagingCount;
    	if(y > Counts.get('counterForReviewMsgs'))
    		y = Counts.get('counterForReviewMsgs');
    	return  x + '-' + y;
    },
    pagingRange: function() {
    	var x = _.range(0, Counts.get('counterForReviewMsgs'), pagingCount);
    	calculatedPagingRange.set(x);
    	return calculatedPagingRange.get();
    },
    userIsAnAdmin: function() {
		if (!_.isNull(Meteor.user()) && !_.isUndefined(Meteor.user())) {
		    loggedInUser = Meteor.user();
		    isAdmin = Roles.userIsInRole(loggedInUser, ['admin']);
		    //console.log('IN admin check function!');
		    //console.log('THIS IS the user: ');
		    //console.log(loggedInUser);
		    if (!isAdmin && !_.isUndefined(loggedInUser.services) && !_.isUndefined(loggedInUser.services.facebook) && loggedInUser.services.facebook.email !== "reverieandreflection@gmail.com"){
		      //console.log('NOT AN ADMIN so routing back to root!!!!!');
		      FlowRouter.go('/');
		    }
		    else
		    {
		      //console.log('this person IS AN ADMIN so NOT DOING ANYTHING!!!!!');
		      return true;
		    }
		  }
		  else {
		      //console.log('user is null, so routing back to root!!!!!');
		      //console.log(Meteor.user());
		      FlowRouter.go('/');
		  }
	},
	songsLoaded: function() {
		return songsListLoaded.get();
	}
});

Template.topSongs.events({
	"click #loadSomeMoreTopSongs": function(event){
		newSongAddition = topSongList.concat(masterSongList.splice(0,10));
		topSongList = newSongAddition;
		songCount.set(topSongList.length);
		Session.set("topSongList", topSongList);
	}
});


Template.topSongs.onCreated(function() {
	var self = this;
	self.autorun(function() {
		FlowRouter.watchPathChange();
	    var context = FlowRouter.current();
			getTopSongs();
	    //self.subscribe('topSongs', songCursor.get(), {onReady: topSongsSubLoaded});
		
		//self.subscribe("msgsForReviewCount", Meteor.user());
		//songCount.set(Counts.get('counterForReviewMsgs'));
	});
});

function topSongsSubLoaded(){
	songsListLoaded.set(true);
}

function getTopSongs(){
	Meteor.call('getTopSongsBasedOnListenCount', songCursor.get(), function(error, result) {
		if(error)
		{
			console.log('Encountered error while trying to get list of top songs');
			console.log(error);
		}
		else
		{
			masterSongList = result;
			topSongList = masterSongList.splice(0,10);
			Session.set("topSongList", topSongList);
			songCount.set(topSongList.length);
			topSongsSubLoaded();
		}
	});
}