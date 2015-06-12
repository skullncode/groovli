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
  }
});