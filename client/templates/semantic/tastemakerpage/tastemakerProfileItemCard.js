if (Meteor.isClient) {   
  Template.tastemakerProfileItemCard.helpers({
    followerCount: function() {
      return Session.get(this._id+'_fc');
    },
    songCount: function() {
      return Session.get(this._id+'_sc');
    },
    getFollowerCount: function(uObj) {
      if(!_.isUndefined(uObj))
      {
        console.log("GOING TO get follower count for this user object: ");
        console.log(uObj);
        Meteor.call('getFollowerCount', uObj, function(error,result){
            if(error){
                console.log(error.reason);
            }
            else{
                // do something with result
              Session.set(uObj._id+'_fc',result);
            };
        });
      }
    },
    getSongCount: function(uObj) {
      if(!_.isUndefined(uObj))
      {
        Meteor.call('getSongCount', uObj, function(error,result){
            if(error){
                console.log(error.reason);
            }
            else{
                // do something with result
              Session.set(uObj._id+'_sc',result);
            };
        });
      }
    },
    songCountMoreThan5: function() {
      if(Session.get(this._id+'_sc') > 5) //should have shared a minimum of 5 songs to show up as a suggested tastemaker
        return true;
      else
        return false;
    }
  });


Template.tastemakerProfileItemCard.events({
    "click #unfollowUser": function (event) {
      var userObj = Session.get(Router.current().params._id+'_uObj')
      var isUserAFriend = !_.isUndefined(_.findWhere(Meteor.user().fbFriends, {fbid: userObj.services.facebook.id}));

      //console.log('UNFOLLOW user button clicked!');
      //console.log('and this user is a friend: ' + isUserAFriend);

      Meteor.call('unfollowUser', userObj, isUserAFriend, function(error,result){
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
    "click .ui.green.button.followUser": function (event) {
      console.log("CLICKED FOLLOW USER button EVENT!");
      console.log(event);
      console.log("CLICKED FOLLOW USER button - THISSSS!");
      console.log(this);      
      /*var userObj = Session.get(Router.current().params._id+'_uObj')*/
      var isUserAFriend = !_.isUndefined(_.findWhere(Meteor.user().fbFriends, {fbid: this.services.facebook.id}));

      console.log('Follow user button clicked!');
      console.log('and this user is a friend: ' + isUserAFriend);

      switchFollowButtonToLoadingButton(event);
      Meteor.call('followUser', this, isUserAFriend, function(error,result){
          if(error){
              console.log(error.reason);
              switchLoadingButtonToFollowButton(event)
          }
          else{
              // do something with result
            //console.log('SUCCESSFULLY followed user!');
            switchLoadingButtonToUnfollowButton(event);
          };
      });
      return true;
    }

  });

  /*Template.tastemakerProfileItemCard.events({
    "click a.songBrowserItem": function (event) {
      // This function is called when the new task form is submitted
      Session.set('animatedToSong', false);
      Session.set('activeTab', 'me');
      //console.log('THIS IS THE CLICK EVENT for the SONG ITEM!!!!!!');
      //console.log(event);
      //var text = event.target.text.value;
      var ytLinkID=  this.sl.substring(this.sl.indexOf("v=")+2);
      //console.log(ytLinkID);
      //console.log('CALLING JQUERY EVENT CLASS METHOD!!!!');
      removeAndAddSelectedClassToSelectedSong(event.currentTarget);
      //loadVideoById(ytLinkID, this);
      loadVideoById(ytLinkID);
      //makeMuutCommentRelatedUpdates(ytLinkID, this);
      setShareByLinkID(ytLinkID);
      // Prevent default form submit
      return false;
    }
  });*/
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