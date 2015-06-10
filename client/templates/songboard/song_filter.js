Template.songFilter.events({
	'click .panel-heading span.clickable': function (event) {
		if ($(event.currentTarget).hasClass('panel-collapsed')) {
            // expand the panel
            $(event.currentTarget).parents('.panel').find('.panel-body').slideDown();
            $(event.currentTarget).removeClass('panel-collapsed');
            $(event.currentTarget).find('i').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
        }
        else {
            // collapse the panel
            $(event.currentTarget).parents('.panel').find('.panel-body').slideUp();
            $(event.currentTarget).addClass('panel-collapsed');
            $(event.currentTarget).find('i').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
        }
	},
	'click #tab_check_mygroovs': function (event) {
		//console.log('checked the my groovs tab selector');
		var currentTabList = Session.get('selectedTabs');
		if($(event.currentTarget).is(':checked')) // if checked
		{
			//console.log('it is checked!');
			if(_.isUndefined(_.findWhere(currentTabList,'me'))) //only if it is undefined and not already found in the playable tabs add it again
			{
				currentTabList.push('me');
				//console.log('changed tab list: ');
				//console.log(currentTabList);
				Session.set('selectedTabs', currentTabList);
			}
			return true;
		}
		else //unchecked
		{
			if(currentTabList.length > 1) //ensure that there is more than 1 tab available to play from
			{
				//console.log('it is UNCHECKED!');
				var currentLoc = _.indexOf(currentTabList, 'me');
				if(currentLoc >= 0) //only if it is undefined and not already found in the playable tabs add it again
				{
					currentTabList.splice(currentLoc, 1);
					//console.log('changed tab list: ');
					//console.log(currentTabList);
					Session.set('selectedTabs', currentTabList);
				}
				return true;
			}
			else if(currentTabList.length === 1) //only one tab left to play from, then you cannot deselect it, as there won't be any music to play
			{
				toastr.error("You cannot deselect the only remaining music tab!");
				return false;
			}
		}

	},
	'click #tab_check_tastemakers': function (event) {
		//console.log('checked the tastemakers tab selector');
		var currentTabList = Session.get('selectedTabs');
		if($(event.currentTarget).is(':checked')) // if checked
		{
			//console.log('it is checked!');
			if(_.isUndefined(_.findWhere(currentTabList,'friends'))) //only if it is undefined and not already found in the playable tabs add it again
			{
				currentTabList.push('friends');
				//console.log('changed tab list: ');
				//console.log(currentTabList);
				Session.set('selectedTabs', currentTabList);
			}
		}
		else //unchecked
		{
			if(currentTabList.length > 1) //ensure that there is more than 1 tab available to play from
			{
				//console.log('it is UNCHECKED!');
				var currentLoc = _.indexOf(currentTabList, 'friends');
				if(currentLoc >= 0) //only if it is undefined and not already found in the playable tabs add it again
				{
					currentTabList.splice(currentLoc, 1);
					//console.log('changed tab list: ');
					//console.log(currentTabList);
					Session.set('selectedTabs', currentTabList);
				}
			}
			else if(currentTabList.length === 1) //only one tab left to play from, then you cannot deselect it, as there won't be any music to play
			{
				toastr.error("You cannot deselect the only remaining music tab!");
				return false;
			}
		}
	},
	'click #tab_check_global': function (event) {
		//console.log('checked the global tab selector');
		var currentTabList = Session.get('selectedTabs');
		if($(event.currentTarget).is(':checked')) // if checked
		{
			//console.log('it is checked!');
			if(_.isUndefined(_.findWhere(currentTabList,'global'))) //only if it is undefined and not already found in the playable tabs add it again
			{
				currentTabList.push('global');
				//console.log('changed tab list: ');
				//console.log(currentTabList);
				Session.set('selectedTabs', currentTabList);
			}
		}
		else //unchecked
		{
			if(currentTabList.length > 1) //ensure that there is more than 1 tab available to play from
			{
				//console.log('it is UNCHECKED!');
				var currentLoc = _.indexOf(currentTabList, 'global');
				if(currentLoc >= 0) //only if it is undefined and not already found in the playable tabs add it again
				{
					currentTabList.splice(currentLoc, 1);
					//console.log('changed tab list: ');
					//console.log(currentTabList);
					Session.set('selectedTabs', currentTabList);
				}
			}
			else if(currentTabList.length === 1) //only one tab left to play from, then you cannot deselect it, as there won't be any music to play
			{
				toastr.error("You cannot deselect the only remaining music tab!");
				return false;
			}
		}
	}
});

Template.songFilter.helpers({
  playableTabs: function() {
    if(Meteor.user() && !_.isUndefined(Session.get('playableTabs')))
    {
    	var tabFilters = [];
    	if(!_.isUndefined(_.findWhere(Session.get('playableTabs') ,'me')))
    		tabFilters.push('<input id="tab_check_mygroovs" type="checkbox" aria-label="my groovs" checked>&nbsp;my groovs</input>');
    	else
    		tabFilters.push('<input id="tab_check_mygroovs" type="checkbox" aria-label="my groovs" disabled>&nbsp;my groovs</input>');

    	if(!_.isUndefined(_.findWhere(Session.get('playableTabs') ,'friends')))
    		tabFilters.push('<input id="tab_check_tastemakers" type="checkbox" aria-label="tastemakers" checked>&nbsp;tastemakers</input>');
    	else
    		tabFilters.push('<input id="tab_check_tastemakers" type="checkbox" aria-label="tastemakers" disabled>&nbsp;tastemakers</input>');

    	if(!_.isUndefined(_.findWhere(Session.get('playableTabs') ,'global')))
    		tabFilters.push('<input id="tab_check_global" type="checkbox" aria-label="global" checked>&nbsp;global</input>');
    	else
    		tabFilters.push('<input id="tab_check_global" type="checkbox" aria-label="global" disabled>&nbsp;global</input>');

    	return tabFilters;
    }
  }
});