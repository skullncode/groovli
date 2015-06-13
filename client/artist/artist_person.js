Template.artistPerson.helpers({
  userThumbnail: function() {
    var fbProfThumb = 'http://graph.facebook.com/'+this.uid+'/picture?type=small';
    return fbProfThumb;
  },
  currentStatus: function() {
      var userStatus = Meteor.users.find({'_id': this._id}).fetch();
      //console.log(userStatus);
      var lastLogin = '';
      if(!_.isUndefined(this.status) && !_.isUndefined(this.status.lastLogin))
      lastLogin =  new moment(this.status.lastLogin.date).calendar();
        if(userStatus.length > 0)
        {
          if(userStatus[0].status.online)
            return '<div class="online_status"></div>'
          else
            return '<i><p style="float:right" class="small">'+lastLogin+'</p></i>';
        }
        else
          return '<i><p style="float:right" class="small">'+lastLogin+'</p></i>';
  },
  alreadyFollowed: function() {
    var artistPersonUserObj = {
      'services' : { 'facebook': { 'id': this.uid}}
    };
    Session.set(this._id+'_uObj', artistPersonUserObj);
    if(_.isUndefined(_.findWhere(Meteor.user().tastemakers, {'fbid': this.uid})))
      return false;
    else
      return true;
  }
});

Template.artistPerson.events({
    "click #unfollowUser": function (event) {
    //console.log('UNFOLLOW user button clicked!');
    //console.log(event);
    var x = $(event.currentTarget.parentElement.parentElement.parentElement).find('#artistPersonProfileLink').prop('href');
    var beginOfProfileID = x.indexOf('profile/') + 8; //length of 'profile/'
    var profileId = x.substring(beginOfProfileID);

    var userObj = Session.get(profileId+'_uObj');
    var isUserAFriend = !_.isUndefined(_.findWhere(Meteor.user().fbFriends, {fbid: this.uid}));

    //console.log('UNFOLLOW user button clicked!');
    //console.log('and this user is a friend: ' + isUserAFriend);

    Meteor.call('unfollowUser', userObj, isUserAFriend, function(error,result){
        if(error){
            console.log(error.reason);
        }
        else{
            // do something with result
          //console.log('SUCCESSFULLY unfollowed user!');
          toastr.success('Unfollowed user!');
        };
    });
    return true;
    },
    "click #followUser": function (event) {
    //console.log('Follow user button clicked!');
    var x = $(event.currentTarget.parentElement.parentElement.parentElement).find('#artistPersonProfileLink').prop('href');
    var beginOfProfileID = x.indexOf('profile/') + 8; //length of 'profile/'
    var profileId = x.substring(beginOfProfileID);

    var userObj = Session.get(profileId+'_uObj');
    var isUserAFriend = !_.isUndefined(_.findWhere(Meteor.user().fbFriends, {fbid: this.uid}));

    //console.log('and this user is a friend: ' + isUserAFriend);

    Meteor.call('followUser', userObj, isUserAFriend, function(error,result){
        if(error){
            console.log(error.reason);
        }
        else{
            // do something with result
          toastr.success('Followed user!');
        };
    });
    return true;
    }
});