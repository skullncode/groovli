var artistListLoaded = new ReactiveVar(false);
var artistCursor = new ReactiveVar(0);
var artistCount = new ReactiveVar(0);
var calculatedPagingRange = new ReactiveVar(null);
var pagingCount = 10;

Template.semanticReviewArtists.helpers({
	artistsForReview: function() 
	{
		//return Session.get('esReview');
		return Artists.find({});
	},

	artistCount: function()
	{
		return artistCount.get();
	},

	currentCursorPosition: function() {
		//console.log('THIIIIIIS IS THE EXISTING SONG CURSOR: ' + artistCursor.get());
    	var x = Number(artistCursor.get()) + 1; 
    	var y = Number(artistCursor.get()) + pagingCount;
    	if(y > Counts.get('counterForArtists'))
    		y = Counts.get('counterForArtists');
    	return  x + '-' + y;
    },
    pagingRange: function() {
    	var x = _.range(0, Counts.get('counterForArtists'), pagingCount);
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
	artistsLoaded: function() {
		return artistListLoaded.get();
	},
	artistListDoesNotRequirePaging: function() {
		return (Counts.get('counterForArtists') <= pagingCount)
	}
});

Template.semanticReviewArtists.events({
	"click #beginningOfArtistList": function(event){
		artistListLoaded.set(false);
		artistCursor.set(0);
	},
    "click #previousArtists": function (event) {
      //console.log('CLICKED PREVIOUS button');
      if(Number(artistCursor.get()) > (pagingCount - 1))
      {
        //console.log('INSIDE if condition!!');
        artistListLoaded.set(false);
        artistCursor.set(Number(artistCursor.get()) - pagingCount);
        //iHist(true);
        //resetPlayedLengthSpecificToTab('me');
      }
      else
      {
        toastr.info("Reached the beginning of the existing song list; <br><br><b><i>try moving forward (->) to see more songs!</i></b><br><br>");
        //console.log('INSIDE else condition!!');
      }
    },

    "click #nextArtists": function (event) {
      //console.log('CLICKED next button');
      if(Number(artistCursor.get()) < Number(artistCount.get() - pagingCount))
      {
        //console.log('INSIDE if condition!!');
        artistListLoaded.set(false);
        artistCursor.set(Number(artistCursor.get()) + pagingCount);
        //iHist(true);
        //resetPlayedLengthSpecificToTab('me');
      }
      else
      {
        //console.log('INSIDE else condition!!');
        toastr.info("Reached the end of the existing song list; <br><br><b><i>try moving backwards (<-) to see more songs!</i></b><br><br>");
      }
    },
    "click #endOfArtistList": function(event){
		artistListLoaded.set(false);
		artistCursor.set(Number(artistCount.get()) - (Number(artistCount.get())%10));
	},
	"change #jumpPaging": function(event){
		//console.log('SELECTED AN OPTION!!!!!!');
		//console.log(event);		
		artistListLoaded.set(false);
		artistCursor.set(Number($('#jumpPaging').val()));
	}
});


Template.semanticReviewArtists.onCreated(function() {
	var self = this;
	self.autorun(function() {
		FlowRouter.watchPathChange();
	    var context = FlowRouter.current();

	    self.subscribe('reviewArtists', artistCursor.get(), {onReady: artistsSubLoaded});
		
		self.subscribe("artistCount", Meteor.user());
		artistCount.set(Counts.get('counterForArtists'));
	});
});

function artistsSubLoaded(){
	artistListLoaded.set(true);
}