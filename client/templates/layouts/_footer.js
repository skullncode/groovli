Template._footer.helpers({
  usersCurrentlyOnline: function() {
    //Session.set('personalSongList', Songs.find());
    if (Meteor.user())
    {
        var usersOnline = Meteor.users.find({ 'status.online': true }).fetch().length;
        if(usersOnline === 1)
            return "you're the only one here";
        else if(usersOnline > 1)
            return usersOnline + ' users currently online'
	}
 }
});