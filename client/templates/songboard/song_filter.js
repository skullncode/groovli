Template.songFilter.onRendered(function () {
	$(".multipleGenreSelections").select2({
		placeholder: "type genres you like"
	});
	getAllGenres();
	$(".multipleGenreSelections").on("change", function (e) { genreSelectionChanged(e); });
	Session.set('selGens', undefined);
});

Template.songFilter.helpers({
  allGenres: function() {
    /*var g = Artists.find({}).fetch();
    console.log('this is the list of artists:');
    console.log(g);*/
    return Session.get('agens');
  }
});

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
	},
	'.multipleGenreSelections select2:change': function (event) {
		console.log('SOMETHING NEW HAS BEEN SELECTED FROM THE GENRE selector:');
		console.log(event);
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

function getAllGenres(){
  	var g = Artists.find({}, {fields: {"genres": 1}}).fetch();
  	var allGens = [];
	_.each(g, function(z){
		//console.log('THIS IS A GENRE: ');
		_.each(z.genres, function(y){
			if(!_.isNull(y) && !_.isEmpty(y))
			{
				y = y.replace(/-/g, ' ');
				y = y.replace(/'n'/g, ' and ');
				allGens.push(y);
			}
		});
	});
	//console.log('this is the master gen list: ');
	//console.log(allGens.length);

	allGens = _.uniq(allGens);
	allGens = _.without(allGens, null, undefined, 'all'); 

	//console.log('this is the unique gen list:');
	//console.log(allGens.length);

	Session.set('agens', allGens);
}

function genreSelectionChanged(event) {
	//console.log('SOMETHING NEW HAS BEEN SELECTED FROM THE GENRE selector:');
	//console.log(event.val);
	if(!_.isEmpty(event.val))
	{
		/*_.each(event.val, function(y){
			if(_.contains(y, '-') || _.contains(y, "'n'"))
			{
				y = y.replace(/-/g, ' ');
				y = y.replace(/'n'/g, ' and ');
				event.val.push(y);
			}
			else if(_.contains(y, ' '))
			{
				y = y.replace(/ /g, '-');
				event.val.push(y);
			}
		});
		var artistsForGenre = Artists.find({genres: {$in: event.val}}, {fields: {'name': 1}}).fetch();
		//console.log('FOUND THESE MANY ARTISTS MATCHING THE CURRENT SELECTION OF GENRES: ');
		//console.log(artistsForGenre);
		var cleanedArtistList = [];
		if(!_.isUndefined(artistsForGenre) && !_.isEmpty(artistsForGenre))
		{
			_.each(artistsForGenre, function(z){
				cleanedArtistList.push(z.name);
			});
		}
		//console.log(cleanedArtistList);
		var songsForGenre = Songs.find({sa: {$in: cleanedArtistList}}).fetch();
		console.log('FOUND THESE MANY SONGS for these selected genres: ');
		console.log(songsForGenre.length);*/
		Meteor.call('getSongsForGenres', event.val, function(error,result){
	        if(error){
	          console.log('Encountered error while trying to check if artist has page: ' + error)
	        }
	        else{
	            // do something with result
	          //console.log('for this genreList: ');
	          //console.log(event.val);
	          //console.log('got this LIST OF SONGS: ');
	          //console.log(result.length);
	          Session.set('genl', result);
	          //check to see if the current song playing at which the song filter was created matches with the current genre selection; if there is a match then the play count should include this song also
	          var currentlyPlayingArtist = Session.get('CS').sa.replace(/&/g, 'and');
	          //console.log('CURRENTLY PLAYING ARTIST: ' + currentlyPlayingArtist);
	          var foundArtistObjCurrentlyPlaying = Artists.findOne({name: {$regex: new RegExp(currentlyPlayingArtist, 'i')}});
	          //console.log('CURRENTLY PLAYING ARTIST OBJECT: ');
	          //console.log(foundArtistObjCurrentlyPlaying);

	          if(!_.isUndefined(foundArtistObjCurrentlyPlaying) && !_.isUndefined(foundArtistObjCurrentlyPlaying.genres))
	          {
		          if(_.isEmpty(_.intersection(_.map(foundArtistObjCurrentlyPlaying.genres, function(x){ if(_.contains(x, '-')){return x.replace(/-/,' ');}else{return x;}}), Session.get('selGens'))))
		          {
		          	//console.log(" NO MATCHES WITH CURRENTLY PLAYING SONG!!!!");
		          	Session.set('genPlayedLength', 0);
		          }
		          else
		          {
		          	//console.log("Selected GENRE MATCHES CURRENTLY PLAYING SONG!!!!!");
		          	Session.set('genPlayedLength', 1);
		          }
	      	  }
	      	  else
	      	  	Session.set('genPlayedLength', 0);

	          if(Session.get('genl').length <= 5)
	          	toastr.success("Genre selection updated to: <br><br><b><i>" + event.val + "<br><br> approximately "+Session.get('genl').length+" matching songs<br><br>NOTE: Select more genres to get more songs!</i></b><br><br> going forward, Groovli will only play songs matching the selected genres!");         
	          else
	          	toastr.success("Genre selection updated to: <br><br><b><i>" + event.val + "<br><br> approximately "+Session.get('genl').length+" matching songs</i></b><br><br> going forward, Groovli will only play songs matching the selected genres!");
	        };
	    });
	}
	else
	{
		toastr.success("All genre selections removed; going forward, Groovli will play all songs!");
	}

	Session.set('selGens', event.val);
}