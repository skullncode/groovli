var fullSongList = {};
Session.set('playerStarted', false);

Template.songsList.helpers({
  songs: function() {
  	//Session.set('personalSongList', Songs.find());
    fullSongList = Songs.find();
    var songCollection = fullSongList.fetch()
    //songCollectionLength = songCollection.length;
    //console.log('#$#$#$#$$###$ SETTING Song LENGTH!!!!! ' + songCollection.length);
    Session.set('pSongsLength', songCollection.length);
    updateMySongs(songCollection);
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
    }
  }
});    