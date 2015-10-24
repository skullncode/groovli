Template.globalDateFilter.helpers({
  globalYearRange: function() {
    if(!_.isEmpty(Session.get('gldr')) && !_.isUndefined(Session.get('gldr')[0]) && !_.isUndefined(Session.get('gldr')[1]))
    {
      return _.range(Session.get('gldr')[0],Session.get('gldr')[1]+1);
    }
  },
  globalActiveYearHelper: function(yr) {
    if(!_.isEmpty(Session.get('gldr')) && !_.isUndefined(Session.get('gldr')[0]) && !_.isUndefined(Session.get('gldr')[1]))
    {
      if(yr === Session.get('gldr')[1])
      {
        return 'active selected';
      }
    }
   },
   selectedYearForGlobal: function() {
    return Session.get('glSelyr');
   },
   globalYearRangeOnlyHasOneYear: function() {
    return Session.get('gldr').length === 1;
   }
});


Template.globalDateFilter.onRendered(function () {
  $('.ui.dropdown.globalYearSelector')
  .dropdown({
    action: 'select',
    onChange: function(value, text, $selectedItem) {
      // custom action
      Session.set('glSelyr',text);
    }
  });
});