Template.songTabs.events({
	'click #songTabs a[href="#mygroovs"]': function (event) {
		//console.log('CLICKED My Groovs TAB!');
		Session.set('activeTab', 'me');
		return true;
	},
	'click #songTabs a[href="#tastemakers"]': function (event) {
		//console.log('CLICKED TASTEMAKERS TAB!');
		Session.set('activeTab', 'friends');
		//Meteor.call('getSongsOfFriends');
		return true;
	},
	'click #songTabs a[href="#global"]': function (event) {
		//console.log('CLICKED Global TAB!');
		Session.set('activeTab', 'global');
		return true;
	}
});