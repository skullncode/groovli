var msgListLoaded = new ReactiveVar(false);
var msgCursor = new ReactiveVar(0);
var msgCount = new ReactiveVar(0);
var calculatedPagingRange = new ReactiveVar(null);
var pagingCount = 10;

Template.reviewMessages.helpers({
	msgsForReview: function() 
	{
		//return Session.get('esReview');
		return Messages.find({},{sort: {'timestamp':-1}});
	},

	msgCount: function()
	{
		return msgCount.get();
	},

	currentCursorPosition: function() {
		//console.log('THIIIIIIS IS THE EXISTING SONG CURSOR: ' + genreCursor.get());
    	var x = Number(msgCursor.get()) + 1; 
    	var y = Number(msgCursor.get()) + pagingCount;
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
	msgsLoaded: function() {
		return msgListLoaded.get();
	},
	msgListDoesNotRequirePaging: function() {
		return (Counts.get('counterForMsgs') <= pagingCount)
	}
});

Template.reviewMessages.events({
	"click #beginningOfMsgList": function(event){
		msgListLoaded.set(false);
		msgCursor.set(0);
	},
    "click #previousMsgs": function (event) {
      //console.log('CLICKED PREVIOUS button');
      if(Number(msgCursor.get()) > (pagingCount - 1))
      {
        //console.log('INSIDE if condition!!');
        msgListLoaded.set(false);
        msgCursor.set(Number(msgCursor.get()) - pagingCount);
        //iHist(true);
        //resetPlayedLengthSpecificToTab('me');
      }
      else
      {
        toastr.info("Reached the beginning of the existing message list; <br><br><b><i>try moving forward (->) to see more messages!</i></b><br><br>");
        //console.log('INSIDE else condition!!');
      }
    },

    "click #nextMsgs": function (event) {
      //console.log('CLICKED next button');
      if(Number(msgCursor.get()) < Number(msgCount.get() - pagingCount))
      {
        //console.log('INSIDE if condition!!');
        msgListLoaded.set(false);
        msgCursor.set(Number(msgCursor.get()) + pagingCount);
        //iHist(true);
        //resetPlayedLengthSpecificToTab('me');
      }
      else
      {
        //console.log('INSIDE else condition!!');
        toastr.info("Reached the end of the existing message list; <br><br><b><i>try moving backwards (<-) to see more messages!</i></b><br><br>");
      }
    },
    "click #endOfMsgList": function(event){
		msgListLoaded.set(false);
		msgCursor.set(Number(msgCount.get()) - (Number(msgCount.get())%10));
	},
	"change #jumpPaging": function(event){
		//console.log('SELECTED AN OPTION!!!!!!');
		//console.log(event);		
		msgListLoaded.set(false);
		msgCursor.set(Number($('#jumpPaging').val()));
	}
});


Template.reviewMessages.onCreated(function() {
	var self = this;
	self.autorun(function() {
		FlowRouter.watchPathChange();
	    var context = FlowRouter.current();

	    self.subscribe('reviewMessages', msgCursor.get(), {onReady: msgsSubLoaded});
		
		self.subscribe("msgsForReviewCount", Meteor.user());
		msgCount.set(Counts.get('counterForReviewMsgs'));
	});
});

function msgsSubLoaded(){
	msgListLoaded.set(true);
}