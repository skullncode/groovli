Template._footer.helpers({
  usersCurrentlyOnline: function() {
    //Session.set('personalSongList', Songs.find());
    if (Meteor.user())
    {
    	var userSessions = Presences.find({ state: 'online'}).fetch();
    	var uniqueOnlineCount = _.uniq(userSessions, false, function(d) {return d.userId}).length;
    	if(uniqueOnlineCount === 1)
    		return "you're the only one here";
    	else if(uniqueOnlineCount > 1)
    		return uniqueOnlineCount + ' users currently online'
	}
 }
});