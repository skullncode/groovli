//Session.setDefault('followingLd', false); //followers loaded.
var userFavesContext = new ReactiveVar(null);

Template.userProfileFavorites.helpers({
	userFaves: function() {
		return Favorites.find({'userId': userFavesContext.get().params._id});
    }
});



Template.userProfileFavorites.onCreated(function() {
	var self = this;
	self.autorun(function() {
		/*if(!_.isUndefined(Session.get(followingContext.get().params._id+'_uObj')))
		{*/
		FlowRouter.watchPathChange();
    	var context = FlowRouter.current();
    	userFavesContext.set(context);
    	Session.setDefault(context.params._id+'_faveCursor', 0);
    	self.subscribe('favoritesForSpecificUser', userFavesContext.get().params._id, Session.get(userFavesContext.get().params._id+'_faveCursor'));
		//Session.set('followingLd',false);
		//isFollowingReady();
		//}
	});
});

Template.userProfileFavorites.events({
    "click #previousFaves": function (event) {
      //console.log('CLICKED PREVIOUS button');
      if(Number(Session.get(userFavesContext.get().params._id+'_faveCursor')) > 4)
      {
        //console.log('INSIDE if condition!!');
        Session.set(userFavesContext.get().params._id+'_faveCursor', Number(Session.get(userFavesContext.get().params._id+'_faveCursor')) - 5);
        //iHist(true);
        //resetPlayedLengthSpecificToTab('me');
      }
      else
      {
        toastr.info("Reached the beginning of "+Session.get(userFavesContext.get().params._id+'_uObj').services.facebook.first_name+"'s shared songs; <br><br><b><i>try moving forward (->) to see what they shared in the past!</i></b><br><br>");
        //console.log('INSIDE else condition!!');
      }
    },

    "click #nextFaves": function (event) {
      //console.log('CLICKED next button');
      if(Number(Session.get(userFavesContext.get().params._id+'_faveCursor')) < Number(Session.get(userFavesContext.get().params._id+'_faveCount') - 5))
      {
        //console.log('INSIDE if condition!!');
        Session.set(userFavesContext.get().params._id+'_faveCursor', Number(Session.get(userFavesContext.get().params._id+'_faveCursor')) + 5);
        //iHist(true);
        //resetPlayedLengthSpecificToTab('me');
      }
      else
      {
        //console.log('INSIDE else condition!!');
        toastr.info("Reached the end of "+Session.get(userFavesContext.get().params._id+'_uObj').services.facebook.first_name+"'s shared songs; <br><br><b><i>try moving backward (<-) to see what they shared more recently!</i></b><br><br>");
      }
    },
});

