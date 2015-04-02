var fullSongList = {};
Session.set('playerStarted', false);

Template.mygroovsList.helpers({
  songs: function() {
  	//Session.set('personalSongList', Songs.find());
    fullSongList = Songs.find({'sharedBy.uid': String(Meteor.user().services.facebook.id)},{sort: { 'sharedBy.systemDate': -1 }});
    var songCollection = fullSongList.fetch();
    //songCollectionLength = songCollection.length;
    //console.log('#$#$#$#$$###$ SETTING Song LENGTH!!!!! ' + songCollection.length);
    Session.set('pSongsLength', songCollection.length);
    updateMySongs(songCollection, 'me');
    return fullSongList;
  },

  songsLoaded: function() {
    //console.log('CHECKING if SONGS ARE LOADED OR NOT!!!!!!!!');
    if(Session.get('pSongsLength') > 0 && Session.get('playerLoaded'))//&& !Session.get('playerStarted'))
      return true;
    else
      return false;
  },

  startPlayer: function() {
    if(!Session.get('playerStarted'))
    {
      //console.log('SONGS apparently loaded!!! STARTINGGGG PLAYERR!!!');
      $(".glyphicon-step-forward").click();
      Session.set('playerStarted', true);
      Session.set('playerLoaded', false);
      Session.set('activeTab', 'me');
    }
  }
});