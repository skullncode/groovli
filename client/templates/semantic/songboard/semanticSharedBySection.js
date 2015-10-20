Template.semanticSharedBySection.helpers({
  songPlaying: function() {
    var cs = Session.get('CS');
    if(!_.isUndefined(cs) && !_.isEmpty(cs))
      return true;
    else
      return false;
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
          globalIDsThatSharedThisSong.push({personID: cs.sharedBy[shareCounter].uid, personName: cs.sharedBy[shareCounter].uname, personTimestamp: new moment(cs.sharedBy[shareCounter].systemDate * 1000).format('llll'), p_id: cs.sharedBy[shareCounter]._id, personid_sysdate: cs.sharedBy[shareCounter].uid + "_" + cs.sharedBy[shareCounter].systemDate});
        }
        
        shareCounter++;
      }
      //console.log('THIS IS THE SHARED BY DETAILS: ');
      //console.log(globalIDsThatSharedThisSong);
      //globalIDsThatSharedThisSong = _.uniq(Session.get('CS').sharedBy, function(x){return x._id;})
      return globalIDsThatSharedThisSong;
    }
});