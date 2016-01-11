Template.mygroovsDateFilter.helpers({
  mygroovsYearRange: function() {
    if(!_.isEmpty(Session.get('mgdr')) && !_.isUndefined(Session.get('mgdr')[0]) && !_.isUndefined(Session.get('mgdr')[1]))
    {
      return _.range(Session.get('mgdr')[0],Session.get('mgdr')[1]+1);
    }
  },
  activeYearHelper: function(yr) {
    if(!_.isEmpty(Session.get('mgdr')) && !_.isUndefined(Session.get('mgdr')[0]) && !_.isUndefined(Session.get('mgdr')[1]))
    {
      if(yr === Session.get('mgdr')[1])
      {
        return 'active selected';
      }
    }
   },
   selectedYearForMyGroovs: function() {
    return Session.get('selyr');
   }
});


Template.mygroovsDateFilter.onRendered(function () {
  $('.ui.dropdown.myGroovsYearSelector')
  .dropdown({
    action: 'select',
    onChange: function(value, text, $selectedItem) {
      // custom action
      Session.set('selyr',text);
      amplitude.logEvent('filtered on specfic year for my groovs', {
          selectedYear: text
        });
      ga('send', {
        hitType: 'event',
        eventCategory: 'songboard',
        eventAction: 'filtered on specfic year for my groovs'
      });
    }
  });
});