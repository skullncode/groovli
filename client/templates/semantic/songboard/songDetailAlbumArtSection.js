Template.songDetailAlbumArtSection.helpers({
  hasAlbumArt: function() {
    var cs = Session.get('CS');
    if(!_.isUndefined(cs))
    {
      //console.log('SONG Is playing!!!');
      //console.log(cs.st);
      if(!_.isUndefined(cs.iTunesLargeAlbumArt))
      {
        //console.log('SOnG has album art also!!');
        if(currentSong.iTunesLargeAlbumArt.indexOf('http') >= 0)
          return true;
        else
          return false;
      }
    }
    //console.log('no ALBUM art for SONG!!');
    return false;
  },
  albumArtForCurrentSong:function() {
    var cs = Session.get('CS');
    if(!_.isUndefined(cs))
    {
      if(!_.isUndefined(cs.iTunesLargeAlbumArt))
        return cs.iTunesLargeAlbumArt;
    }
  }
});