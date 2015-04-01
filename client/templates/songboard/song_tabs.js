Template.songTabs.events({
	'click #songTabs a[href="#mygroovs"]': function (event) {
		console.log('CLICKED My Groovs TAB!');
		return true;
	},
	'click #songTabs a[href="#tastemakers"]': function (event) {
		console.log('CLICKED TASTEMAKERS TAB!');
		//Meteor.call('getSongsOfFriends');
		return true;
	},
	'click #songTabs a[href="#global"]': function (event) {
		console.log('CLICKED Global TAB!');
		return true;
	}
});