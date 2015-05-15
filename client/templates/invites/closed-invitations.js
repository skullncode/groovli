Template.closedInvitations.helpers({
  hasInvites: function() {
    var getInvites;
    getInvites = Invites.find({
      invited: true
    }, {
      fields: {
        "_id": 1,
        "invited": 1
      }
    }).fetch();
    if (getInvites.length > 0) {
      return true;
    } else {
      return false;
    }
  },
  invites: function() {
    return Invites.find({
      invited: true
    }, {
      sort: {
        dateInvited: -1
      }
    }, {
      fields: {
        "_id": 1,
        "inviteNumber": 1,
        "email": 1,
        "token": 1,
        "dateInvited": 1,
        "invited": 1,
        "accountCreated": 1
      }
    });
  }
});