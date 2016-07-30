Template.searchResultsTab.helpers({
  activatePopups: function() {
    Meteor.setTimeout(activatePopups, 800);
  },
  notifsEnabled: function() {
    if(!_.isUndefined(Meteor.user()) && !_.isUndefined(Meteor.user().notifsEnabled))
    {
      return Meteor.user().notifsEnabled;
    }
    else
    {
      return true;
    }
  }
});

function activatePopups(){
  $('#sresultsTabHeader').popup();
}