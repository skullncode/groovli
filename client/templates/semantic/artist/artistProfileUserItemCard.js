if (Meteor.isClient) {
  var idsLoadedForPeople = new ReactiveVar(false);

  Template.artistProfileUserItemCard.helpers({
    followerCount: function() {
      return Session.get(this.uid+'_fc');
    },
    songCount: function() {
      return Session.get(this.uid+'_sc');
    },
    getFollowerCount: function(fbid) {
      if(!_.isUndefined(fbid))
      {
        //console.log("GOING TO get follower count for this user object: ");
        //console.log(fbid);
        Meteor.call('getFollowerCountWithFBID', fbid, function(error,result){
            if(error){
                console.log(error.reason);
            }
            else{
                // do something with result
              Session.set(fbid+'_fc',result);
            };
        });
      }
    },
    getSongCount: function(fbid) {
      if(!_.isUndefined(fbid))
      {
        Meteor.call('getSongCountWithFBID', fbid, function(error,result){
            if(error){
                console.log(error.reason);
            }
            else{
                // do something with result
              Session.set(fbid+'_sc',result);
            };
        });
      }
    },
    alreadyFollowed: function() {
      if(!_.isUndefined(this) && !_.isUndefined(Meteor.user()))
      {
        if(_.isUndefined(_.findWhere(Meteor.user().tastemakers, {'fbid': this.uid})))
          return false;
        else
          return true;
      }
    },
    getUserIDForSocID: function() {
      idsLoadedForPeople.set(false);
      var socArray = [{fbid: this.uid}];
      Meteor.call('getUserIDsForSocIDs', socArray, function(error,result){
          if(error){
              console.log(error.reason);
          }
          else{
              // do something with result
            //console.log("GOT THIS RESULT FOR THIS USER: ");
            //console.log(socArray);
            //console.log('#########################GOT BACK AN ID  FROM THE SERVER:');
            //console.log(result);
            //idForUserFollowingArtist.set(result[0]._id);

            Session.set(result[0].fbid+'_id', result[0]._id);
            idsLoadedForPeople.set(true);
            //userIDsForTastemakers.set(result);
          };
      });
    },
    userIDForSocID: function() {
      return Session.get(this.uid+'_id');
    },
    firstNameFromName: function() {
      return this.name.split(' ')[0];
    },
    userProfileIsNotYou: function() {
      if(!_.isUndefined(Meteor.user()) && !_.isUndefined(Meteor.user().services))
        return this.uid !== Meteor.user().services.facebook.id;
    },
    idsLoaded: function() {
      return idsLoadedForPeople.get();
    }
  });


Template.artistProfileUserItemCard.events({
    "click #unfollowUser": function (event) {
      
      var isUserAFriend = !_.isUndefined(_.findWhere(Meteor.user().fbFriends, {fbid: this.uid}));

      //console.log('UNFOLLOW user button clicked!');
      //console.log('and this user is a friend: ' + isUserAFriend);

      Meteor.call('unfollowUser', this, isUserAFriend, function(error,result){
        if(error){
            console.log(error.reason);
        }
        else{
            // do something with result
          //console.log('SUCCESSFULLY unfollowed user!');
        };
    });
      return true;
    },
    "click #followUser": function (event) {
      //var userObj = Session.get(profileContext.get().params._id+'_uObj')
      //console.log("CLICKED THIS USER:");
      //console.log(this);
      var isUserAFriend = !_.isUndefined(_.findWhere(Meteor.user().fbFriends, {fbid: this.uid}));

      //console.log('Follow user button clicked!');
      //console.log('and this user is a friend: ' + isUserAFriend);

      Meteor.call('followUser', this, isUserAFriend, function(error,result){
        if(error){
            console.log(error.reason);
        }
        else{
            // do something with result
          //console.log('SUCCESSFULLY followed user!');
        };
    });
      return true;
    }

  });
}

function switchLoadingButtonToFollowButton(event){
  $(event.target).removeClass('yellow loading');
  $(event.target).addClass('green');
}

function switchFollowButtonToLoadingButton(event){
  $(event.target).removeClass('green');
  $(event.target).addClass('yellow loading');
}

function switchLoadingButtonToUnfollowButton(event){
  $(event.target).removeClass('yellow loading followUser');
  $(event.target).addClass('unfollowUser');
  $(event.target).text('Unfollow');
}

function removeAndAddSelectedClassToSelectedSong(selectedSong) {
  //console.log('setting CLASS using JQUERY event!!!!!!!')
  //console.log(selectedSong);
   //CHANGE SELECTED CLASS
  $('.ui.fluid.card.green.selected').removeClass('green selected');
  $(selectedSong).addClass('green selected');
  //END CHANGE SELECTED CLASS

  //take care of now playing overlay
  /*$('.nowplaying').removeClass('nowplaying');
  $('.selected .overlay').addClass('nowplaying');*/
}