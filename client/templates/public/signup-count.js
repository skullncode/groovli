Template.signupCount.helpers({
  inviteCount: function() {
    var inviteTotal;
    Meteor.subscribe('inviteCount');
    inviteTotal = Invites.find({}, {
      fields: {
        "_id": 1
      }
    }).count();
    switch (false) {
      case inviteTotal !== 1:
        return "1 person has already signed up!";
      case !(inviteTotal > 1):
        return inviteTotal + " people have already signed up!";
      default:
        return false;
    }
  }
});