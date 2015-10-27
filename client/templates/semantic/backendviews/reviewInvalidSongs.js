var reviewExistingContext = new ReactiveVar(null);
var invalidSongListLoaded = new ReactiveVar(false);
var invalidSongCursor = new ReactiveVar(0);
var invalidSongCount = new ReactiveVar(0);
var calculatedPagingRange = new ReactiveVar(null);
var pagingCount = 10;

Template.reviewInvalidSongs.helpers({
	invalidSongsForReview: function() 
	{
		//return Session.get('esReview');
		return Songs.find({},{sort: {'sharedBy.systemDate': -1}});
	},

	invalidCount: function()
	{
		return invalidSongCount.get();
	},

	currentCursorPosition: function() {
		console.log('THIIIIIIS IS THE EXISTING SONG CURSOR: ' + invalidSongCursor.get());
    	var x = Number(invalidSongCursor.get()) + 1; 
    	var y = Number(invalidSongCursor.get()) + pagingCount;
    	if(y > Counts.get('counterForInvalidSongs'))
    		y = Counts.get('counterForInvalidSongs');
    	return  x + '-' + y;
    },
    pagingRange: function() {
    	var x = _.range(0, Counts.get('counterForInvalidSongs'), pagingCount);
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
		return invalidSongListLoaded.get();
	},
	songListDoesNotRequirePaging: function() {
		return (Counts.get('counterForInvalidSongs') <= pagingCount)
	}
});

Template.reviewInvalidSongs.events({
	"click #beginningOfSongList": function(event){
		invalidSongListLoaded.set(false);
		invalidSongCursor.set(0);
	},
    "click #previousSongs": function (event) {
      //console.log('CLICKED PREVIOUS button');
      if(Number(invalidSongCursor.get()) > (pagingCount - 1))
      {
        //console.log('INSIDE if condition!!');
        invalidSongListLoaded.set(false);
        invalidSongCursor.set(Number(invalidSongCursor.get()) - pagingCount);
        //iHist(true);
        //resetPlayedLengthSpecificToTab('me');
      }
      else
      {
        toastr.info("Reached the beginning of the existing song list; <br><br><b><i>try moving forward (->) to see more songs!</i></b><br><br>");
        //console.log('INSIDE else condition!!');
      }
    },

    "click #nextSongs": function (event) {
      //console.log('CLICKED next button');
      if(Number(invalidSongCursor.get()) < Number(invalidSongCount.get() - pagingCount))
      {
        //console.log('INSIDE if condition!!');
        invalidSongListLoaded.set(false);
        invalidSongCursor.set(Number(invalidSongCursor.get()) + pagingCount);
        //iHist(true);
        //resetPlayedLengthSpecificToTab('me');
      }
      else
      {
        //console.log('INSIDE else condition!!');
        toastr.info("Reached the end of the existing song list; <br><br><b><i>try moving backwards (<-) to see more songs!</i></b><br><br>");
      }
    },
    "click #endOfSongList": function(event){
		invalidSongListLoaded.set(false);
		invalidSongCursor.set(Number(invalidSongCount.get()) - (Number(invalidSongCount.get())%10));
	},
	"change #jumpPaging": function(event){
		//console.log('SELECTED AN OPTION!!!!!!');
		//console.log(event);		
		invalidSongListLoaded.set(false);
		invalidSongCursor.set(Number($('#jumpPaging').val()));
	}
});


Template.reviewInvalidSongs.onCreated(function() {
	var self = this;
	self.autorun(function() {
		FlowRouter.watchPathChange();
	    var context = FlowRouter.current();
	    reviewExistingContext.set(context);

	    self.subscribe('reviewInvalidSongs', invalidSongCursor.get(), {onReady: invalidSongsSubLoaded});
		
		self.subscribe("invalidSongCount", Meteor.user());
		invalidSongCount.set(Counts.get('counterForInvalidSongs'));
	});
});

function invalidSongsSubLoaded(){
	invalidSongListLoaded.set(true);
}