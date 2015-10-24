Template.semanticFooter.helpers({
  usersCurrentlyOnline: function() {
    //Session.set('personalSongList', Songs.find());
    if (Meteor.user())
    {
        var usersOnline = Meteor.users.find({ 'status.online': true }).fetch().length;
        if(usersOnline === 1)
            return "you're currently the only one here";
        else if(usersOnline > 1)
            return usersOnline + ' users currently online'
	}
 }
});

Template.semanticFooter.events({
    "click #aboutFooterLink": function (event) {
      console.log('CLICKED ABOUT link');
      $('.ui.modal.aboutPage').modal({
          transition: 'horizontal flip'
      }).modal('show');
    }
});