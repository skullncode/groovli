//Session.setDefault('followingLd', false); //followers loaded.
var followingContext = new ReactiveVar(null);
var userIDsForTastemakers = new ReactiveVar(null);

Template.profileFollowingSidebar.helpers({
	peopleFollowedByUser: function() {
		if(!_.isUndefined(Session.get(followingContext.get().params._id+'_uObj')) && Session.get(followingContext.get().params._id+'_uObjLoaded'))
		{
			//return Session.get(Session.get(followingContext.get().params._id+'_uObj')._id+'_fclist');
			return Session.get(followingContext.get().params._id+'_uObj').tastemakers;
		}
	},
	followingLink: function() {
		if(!_.isNull(this) && !_.isUndefined(this) && !_.isNull(userIDsForTastemakers.get()) && !_.isUndefined(this.fbid))
		{
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

	viewingFirst6Faves: function() {
		if(!_.isUndefined(Session.get(followingContext.get().params._id+'_uObj')))
		{
			if(Session.get(Session.get(followingContext.get().params._id+'_uObj')._id+'_fc') < 6)
				return true;
			else
				return Session.get('f6Faves');
		}
	},

	viewingLast6Faves: function() {
		if(!_.isUndefined(Session.get(followingContext.get().params._id+'_uObj')))
		{
			if(Session.get(Session.get(followingContext.get().params._id+'_uObj')._id+'_fc') < 6)
				return true;
			else
				return Session.get('l6Faves');
		}
	},
	//less tastemakers than having to enable the paging buttons
	tastemakersLessThanPagingLimit: function() {
		if(!_.isUndefined(Session.get(followingContext.get().params._id+'_uObj')))
		{
			var x = Session.get(followingContext.get().params._id+'_uObj');
			if(!_.isUndefined(x.tastemakers))
				return x.tastemakers.length <= 12;
			else
				return true;
		}
	},
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
			    };
			});
    	}
		//Session.set('followingLd',false);
		//isFollowingReady();
		//}
	});
});

Template.profileFollowingSidebar.events({
    "click #previousFollowingList": function (event) {
      //console.log('CLICKED PREVIOUS button');
      if(Number(Session.get(followingContext.get().params._id+'_followingcurs')) > 11)
      {
        //console.log('INSIDE if condition!!');
        Session.set(followingContext.get().params._id+'_followingcurs', Number(Session.get(followingContext.get().params._id+'_followingcurs')) - 12);
        //iHist(true);
        //resetPlayedLengthSpecificToTab('me');
      }
      /*else
      {
        toastr.info("Reached the beginning of "+Session.get(followingContext.get().params._id+'_uObj').services.facebook.first_name+"'s shared songs; <br><br><b><i>try moving forward (->) to see what they shared in the past!</i></b><br><br>");
        //console.log('INSIDE else condition!!');
      }*/
    },

    "click #nextFollowingList": function (event) {
      //console.log('CLICKED next button');
      if(Number(Session.get(followingContext.get().params._id+'_followingcurs')) < Number(Session.get(Session.get(followingContext.get().params._id+'_uObj')._id+'_fc') - 11))
      {
        //console.log('INSIDE if condition!!');
        Session.set(followingContext.get().params._id+'_followingcurs', Number(Session.get(followingContext.get().params._id+'_followingcurs')) + 11);
        //iHist(true);
        //resetPlayedLengthSpecificToTab('me');
      }
      /*else
      {
        //console.log('INSIDE else condition!!');
        toastr.info("Reached the end of "+Session.get(followingContext.get().params._id+'_uObj').services.facebook.first_name+"'s shared songs; <br><br><b><i>try moving backward (<-) to see what they shared more recently!</i></b><br><br>");
      }*/
    },
    "click #userProfileFollowingLink": function(event) {
    	//console.log('clicked user profile link');
    	FlowRouter.go($(event.target.parentElement).attr('href'));
    }
});

	