var reviewExistingContext = new ReactiveVar(null);
var pendingSongListLoaded = new ReactiveVar(false);
var pendingSongCursor = new ReactiveVar(0);
var pendingSongCount = new ReactiveVar(0);
var calculatedPagingRange = new ReactiveVar(null);
var pagingCount = 10;

Template.reviewPendingSongs.helpers({
	pendingSongsForReview: function() 
	{
		//return Session.get('esReview');
		return Songs.find({},{sort: {'sharedBy.systemDate': -1}});
	},

	pendingCount: function()
	{
		return pendingSongCount.get();
	},

	currentCursorPosition: function() {
		console.log('THIIIIIIS IS THE EXISTING SONG CURSOR: ' + pendingSongCursor.get());
    	var x = Number(pendingSongCursor.get()) + 1; 
    	var y = Number(pendingSongCursor.get()) + pagingCount;
    	if(y > Counts.get('counterForPendingSongs'))
    		y = Counts.get('counterForPendingSongs');
    	return  x + '-' + y;
    },
    pagingRange: function() {
    	var x = _.range(0, Counts.get('counterForPendingSongs'), pagingCount);
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
		return pendingSongListLoaded.get();
	},
	songListDoesNotRequirePaging: function() {
		return (Counts.get('counterForPendingSongs') <= pagingCount)
	}
});

Template.reviewPendingSongs.events({
	"click #beginningOfSongList": function(event){
		pendingSongListLoaded.set(false);
		pendingSongCursor.set(0);
	},
    "click #previousSongs": function (event) {
      //console.log('CLICKED PREVIOUS button');
      if(Number(pendingSongCursor.get()) > (pagingCount - 1))
      {
        //console.log('INSIDE if condition!!');
        pendingSongListLoaded.set(false);
        pendingSongCursor.set(Number(pendingSongCursor.get()) - pagingCount);
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
      if(Number(pendingSongCursor.get()) < Number(pendingSongCount.get() - pagingCount))
      {
        //console.log('INSIDE if condition!!');
        pendingSongListLoaded.set(false);
        pendingSongCursor.set(Number(pendingSongCursor.get()) + pagingCount);
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
		pendingSongListLoaded.set(false);
		pendingSongCursor.set(Number(pendingSongCount.get()) - (Number(pendingSongCount.get())%10));
	},
	"change #jumpPaging": function(event){
		//console.log('SELECTED AN OPTION!!!!!!');
		//console.log(event);		
		pendingSongListLoaded.set(false);
		pendingSongCursor.set(Number($('#jumpPaging').val()));
	}
});


Template.reviewPendingSongs.onCreated(function() {
	var self = this;
	self.autorun(function() {
		FlowRouter.watchPathChange();
	    var context = FlowRouter.current();
	    reviewExistingContext.set(context);

	    self.subscribe('reviewPendingSongs', pendingSongCursor.get(), {onReady: pendingSongsSubLoaded});
		
		self.subscribe("pendingSongCount", Meteor.user());
		pendingSongCount.set(Counts.get('counterForPendingSongs'));
	});
});

function pendingSongsSubLoaded(){
	pendingSongListLoaded.set(true);
}