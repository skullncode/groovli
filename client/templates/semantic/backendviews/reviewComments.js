var commentsListLoaded = new ReactiveVar(false);
var commentsCursor = new ReactiveVar(0);
var commentsCount = new ReactiveVar(0);
var calculatedPagingRange = new ReactiveVar(null);
var pagingCount = 10;

Template.reviewComments.helpers({
	commentsForReview: function() 
	{
		//return Session.get('esReview');
		return Comments.find({},{sort: {'createdAt':-1}});
	},

	commentsCount: function()
	{
		return commentsCount.get();
	},

	currentCursorPosition: function() {
		//console.log('THIIIIIIS IS THE EXISTING SONG CURSOR: ' + genreCursor.get());
    	var x = Number(commentsCursor.get()) + 1; 
    	var y = Number(commentsCursor.get()) + pagingCount;
    	if(y > Counts.get('counterForReviewComments'))
    		y = Counts.get('counterForReviewComments');
    	return  x + '-' + y;
    },
    pagingRange: function() {
    	var x = _.range(0, Counts.get('counterForReviewComments'), pagingCount);
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
	commentsLoaded: function() {
		return commentsListLoaded.get();
	},
	commentsListDoesNotRequirePaging: function() {
		return (Counts.get('counterForReviewComments') <= pagingCount)
	}
});

Template.reviewComments.events({
	"click #beginningOfCommentList": function(event){
		commentsListLoaded.set(false);
		commentsCursor.set(0);
	},
    "click #previousComments": function (event) {
      //console.log('CLICKED PREVIOUS button');
      if(Number(commentsCursor.get()) > (pagingCount - 1))
      {
        //console.log('INSIDE if condition!!');
        commentsListLoaded.set(false);
        commentsCursor.set(Number(commentsCursor.get()) - pagingCount);
        //iHist(true);
        //resetPlayedLengthSpecificToTab('me');
      }
      else
      {
        toastr.info("Reached the beginning of the existing comment list; <br><br><b><i>try moving forward (->) to see more comments!</i></b><br><br>");
        //console.log('INSIDE else condition!!');
      }
    },

    "click #nextComments": function (event) {
      //console.log('CLICKED next button');
      if(Number(commentsCursor.get()) < Number(commentsCount.get() - pagingCount))
      {
        //console.log('INSIDE if condition!!');
        commentsListLoaded.set(false);
        commentsCursor.set(Number(commentsCursor.get()) + pagingCount);
        //iHist(true);
        //resetPlayedLengthSpecificToTab('me');
      }
      else
      {
        //console.log('INSIDE else condition!!');
        toastr.info("Reached the end of the existing comment list; <br><br><b><i>try moving backwards (<-) to see more comments!</i></b><br><br>");
      }
    },
    "click #endOfCommentsList": function(event){
		commentsListLoaded.set(false);
		commentsCursor.set(Number(commentsCount.get()) - (Number(commentsCount.get())%10));
	},
	"change #jumpPaging": function(event){
		//console.log('SELECTED AN OPTION!!!!!!');
		//console.log(event);		
		commentsListLoaded.set(false);
		commentsCursor.set(Number($('#jumpPaging').val()));
	}
});


Template.reviewComments.onCreated(function() {
	var self = this;
	self.autorun(function() {
		FlowRouter.watchPathChange();
	    var context = FlowRouter.current();

	    self.subscribe('reviewComments', commentsCursor.get(), {onReady: commentsSubLoaded});
		
		self.subscribe("commentsForReviewCount", Meteor.user());
		commentsCount.set(Counts.get('counterForReviewComments'));
	});
});

function commentsSubLoaded(){
	commentsListLoaded.set(true);
}