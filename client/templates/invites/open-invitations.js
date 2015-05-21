Template.openInvitations.helpers({
  hasInvites: function() {
    var getInvites;
    getInvites = Invites.find({
      invited: false
    }, {
      fields: {
        "_id": 1,
        "invited": 1
      }
    }).count();
    if (getInvites > 0) {
      return true;
    } else {
      return false;
    }
  },
  invites: function() {
    return Invites.find({
      invited: false
    }, {
      sort: {
        "requested": 1
      }
    }, {
      fields: {
        "_id": 1,
        "inviteNumber": 1,
        "requested": 1,
        "email": 1,
        "invited": 1
      }
    });
  }
});

Template.openInvitations.events({
  'click .send-invite': function() {
    var confirmInvite, invitee, url;
    invitee = {
      id: this._id,
      email: this.email
    };
    url = window.location.origin + "/signup";
    confirmInvite = confirm("Are you sure you want to invite " + this.email + "?");
    if (confirmInvite) {
      return Meteor.call('sendInvite', invitee, url, function(error) {
        if (error) {
          return console.log(error);
        } else {
          return toastr.success("Invite sent to " + invitee.email + "!");
        }
      });
    }
  }
}); 
