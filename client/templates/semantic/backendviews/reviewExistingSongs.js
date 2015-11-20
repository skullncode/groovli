var existingSongListLoaded = new ReactiveVar(false);
var existingSongCursor = new ReactiveVar(0);
var existingSongCount = new ReactiveVar(0);
var calculatedPagingRange = new ReactiveVar(null);
var existingSongReviewSearchResults = new ReactiveVar(null);
var pagingCount = 10;

Template.reviewExistingSongs.helpers({
	existingSongsForReview: function() 
	{
		//return Session.get('esReview');
		return Songs.find({},{sort: {'sharedBy.systemDate': -1}});
	},

	existingCount: function()
	{
		return existingSongCount.get();
	},

	currentCursorPosition: function() {
		//console.log('THIIIIIIS IS THE EXISTING SONG CURSOR: ' + existingSongCursor.get());
    	var x = Number(existingSongCursor.get()) + 1; 
    	var y = Number(existingSongCursor.get()) + pagingCount;
    	if(y > Counts.get('counterForExistingSongs'))
    		y = Counts.get('counterForExistingSongs');
    	return  x + '-' + y;
    },
    pagingRange: function() {
    	var x = _.range(0, Counts.get('counterForExistingSongs'), pagingCount);
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
		return existingSongListLoaded.get();
	},
	songListDoesNotRequirePaging: function() {
		Meteor.setTimeout(initiateSongTabs, 800);
		return (Counts.get('counterForExistingSongs') <= pagingCount)
	},
	searchResultsExist: function() {
		if(_.isNull(existingSongReviewSearchResults.get()) || _.isEmpty(existingSongReviewSearchResults.get()))
			return false
		else
			return true;
	},
	searchResultsForReview: function() {
		return existingSongReviewSearchResults.get();
	}
});

Template.reviewExistingSongs.events({
	"click #beginningOfSongList": function(event){
		existingSongListLoaded.set(false);
		existingSongCursor.set(0);
	},
    "click #previousSongs": function (event) {
      //console.log('CLICKED PREVIOUS button');
      if(Number(existingSongCursor.get()) > (pagingCount - 1))
      {
        //console.log('INSIDE if condition!!');
        existingSongListLoaded.set(false);
        existingSongCursor.set(Number(existingSongCursor.get()) - pagingCount);
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
      if(Number(existingSongCursor.get()) < Number(existingSongCount.get() - pagingCount))
      {
        //console.log('INSIDE if condition!!');
        existingSongListLoaded.set(false);
        existingSongCursor.set(Number(existingSongCursor.get()) + pagingCount);
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
		existingSongListLoaded.set(false);
		existingSongCursor.set(Number(existingSongCount.get()) - (Number(existingSongCount.get())%10));
	},
	"change #jumpPaging": function(event){
		//console.log('SELECTED AN OPTION!!!!!!');
		//console.log(event);		
		existingSongListLoaded.set(false);
		existingSongCursor.set(Number($('#jumpPaging').val()));
	}
});


Template.reviewExistingSongs.onCreated(function() {
	var self = this;
	self.autorun(function() {
		FlowRouter.watchPathChange();
	    var context = FlowRouter.current();

	    self.subscribe('reviewExistingSongs', existingSongCursor.get(), {onReady: existingSongsSubLoaded});
		
		self.subscribe("existingSongCount", Meteor.user());
		existingSongCount.set(Counts.get('counterForExistingSongs'));
	});
});

function existingSongsSubLoaded(){
	existingSongListLoaded.set(true);
}


function initiateSongTabs(){
	//console.log('initiating tabs!!!!');
	$('.reviewExistingSongsTabs .item').tab();
}


Template.reviewExistingSongs.onRendered(function () {
	$('.ui.search')
	  .search({
	    apiSettings: {
	      //url: '//localhost:3000/api/ss/{query}'
	      url: '//groovli.com/api/ss/{query}'
	    },
	    fields: {
	      results : 'apiResults',
	      title   : 'sa',
	      description : 'st'
	    },
	    onSelect: function(result, response) {
	    	//console.log('THIS IS THE RESULT!!:');
	    	//console.log(result);
			Session.set('clkdsrchresult', result);
	        //alert(result);
	        //var currentResults = Session.get('usrchResults');
	        if(_.isNull(existingSongReviewSearchResults.get()))
	        {
	        	existingSongReviewSearchResults.set([]);
	        }
	        
	        var currentResults = existingSongReviewSearchResults.get();
	        currentResults.push(result);
	        //Session.set('usrchResults', currentResults);
	        existingSongReviewSearchResults.set(currentResults);
	        
	        //Meteor.setTimeout(playSongFromSearchResult, 500);
	        /*var ytLinkID = result.sl.substring(result.sl.indexOf("v=")+2);
	        loadVideoById(ytLinkID);*/
	    },
	    minCharacters : 3
	  })
	;
});


function playSongFromSearchResult(){
	//console.log("GOING TO PLAYYYYYYYY the selected SONG in the search results:");
	//$('#sresultsTabHeader').click()
	setSongObjectBasedOnSearchResult(Session.get('clkdsrchresult'));
	amplitude.logEvent('played song from search result');
}