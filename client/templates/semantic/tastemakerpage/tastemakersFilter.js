Session.setDefault('seltstmkr','everybody');
Session.setDefault('seltstmkrid','everybody');

Template.tastemakersFilter.helpers({
  tastemakerList: function() {
    return Meteor.user().tastemakers;
  },
  selectedTastemaker: function() {
    return Session.get('seltstmkr');
  },
  selectedTastemakerFBID: function() {
    return Session.get('seltstmkrid');
  },
  tastemakerCurrentlyNotEverybody: function() {
    return Session.get('seltstmkr') !== 'everybody';
  },
  currentlyChosenTastemakerSongCount: function() {
    return Session.get('tmSongCount');
  }
});


Template.tastemakersFilter.onRendered(function () {
  $('.ui.dropdown.tastemakerSelector')
  .dropdown({
    action: 'select',
    onChange: function(value, text, $selectedItem) {
      // custom action
      Session.set('seltstmkr',text);
      Session.set('seltstmkrid',value);
      amplitude.logEvent('filtered on specfic tastemaker', {
          selectedTastemaker: text,
          selectedTastemakerID: value
        });
      ga('send', {
            hitType: 'event',
            eventCategory: 'songboard',
            eventAction: 'filtered on specfic tastemaker'
          });
    }
  });
  //getTastemakerList();
});

/*

function getTastemakerList() {
  var tstmkrList = [];
  counter = 0;
  //if(Meteor.user().fbFriends.length > 1)
  if(!_.isUndefined(Meteor.user().tastemakers) && Meteor.user().tastemakers.length > 0)
  {
    _.each(Meteor.user().tastemakers, function(x){
        tstmkrList.push(x);
    });
  }
  Session.set('tstmkrlst', tstmkrList);
}*/