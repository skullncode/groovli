Template.semanticSharedBySection.helpers({
  songPlaying: function() {
    var cs = Session.get('CS');
    if(!_.isUndefined(cs) && !_.isEmpty(cs))
      return true;
    else
      return false;
  },
  alreadyFollowed: function() {
      if(!_.isUndefined(this) && !_.isUndefined(Meteor.user()))
      {
        if(_.isUndefined(_.findWhere(Meteor.user().tastemakers, {'fbid': this.personID})))
          return false;
        else
          return true;
      }
  },
  userProfileIsNotYou: function() {
      if(!_.isUndefined(Meteor.user()) && !_.isUndefined(Meteor.user().services))
        return this.personID !== Meteor.user().services.facebook.id;
  },
  sharedByDetailsForCurrentSong: function() {
      var cs = Session.get('CS');
      var shareCounter = 0;
      var globalIDsThatSharedThisSong = [];
      while(shareCounter < cs.sharedBy.length)
      {
        //console.log('INSIDE SHARE COUNTER: for this length: '+this.sharedBy.length);
        //console.log('INSIDE FRIEND COUNTER: for this length: '+Meteor.user().fbFriends.length);
        //console.log('FRIEND COUNTER IS:  '+ friendCounter);
        if(_.isUndefined(_.findWhere(globalIDsThatSharedThisSong, {p_id: cs.sharedBy[shareCounter]._id})) && _.isUndefined(_.findWhere(globalIDsThatSharedThisSong, {personid_sysdate: cs.sharedBy[shareCounter].uid + "_" + cs.sharedBy[shareCounter].systemDate})))
        {
          var firstName = cs.sharedBy[shareCounter].uname.split(' ')[0];
          globalIDsThatSharedThisSong.push({personID: cs.sharedBy[shareCounter].uid, personName: firstName, personTimestamp: new moment(cs.sharedBy[shareCounter].systemDate * 1000).format('llll'), p_id: cs.sharedBy[shareCounter]._id, personid_sysdate: cs.sharedBy[shareCounter].uid + "_" + cs.sharedBy[shareCounter].systemDate});
        }
        
        shareCounter++;
      }
      //console.log('THIS IS THE SHARED BY DETAILS: ');
      //console.log(globalIDsThatSharedThisSong);
      //globalIDsThatSharedThisSong = _.uniq(Session.get('CS').sharedBy, function(x){return x._id;})
      return globalIDsThatSharedThisSong;
  }
});

Template.semanticSharedBySection.onRendered(function () {
  var self = this;
  self.autorun(function() {
    //var postId = FlowRouter.getParam('postId');
    if(!_.isNull(Session.get('CS')) && !_.isUndefined(Session.get('CS')))
    {
      Meteor.setTimeout(activatePopupsForThisSong, 800);
    }
  });  
});

function activatePopupsForThisSong(){
  _.each(Session.get('CS').sharedBy, function(x){
    var popupSelector = '.sharedByUserPopup.' + x._id;
    //console.log('GOING TO INITIATE this popup now!');
    //console.log(popupSelector);
    $(popupSelector).popup({
      hoverable: true,
      inline: true
    });
  });
}

Template.semanticSharedBySection.events({
    "click #unfollowUser": function (event) {
      
      var isUserAFriend = !_.isUndefined(_.findWhere(Meteor.user().fbFriends, {fbid: this.personID}));

      var modifiedUserToUnfollowObject = {
          name: this.personName,
          uid: this.personID,
          _id: this.p_id
      }

      Meteor.call('unfollowUser', modifiedUserToUnfollowObject, isUserAFriend, function(error,result){
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
    "click #followUserFromCard": function (event) {
      //console.log("CLICKED THIS USER:");
      //console.log(this);
      var isUserAFriend = !_.isUndefined(_.findWhere(Meteor.user().fbFriends, {fbid: this.personID}));

      //console.log('Follow user button clicked!');
      //console.log('and this user is a friend: ' + isUserAFriend);
      var modifiedUserToFollowObject = {
          name: this.personName,
          uid: this.personID,
          _id: this.p_id
      }

      Meteor.call('followUser', modifiedUserToFollowObject, isUserAFriend, function(error,result){
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