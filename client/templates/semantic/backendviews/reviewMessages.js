var genreListLoaded = new ReactiveVar(false);
var genreCursor = new ReactiveVar(0);
var genreCount = new ReactiveVar(0);
var calculatedPagingRange = new ReactiveVar(null);
var pagingCount = 10;

Template.reviewMessages.helpers({
	genresForReview: function() 
	{
		//return Session.get('esReview');
		return Genres.find({});
	},

	genreCount: function()
	{
		return genreCount.get();
	},

	currentCursorPosition: function() {
		//console.log('THIIIIIIS IS THE EXISTING SONG CURSOR: ' + genreCursor.get());
    	var x = Number(genreCursor.get()) + 1; 
    	var y = Number(genreCursor.get()) + pagingCount;
    	if(y > Counts.get('counterForGenres'))
    		y = Counts.get('counterForGenres');
    	return  x + '-' + y;
    },
    pagingRange: function() {
    	var x = _.range(0, Counts.get('counterForGenres'), pagingCount);
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
	genresLoaded: function() {
		return genreListLoaded.get();
	},
	genreListDoesNotRequirePaging: function() {
		return (Counts.get('counterForGenres') <= pagingCount)
	}
});

Template.reviewMessages.events({
	"click #beginningOfGenreList": function(event){
		genreListLoaded.set(false);
		genreCursor.set(0);
	},
    "click #previousGenres": function (event) {
      //console.log('CLICKED PREVIOUS button');
      if(Number(genreCursor.get()) > (pagingCount - 1))
      {
        //console.log('INSIDE if condition!!');
        genreListLoaded.set(false);
        genreCursor.set(Number(genreCursor.get()) - pagingCount);
        //iHist(true);
        //resetPlayedLengthSpecificToTab('me');
      }
      else
      {
        toastr.info("Reached the beginning of the existing song list; <br><br><b><i>try moving forward (->) to see more songs!</i></b><br><br>");
        //console.log('INSIDE else condition!!');
      }
    },

    "click #nextGenres": function (event) {
      //console.log('CLICKED next button');
      if(Number(genreCursor.get()) < Number(genreCount.get() - pagingCount))
      {
        //console.log('INSIDE if condition!!');
        genreListLoaded.set(false);
        genreCursor.set(Number(genreCursor.get()) + pagingCount);
        //iHist(true);
        //resetPlayedLengthSpecificToTab('me');
      }
      else
      {
        //console.log('INSIDE else condition!!');
        toastr.info("Reached the end of the existing song list; <br><br><b><i>try moving backwards (<-) to see more songs!</i></b><br><br>");
      }
    },
    "click #endOfGenreList": function(event){
		genreListLoaded.set(false);
		genreCursor.set(Number(genreCount.get()) - (Number(genreCount.get())%10));
	},
	"change #jumpPaging": function(event){
		//console.log('SELECTED AN OPTION!!!!!!');
		//console.log(event);		
		genreListLoaded.set(false);
		genreCursor.set(Number($('#jumpPaging').val()));
	}
});


Template.reviewMessages.onCreated(function() {
	var self = this;
	self.autorun(function() {
		FlowRouter.watchPathChange();
	    var context = FlowRouter.current();

	    self.subscribe('reviewGenres', genreCursor.get(), {onReady: genresSubLoaded});
		
		self.subscribe("genreCount", Meteor.user());
		genreCount.set(Counts.get('counterForGenres'));
	});
});

function genresSubLoaded(){
	genreListLoaded.set(true);
}