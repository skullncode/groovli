Template.artistPerson.helpers({
  userThumbnail: function() {
    var fbProfThumb = 'http://graph.facebook.com/'+this.uid+'/picture?type=small';
    return fbProfThumb;
  }
});