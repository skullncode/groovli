//Session.setDefault('followingLd', false); //followers loaded.
var followingContext = new ReactiveVar(null);
var userIDsForTastemakers = new ReactiveVar(null);
var tastemakerDetailsLoaded = new ReactiveVar(false);
var smallerChunkedTastemakers = new ReactiveVar(null);
var upperCounterPosition = new ReactiveVar(0);
var pagingLimitForTastemakers = 12;

Template.profileFollowingSidebar.helpers({
	peopleFollowedByUser: function() {
		if(!_.isUndefined(Session.get(followingContext.get().params._id+'_uObj')) && Session.get(followingContext.get().params._id+'_uObjLoaded'))
		{
			//return Session.get(followingContext.get().params._id+'_uObj').tastemakers;
			

			//console.log('##########THIS IS THE FINAL chunked tastemaker: ');
			//console.log(smallerChunkedTastemakers);
			if(!_.isNull(smallerChunkedTastemakers.get()))
				return smallerChunkedTastemakers.get()[Session.get(followingContext.get().params._id+'_followingcurs')];
			else
				[];
		}
	},
	followingLink: function() {
		if(!_.isNull(this) && !_.isUndefined(this) && !_.isNull(userIDsForTastemakers.get()) && !_.isUndefined(this.fbid))
		{
			tastemakerDetailsLoaded.set(true);
			var x = _.findWhere(userIDsForTastemakers.get(), {'fbid':String(this.fbid)});
			if(!_.isUndefined(x))
			{
				return "/profile/"+x._id;
			}
			else
			{
				return "";
			}
		}
		else
			return "";
	},

	notFollowingAnybody: function() {
		if(!_.isUndefined(Session.get(followingContext.get().params._id+'_uObj')))
		{
			var x = Session.get(followingContext.get().params._id+'_uObj');
			if(_.isUndefined(x.tastemakers))
				return true;
			else
				return false;
		}
	},

	followingCount: function() {
		if(!_.isUndefined(Session.get(followingContext.get().params._id+'_uObj')))
		{
			var x = Session.get(followingContext.get().params._id+'_uObj');
			if(!_.isUndefined(x.tastemakers))
				return x.tastemakers.length;
			else
				return 0;
		}
	},
	//less tastemakers than having to enable the paging buttons
	tastemakersLessThanPagingLimit: function() {
		if(!_.isUndefined(Session.get(followingContext.get().params._id+'_uObj')))
		{
			var x = Session.get(followingContext.get().params._id+'_uObj');
			if(!_.isUndefined(x.tastemakers))
				return x.tastemakers.length <= pagingLimitForTastemakers;
			else
				return true;
		}
	},
	tastemakerDetailsLoaded:function() {
		return tastemakerDetailsLoaded.get();
	},
	counterPosition: function() {
		if(Session.get(followingContext.get().params._id+'_uObj').tastemakers.length > 0 && !_.isUndefined(smallerChunkedTastemakers.get()[Session.get(followingContext.get().params._id+'_followingcurs')]))
		{
			var multiplier = pagingLimitForTastemakers * Session.get(followingContext.get().params._id+'_followingcurs');
			var x = 1 + multiplier;
	    	upperCounterPosition.set(x + smallerChunkedTastemakers.get()[Session.get(followingContext.get().params._id+'_followingcurs')].length-1);
	    	if(upperCounterPosition.get() > Session.get(followingContext.get().params._id+'_uObj').tastemakers.length)
	    		upperCounterPosition.set(Session.get(followingContext.get().params._id+'_uObj').tastemakers.length);
	    	return  x + '-' + upperCounterPosition.get() + ' of ';
    	}
    	else
    	{
    		return '';
    	}
	}
});



Template.profileFollowingSidebar.onCreated(function() {
	var self = this;
	self.autorun(function() {
		/*if(!_.isUndefined(Session.get(followingContext.get().params._id+'_uObj')))
		{*/
		FlowRouter.watchPathChange();
    	var context = FlowRouter.current();
    	followingContext.set(context);
    	Session.setDefault(followingContext.get().params._id+'_followingcurs', 0);
    	//console.log("$$$$$$$$$$$$$$$$$ this is the tastemakers object!!");
    	//console.log(Session.get(followingContext.get().params._id+'_uObj').tastemakers);
    	tastemakerDetailsLoaded.set(false);
    	if(!_.isUndefined(Session.get(followingContext.get().params._id+'_uObj')))
    	{
	    	Meteor.call('getUserIDsForSocIDs', Session.get(followingContext.get().params._id+'_uObj').tastemakers, function(error,result){
			    if(error){
			        console.log(error.reason);
			    }
			    else{
			        // do something with result
				  	//console.log('GOT BACK A RESULT FROM THE SERVER:');
				  	//console.log(result);
				  	userIDsForTastemakers.set(result);
				  	tastemakerDetailsLoaded.set(true);
			    };
			});

	    	if(!_.isUndefined(Session.get(followingContext.get().params._id+'_uObj').tastemakers) && Session.get(followingContext.get().params._id+'_uObj').tastemakers.length > 0)
	    	{
	    		//console.log('TASTEMAKERS is not BLANK for this user!!!!!!!!');
				var a = Session.get(followingContext.get().params._id+'_uObj').tastemakers;
				var size = 12;
				var tempChunk = [];
				while (a.length > 0) {
				  chunk = a.splice(0,size)
				  tempChunk.push(chunk);
				  //smallerChunkedTastemakers.push(chunk);
				}
				smallerChunkedTastemakers.set(tempChunk);
			}
			else
			{
				//console.log('TASTEMAKERS is BLANK for this user!!!!!!!!');
				smallerChunkedTastemakers.set([])
			}
    	}
		//Session.set('followingLd',false);
		//isFollowingReady();
		//}
	});
});

Template.profileFollowingSidebar.events({
    "click #previousFollowingList": function (event) {
      //console.log('CLICKED PREVIOUS button');
      if(Number(Session.get(followingContext.get().params._id+'_followingcurs')) > 0)
      {
        //console.log('INSIDE if condition!!');
        Session.set(followingContext.get().params._id+'_followingcurs', Session.get(followingContext.get().params._id+'_followingcurs') - 1);
        //iHist(true);
        //resetPlayedLengthSpecificToTab('me');
      }
    },

    "click #nextFollowingList": function (event) {
      //console.log('CLICKED next button');
      if(upperCounterPosition.get() < Session.get(followingContext.get().params._id+'_uObj').tastemakers.length - 1)
      {
        //console.log('INSIDE if condition!!');
        Session.set(followingContext.get().params._id+'_followingcurs', Session.get(followingContext.get().params._id+'_followingcurs') + 1);
      }
    },
    "click #userProfileFollowingLink": function(event) {
    	//console.log('clicked user profile link');
    	FlowRouter.go($(event.target.parentElement).attr('href'));
    }
});

	