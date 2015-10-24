//Session.setDefault('folLd', false); //followers loaded.
var followersLoaded = new ReactiveVar(false);
var followerContext = new ReactiveVar(null);

Template.profileFollowerSidebar.helpers({
	followersForUser: function() {
		if(!_.isUndefined(Session.get(followerContext.get().params._id+'_uObj')))
		{
			//return Session.get(Session.get(followerContext.get().params._id+'_uObj')._id+'_fclist');
			return Meteor.users.find({'tastemakers.fbid': String(Session.get(followerContext.get().params._id+'_uObj').services.facebook.id)});
		}
	},
	followerCount: function(){
		if(!_.isUndefined(Session.get(followerContext.get().params._id+'_uObj')))
			return Meteor.users.find({'tastemakers.fbid': String(Session.get(followerContext.get().params._id+'_uObj').services.facebook.id)}).count();
	},

	noFollowersExist: function() {
		if(!_.isUndefined(Session.get(followerContext.get().params._id+'_uObj')))
			return Meteor.users.find({'tastemakers.fbid': String(Session.get(followerContext.get().params._id+'_uObj').services.facebook.id)}).count() == 0;
	},

	followersLoaded: function() {
		return followersLoaded.get();
	},

	/*viewingFirst6Faves: function() {
		if(!_.isUndefined(Session.get(followerContext.get().params._id+'_uObj')) && followersLoaded.get())
		{
			if(Session.get(Session.get(followerContext.get().params._id+'_uObj')._id+'_fc') < 6)
				return true;
			else
				return Session.get('f6Faves');
		}
	},

	viewingLast6Faves: function() {
		if(!_.isUndefined(Session.get(followerContext.get().params._id+'_uObj')) && followersLoaded.get())
		{
			if(Session.get(Session.get(followerContext.get().params._id+'_uObj')._id+'_fc') < 6)
				return true;
			else
				return Session.get('l6Faves');
		}
	},*/
	//not enough followers to require enabling page buttons
	followersLessThanPageLimit: function() {
		if(!_.isUndefined(Session.get(followerContext.get().params._id+'_uObj')) && followersLoaded.get())
			return Meteor.users.find({'tastemakers.fbid': String(Session.get(followerContext.get().params._id+'_uObj').services.facebook.id)}).count() <= 12;
	}
});



Template.profileFollowerSidebar.onCreated(function() {
	var self = this;
	self.autorun(function() {
		/*if(!_.isUndefined(Session.get(followerContext.get().params._id+'_uObj')))
		{*/
		FlowRouter.watchPathChange();
    	var context = FlowRouter.current();
    	followerContext.set(context);
    	Session.setDefault(followerContext.get().params._id+'_folcurs', 0);
		//Session.set('folLd',false);
		followersLoaded.set(false);
		//console.log('GOING TO SUBSCRIBE TO FOLLOWERS NOW!!!!');
		self.subscribe('followersForUser', Session.get(followerContext.get().params._id+'_uObj'), Session.get(followerContext.get().params._id+'_folcurs'), {onReady: setUpFollowerList});
		//}
	});
});

function setUpFollowerList(){
	if(!_.isUndefined(Session.get(followerContext.get().params._id+'_uObj')))
	{
		//Session.set('folLd',true);
		followersLoaded.set(true);
	}
}

Template.profileFollowerSidebar.events({
    "click #previousFolList": function (event) {
      //console.log('CLICKED PREVIOUS button');
      if(Number(Session.get(followerContext.get().params._id+'_folcurs')) > 11)
      {
        //console.log('INSIDE if condition!!');
        Session.set(followerContext.get().params._id+'_folcurs', Number(Session.get(followerContext.get().params._id+'_folcurs')) - 12);
        //iHist(true);
        //resetPlayedLengthSpecificToTab('me');
      }
      /*else
      {
        toastr.info("Reached the beginning of "+Session.get(followerContext.get().params._id+'_uObj').services.facebook.first_name+"'s shared songs; <br><br><b><i>try moving forward (->) to see what they shared in the past!</i></b><br><br>");
        //console.log('INSIDE else condition!!');
      }*/
    },

    "click #nextFolList": function (event) {
      //console.log('CLICKED next button');
      if(Number(Session.get(followerContext.get().params._id+'_folcurs')) < Number(Session.get(Session.get(followerContext.get().params._id+'_uObj')._id+'_fc') - 11))
      {
        //console.log('INSIDE if condition!!');
        Session.set(followerContext.get().params._id+'_folcurs', Number(Session.get(followerContext.get().params._id+'_folcurs')) + 11);
        //iHist(true);
        //resetPlayedLengthSpecificToTab('me');
      }
      /*else
      {
        //console.log('INSIDE else condition!!');
        toastr.info("Reached the end of "+Session.get(followerContext.get().params._id+'_uObj').services.facebook.first_name+"'s shared songs; <br><br><b><i>try moving backward (<-) to see what they shared more recently!</i></b><br><br>");
      }*/
    },
    "click #userProfileFollowerLink": function(event) {
    	//console.log('clicked user profile link');
    	FlowRouter.go($(event.target.parentElement).attr('href'));
    }
});

	