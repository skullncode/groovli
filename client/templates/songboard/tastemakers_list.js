var tastemakerSongList = {};

Template.tastemakersList.helpers({
  songs: function() {
    //Session.set('personalSongList', Songs.find());
    var sel = getMongoSelectorForFriendSongs();
    tastemakerSongList = Songs.find(sel, {sort: { 'sharedBy.systemDate': -1 }});
    var songCollection = tastemakerSongList.fetch();
    songCollectionLength = songCollection.length;
    console.log('#$#$#$#$$###$ SETTING TASTEMAKERSSSSSSS LENGTH!!!!! ' + songCollection.length);
    Session.set('tastemakersSongsLength', songCollection.length);
    updateMySongs(songCollection, 'friends');
    return tastemakerSongList;
  },

  songOfFriendsExist: function() {
    console.log('CHECKING length of friends songs: ' + Session.get('tastemakersSongsLength'));
    if(Session.get('tastemakersSongsLength') > 0)
      return true;
    else
      return false;
  }
});

function getMongoSelectorForFriendSongs() {
  var counter = 0;
  var selector = "";
  var ender = "]}";
  var query = {};

  if(Meteor.user().fbFriends.length > 1)
    query["$or"] = [];

  while(counter < Meteor.user().fbFriends.length)
  {
    if(Meteor.user().fbFriends.length === 1)
      query["sharedBy.uid"] = Meteor.user().fbFriends[counter].id;
    else
    {
      var additional = {
        "sharedBy.uid": Meteor.user().fbFriends[counter].id
      }
      query["$or"].push(additional);
    }

    counter++;
  }

  console.log('THIS IS THE FINAL SELECTOR THAT WILL BE USED!!!!!');
  console.log(query);

  return query;
}